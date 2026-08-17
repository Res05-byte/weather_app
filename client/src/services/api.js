// Use a path-aware base URL so the app works both locally and behind /reshma.
// Local: http://localhost:4000/api/v1
// ALB:   /reshma/api/v1
const getBaseUrl = () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    return 'http://localhost:4000/api/v1';
  }

  const currentPath = window.location.pathname || '/';
  const hasPrefix = currentPath.startsWith('/reshma');
  const prefix = hasPrefix ? '/reshma' : '';

  return `${prefix}/api/v1`;
};

const BASE_URL = getBaseUrl();

console.log("BASE_URL =", BASE_URL);

async function request(endpoint) {
  console.log("Fetching:", `${BASE_URL}${endpoint}`);

  const res = await fetch(`${BASE_URL}${endpoint}`);

  console.log("Status:", res.status);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export const weatherApi = {
  getCurrent: (city) =>
    request(`/weather/current?city=${encodeURIComponent(city)}`),

  getForecast: (city) =>
    request(`/weather/forecast?city=${encodeURIComponent(city)}`),
};