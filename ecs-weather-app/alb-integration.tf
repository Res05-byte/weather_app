# --- New file: ecs-weather-app/alb-integration.tf ---
# Wires this service into the EXISTING shared ALB (concproject-alb) rather
# than creating a new load balancer. This assumes you don't own/manage the
# ALB itself — only a path prefix on it.

data "aws_lb" "existing" {
  name = var.alb_name
}

data "aws_lb_listener" "http" {
  load_balancer_arn = data.aws_lb.existing.arn
  port               = var.listener_port
}

# Security group for the ECS service's tasks. Only allows inbound traffic
# from the ALB's own security group(s) on the frontend port.
resource "aws_security_group" "service" {
  name_prefix = "${var.app_name}-reshma-svc-"
  description = "Allow inbound from concproject-alb only"
  vpc_id      = var.vpc_id

  ingress {
    description     = "From shared ALB"
    from_port       = var.frontend_port
    to_port         = var.frontend_port
    protocol        = "tcp"
    security_groups = data.aws_lb.existing.security_groups
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-reshma-svc-sg"
  }
}

resource "aws_lb_target_group" "app" {
  name        = "${var.app_name}-reshma-tg"
  port        = 4000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" # required for Fargate awsvpc networking

  health_check {
  path                = "/health"
  healthy_threshold   = 2
  unhealthy_threshold = 3
  interval            = 30
  timeout             = 5
  matcher             = "200"
}

  tags = {
    Name = "${var.app_name}-reshma-tg"
  }
}

# Path-based rule: only requests to /reshma or /reshma/* on the shared
# listener get forwarded to your target group. Other students' rules on
# the same listener are untouched.
resource "aws_lb_listener_rule" "reshma" {
  listener_arn = data.aws_lb_listener.http.arn
  priority     = var.listener_rule_priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }

  condition {
    path_pattern {
      values = ["/${var.path_prefix}", "/${var.path_prefix}/*"]
    }
  }
}
