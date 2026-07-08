'use strict';
const axios = require('axios');
const config = require('../config');

const BASE = 'https://api.openweathermap.org/data/2.5';

class WeatherService {

  static async getCurrentWeather({ city }) {
    try {
      const { data } = await axios.get(`${BASE}/weather`, {
        params: { q: city, appid: config.apiKey, units: 'metric' },
      });

      return {
        city: data.name,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        wind_speed: data.wind.speed,
      };
    } catch (err) {
      if (err.response?.status === 404) throw { status: 404, message: 'City not found' };
      throw { status: 500, message: 'Weather API error' };
    }
  }

  static async getForecast({ city }) {
    try {
      const { data } = await axios.get(`${BASE}/forecast`, {
        params: { q: city, appid: config.apiKey, units: 'metric', cnt: 40 },
      });

      // Group by day (API returns every 3 hours)
      const days = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) {
          days[date] = { highs: [], lows: [], description: item.weather[0].description, icon: item.weather[0].icon };
        }
        days[date].highs.push(item.main.temp_max);
        days[date].lows.push(item.main.temp_min);
      });

      return {
        city: data.city.name,
        days: Object.entries(days).slice(0, 5).map(([date, d]) => ({
          date,
          high: Math.max(...d.highs).toFixed(1),
          low: Math.min(...d.lows).toFixed(1),
          description: d.description,
          icon: d.icon,
        })),
      };
    } catch (err) {
      if (err.response?.status === 404) throw { status: 404, message: 'City not found' };
      throw { status: 500, message: 'Forecast API error' };
    }
  }
}

module.exports = WeatherService;
