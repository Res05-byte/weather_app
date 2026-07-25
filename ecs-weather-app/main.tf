data "aws_ecs_cluster" "platform" {
  cluster_name = "concproject-cluster"
}

data "aws_iam_role" "ecs_execution_role" {
  name = "ecsTaskExecutionRole"
}