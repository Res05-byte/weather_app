'use strict';
const WeatherService = require('../services/WeatherService');

class WeatherController {

  static async getCurrentWeather(req, res) {
    try {
      const { city } = req.query;
      if (!city) return res.status(400).json({ error: 'city query param is required' });
      const data = await WeatherService.getCurrentWeather({ city });
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  static async getForecast(req, res) {
    try {
      const { city } = req.query;
      if (!city) return res.status(400).json({ error: 'city query param is required' });
      const data = await WeatherService.getForecast({ city });
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = WeatherController;
