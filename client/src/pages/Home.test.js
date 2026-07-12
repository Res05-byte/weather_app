import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import * as api from '../services/api';

// Mock the API
jest.mock('../services/api');

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders weather app title', () => {
    render(<Home />);
    expect(screen.getByText(/🌤️ Weather App/i)).toBeInTheDocument();
  });

  test('renders search input and button', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText(/Enter city name.../i)).toBeInTheDocument();
    expect(screen.getByText(/Search/)).toBeInTheDocument();
  });

  test('searches for weather on button click', async () => {
    const mockWeather = {
      city: 'London',
      temperature: 15,
      feels_like: 13,
      humidity: 80,
      description: 'cloudy',
      icon: '04d',
      wind_speed: 10,
    };

    const mockForecast = {
      city: 'London',
      days: [
        { date: '2024-01-01', high: 15, low: 10, description: 'cloudy', icon: '04d' },
        { date: '2024-01-02', high: 12, low: 8, description: 'rainy', icon: '09d' },
      ],
    };

    api.weatherApi.getCurrent.mockResolvedValue(mockWeather);
    api.weatherApi.getForecast.mockResolvedValue(mockForecast);

    render(<Home />);

    const input = screen.getByPlaceholderText(/Enter city name.../i);
    const button = screen.getByText(/Search/);

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/London/)).toBeInTheDocument();
      expect(screen.getByText(/15°C/)).toBeInTheDocument();
    });

    expect(api.weatherApi.getCurrent).toHaveBeenCalledWith('London');
    expect(api.weatherApi.getForecast).toHaveBeenCalledWith('London');
  });

  test('displays error message on API failure', async () => {
    const errorMessage = 'City not found';
    api.weatherApi.getCurrent.mockRejectedValue(new Error(errorMessage));

    render(<Home />);

    const input = screen.getByPlaceholderText(/Enter city name.../i);
    const button = screen.getByText(/Search/);

    fireEvent.change(input, { target: { value: 'InvalidCity' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage))).toBeInTheDocument();
    });
  });

  test('searches on Enter key press', async () => {
    const mockWeather = {
      city: 'Paris',
      temperature: 12,
      feels_like: 10,
      humidity: 75,
      description: 'partly cloudy',
      icon: '02d',
      wind_speed: 8,
    };

    const mockForecast = {
      city: 'Paris',
      days: [
        { date: '2024-01-01', high: 12, low: 8, description: 'partly cloudy', icon: '02d' },
      ],
    };

    api.weatherApi.getCurrent.mockResolvedValue(mockWeather);
    api.weatherApi.getForecast.mockResolvedValue(mockForecast);

    render(<Home />);

    const input = screen.getByPlaceholderText(/Enter city name.../i);
    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText(/Paris/)).toBeInTheDocument();
    });

    expect(api.weatherApi.getCurrent).toHaveBeenCalledWith('Paris');
  });

  test('clears previous results on new search', async () => {
    const mockWeather1 = {
      city: 'London',
      temperature: 15,
      feels_like: 13,
      humidity: 80,
      description: 'cloudy',
      icon: '04d',
      wind_speed: 10,
    };

    const mockWeather2 = {
      city: 'Paris',
      temperature: 12,
      feels_like: 10,
      humidity: 75,
      description: 'sunny',
      icon: '01d',
      wind_speed: 8,
    };

    api.weatherApi.getCurrent.mockResolvedValueOnce(mockWeather1);
    api.weatherApi.getForecast.mockResolvedValueOnce({
      city: 'London',
      days: [],
    });

    const { rerender } = render(<Home />);

    let input = screen.getByPlaceholderText(/Enter city name.../i);
    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(screen.getByText(/Search/));

    await waitFor(() => {
      expect(screen.getByText(/London/)).toBeInTheDocument();
    });

    api.weatherApi.getCurrent.mockResolvedValueOnce(mockWeather2);
    api.weatherApi.getForecast.mockResolvedValueOnce({
      city: 'Paris',
      days: [],
    });

    rerender(<Home />);
    input = screen.getByPlaceholderText(/Enter city name.../i);
    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText(/Search/));

    await waitFor(() => {
      expect(screen.getByText(/Paris/)).toBeInTheDocument();
    });
  });
});
