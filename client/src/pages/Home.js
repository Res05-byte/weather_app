import React, { useState } from 'react';
import { weatherApi } from '../services/api';

function Home() {
  const [city, setCity]       = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

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
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') search(); };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1>🌤️ Weather App</h1>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter city name..."
          style={{ flex: 1, padding: '10px', fontSize: 16, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button onClick={search} style={{ padding: '10px 20px', fontSize: 16, borderRadius: 8, cursor: 'pointer' }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: 24, padding: 20, background: '#f0f4ff', borderRadius: 12 }}>
          <h2>{weather.city}</h2>
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} />
          <p style={{ fontSize: 48, margin: 0 }}>{Math.round(weather.temperature)}°C</p>
          <p>Feels like {Math.round(weather.feels_like)}°C · {weather.description}</p>
          <p>💧 Humidity: {weather.humidity}% &nbsp; 💨 Wind: {weather.wind_speed} m/s</p>
        </div>
      )}

      {forecast && (
        <div style={{ marginTop: 20 }}>
          <h3>5-Day Forecast</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {forecast.days.map((day) => (
              <div key={day.date} style={{ padding: 12, background: '#e8f4fd', borderRadius: 8, textAlign: 'center', minWidth: 90 }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{day.date.slice(5)}</p>
                <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt={day.description} />
                <p style={{ margin: 0 }}>↑{Math.round(day.high)}° ↓{Math.round(day.low)}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
