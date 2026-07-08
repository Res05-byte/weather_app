# --- New file: ecs-weather-app/ecs-service.tf ---
# This is what your outputs.tf was already expecting
# (aws_ecs_task_definition.backend) but was never defined.

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.app_name}-reshma"
  retention_in_days = 14
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.app_name}-reshma"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  # NOTE: both containers run in the SAME task, sharing one network
  # namespace (awsvpc mode) — just like they shared one docker-compose
  # network. That means nginx must proxy to "localhost:4000", NOT
  # "server:4000" (there's no container-name DNS in awsvpc mode).
  # See the corrected nginx.conf provided alongside this file.
  container_definitions = jsonencode([
    {
      name      = "server"
      image     = var.image_backend
      essential = true
      portMappings = [
        { containerPort = var.backend_port, protocol = "tcp" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "server"
        }
      }
    },
    {
      name      = "client"
      image     = var.image_frontend
      essential = true
      portMappings = [
        { containerPort = var.frontend_port, protocol = "tcp" }
      ]
      dependsOn = [
        { containerName = "server", condition = "START" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "client"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "app" {
  name            = "${var.app_name}-reshma"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.service.id]
    assign_public_ip = true # set false if using private subnets + NAT
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "client"
    container_port   = var.frontend_port
  }

  # Ensure the listener rule (and thus target group registration) exists
  # before ECS tries to attach tasks to it.
  depends_on = [aws_lb_listener_rule.reshma]
}
