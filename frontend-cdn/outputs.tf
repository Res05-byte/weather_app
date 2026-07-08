output "s3_bucket_name" {
  description = "Name of the S3 bucket used for frontend assets"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_url" {
  description = "Public URL for the frontend"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}
