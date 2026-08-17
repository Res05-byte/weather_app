'use strict';
const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const path      = require('path');
const fs        = require('fs');
const jsYaml    = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const config = require('../config');
const WeatherController = require('./WeatherController');

// Load OpenAPI spec for Swagger UI
const specPath = path.join(__dirname, '..', 'api.yaml');
const apiSpec  = jsYaml.load(fs.readFileSync(specPath, 'utf8'));

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Swagger docs at /api-docs and /reshma/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
app.use('/reshma/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

// Routes
app.get(['/api/v1/weather/current', '/reshma/api/v1/weather/current'], WeatherController.getCurrentWeather);
app.get(['/api/v1/weather/forecast', '/reshma/api/v1/weather/forecast'], WeatherController.getForecast);

// Health check
app.get(['/health', '/reshma/health'], (req, res) => res.json({ status: 'ok' }));

module.exports = app;
