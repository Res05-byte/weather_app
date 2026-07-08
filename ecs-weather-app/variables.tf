variable "aws_region" {
  default = "ap-south-1"
}

variable "app_name" {
  default = "weather-app"
}

variable "image_backend" {
  description = "ECR image URL for backend"
}

variable "image_frontend" {
  description = "ECR image URL for frontend"
}

variable "container_port" {
  default = 8000
}# --- Append these to your existing ecs-weather-app/variables.tf ---

variable "vpc_id" {
  description = "VPC ID that the existing concproject-alb and your ECS tasks live in"
  type        = string
}

variable "subnet_ids" {
  description = "Subnets for the ECS service's ENIs. Should be in the same VPC as the ALB (private subnets with NAT, or public subnets if assign_public_ip = true)"
  type        = list(string)
}

variable "alb_name" {
  description = "Name of the existing shared ALB to attach to"
  type        = string
  default     = "concproject-alb"
}

variable "listener_port" {
  description = "Port of the existing ALB listener to add the rule to"
  type        = number
  default     = 80
}

variable "path_prefix" {
  description = "Your path prefix on the shared ALB"
  type        = string
  default     = "reshma"
}

variable "listener_rule_priority" {
  description = "Priority for this listener rule. MUST be unique across all rules on this listener — ask whoever manages the ALB which numbers are free, or check in the console under Listeners > Rules."
  type        = number
}

variable "frontend_port" {
  description = "Port the client (nginx) container listens on"
  type        = number
  default     = 80
}

variable "backend_port" {
  description = "Port the server (express) container listens on"
  type        = number
  default     = 4000
}

variable "task_cpu" {
  description = "Fargate task CPU units"
  type        = string
  default     = "256"
}

variable "task_memory" {
  description = "Fargate task memory (MiB)"
  type        = string
  default     = "512"
}

variable "desired_count" {
  description = "Number of running tasks"
  type        = number
  default     = 1
}
