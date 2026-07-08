# --- New file: ecs-weather-app/alb-api-docs.tf ---
# Separate listener rule specifically for Swagger/API docs under your
# /reshma prefix. Only needed if you want api-docs routed independently
# from the general /reshma/* rule (e.g. different priority, or you want
# it to remain reachable even if the general app rule changes).

variable "api_docs_rule_priority" {
  description = "Priority for the api-docs specific rule. MUST be unique across all rules on this listener (different from listener_rule_priority)."
  type        = number
}

resource "aws_lb_listener_rule" "reshma_api_docs" {
  listener_arn = data.aws_lb_listener.http.arn
  priority     = var.api_docs_rule_priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }

  condition {
    path_pattern {
      values = ["/${var.path_prefix}/api-docs", "/${var.path_prefix}/api-docs/*"]
    }
  }
}

output "api_docs_url" {
  description = "URL to view Swagger UI"
  value       = "http://${data.aws_lb.existing.dns_name}/${var.path_prefix}/api-docs/"
}
