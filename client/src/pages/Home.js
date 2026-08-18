import React, { useState } from 'react';
import { weatherApi } from '../services/api';

function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      const [w, f] = await Promise.all([
        weatherApi.getCurrent(city),
        weatherApi.getForecast(city),
      ]);

      setWeather(w);
      setForecast(f);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') search();
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1>🌤️ Weather App</h1>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter city name..."
          style={{ flex: 1, padding: '10px', fontSize: 16 }}
        />
        <button onClick={search}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.city}</h2>
          <p>{weather.temperature}°C</p>
          <p>{weather.description}</p>
        </div>
      )}

      {forecast && (
        <div>
          <h3>Forecast</h3>
          {forecast.days.map(day => (
            <div key={day.date}>
              {day.date} - {day.high}° / {day.low}°
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
