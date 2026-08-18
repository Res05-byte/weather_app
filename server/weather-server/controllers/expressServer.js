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

app.use(cors(config.cors));
app.use(express.json());
app.use(morgan('dev'));

// Public Reshma API routes are configured in one place for deployment consistency.
app.use(config.api.docsPath, swaggerUi.serve, swaggerUi.setup(apiSpec));

// Routes
app.get(`${config.api.basePath}/weather/current`, WeatherController.getCurrentWeather);
app.get(`${config.api.basePath}/weather/forecast`, WeatherController.getForecast);

// Health check
app.get('/reshma/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
