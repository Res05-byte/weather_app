'use strict';
const WeatherController = require('./WeatherController');
const WeatherService = require('../services/WeatherSevice');

// Mock WeatherService
jest.mock('../services/WeatherSevice');

describe('WeatherController', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should return current weather for a city', async () => {
      const mockWeather = {
        city: 'London',
        temperature: 15,
        feels_like: 13,
        humidity: 80,
        description: 'cloudy',
        icon: '04d',
        wind_speed: 10,
      };

      req.query.city = 'London';
      WeatherService.getCurrentWeather.mockResolvedValue(mockWeather);

      await WeatherController.getCurrentWeather(req, res);

      expect(res.json).toHaveBeenCalledWith(mockWeather);
    });

    it('should return 400 if city param is missing', async () => {
      req.query.city = '';

      await WeatherController.getCurrentWeather(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'city query param is required',
      });
    });

    it('should handle service errors', async () => {
      req.query.city = 'London';
      const error = { status: 500, message: 'Weather API error' };
      WeatherService.getCurrentWeather.mockRejectedValue(error);

      await WeatherController.getCurrentWeather(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Weather API error' });
    });
  });

  describe('getForecast', () => {
    it('should return forecast for a city', async () => {
      const mockForecast = {
        city: 'London',
        days: [
          { date: '2024-01-01', high: 15, low: 10, description: 'cloudy', icon: '04d' },
          { date: '2024-01-02', high: 12, low: 8, description: 'rainy', icon: '09d' },
        ],
      };

      req.query.city = 'London';
      WeatherService.getForecast.mockResolvedValue(mockForecast);

      await WeatherController.getForecast(req, res);

      expect(res.json).toHaveBeenCalledWith(mockForecast);
    });

    it('should return 400 if city param is missing', async () => {
      req.query.city = '';

      await WeatherController.getForecast(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'city query param is required',
      });
    });

    it('should handle service errors', async () => {
      req.query.city = 'London';
      const error = { status: 500, message: 'Forecast API error' };
      WeatherService.getForecast.mockRejectedValue(error);

      await WeatherController.getForecast(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forecast API error' });
    });
  });
});
