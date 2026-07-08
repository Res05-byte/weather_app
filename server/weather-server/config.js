'use strict';
require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  host: process.env.HOST || '0.0.0.0',
  apiKey: process.env.OPENWEATHER_API_KEY || '',
  api: {
    basePath: '/api/v1',
    docsPath: '/api-docs',
  },
};