import { weatherApi } from './api';

describe('weatherApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('throws a readable error when the backend returns a plain-text failure', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      headers: {
        get: () => 'text/plain',
      },
      text: async () => 'Service unavailable',
    });

    await expect(weatherApi.getCurrent('London')).rejects.toThrow('Service unavailable');
  });

  it('successfully fetches current weather data', async () => {
    const mockData = {
      city: 'London',
      temperature: 15,
      feels_like: 13,
      humidity: 80,
      description: 'cloudy',
      icon: '04d',
      wind_speed: 10,
    };

    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => mockData,
    });

    const result = await weatherApi.getCurrent('London');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/weather/current'));
  });

  it('successfully fetches forecast data', async () => {
    const mockData = {
      city: 'London',
      days: [
        { date: '2024-01-01', high: 15, low: 10, description: 'cloudy', icon: '04d' },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => mockData,
    });

    const result = await weatherApi.getForecast('London');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/weather/forecast'));
  });

  it('handles JSON error responses', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ error: 'City not found' }),
    });

    await expect(weatherApi.getCurrent('InvalidCity')).rejects.toThrow('City not found');
  });

  it('properly encodes city names in URLs', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ city: 'New York' }),
    });

    await weatherApi.getCurrent('New York');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('city=New%20York'));
  });
});
