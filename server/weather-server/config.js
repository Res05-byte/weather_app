'use strict';
require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  host: process.env.HOST || 'localhost',
  env: process.env.NODE_ENV || 'development',
  apiKey: process.env.OPENWEATHER_API_KEY || '',
  api: {
    basePath: '/reshma/api/v1',
    docsPath: '/reshma/api-docs',
  },
  cors: {
    origin:
      process.env.CORS_ORIGIN ||
      'http://concproject-alb-1190008323.ap-south-1.elb.amazonaws.com',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};
