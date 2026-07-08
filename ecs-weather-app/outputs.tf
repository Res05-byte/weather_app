output "cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "task_definition" {
  value = aws_ecs_task_definition.backend.family
}# --- Append these to your existing ecs-weather-app/outputs.tf ---

output "service_url" {
  description = "URL to reach your app through the shared ALB"
  value       = "http://${data.aws_lb.existing.dns_name}/${var.path_prefix}/"
}

output "target_group_arn" {
  value = aws_lb_target_group.app.arn
}

output "listener_rule_arn" {
  value = aws_lb_listener_rule.reshma.arn
}
