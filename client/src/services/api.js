// Use a relative URL.  In development, Create React App proxies this to the
// backend; in Docker, nginx proxies it.  This avoids the browser trying to
// reach port 4000 directly when the frontend is served on port 80.
const getBaseUrl = () => {
  const configuredUrl = process.env.REACT_APP_API_BASE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const currentPath = window.location.pathname || '/';
  const hasPrefix = currentPath.startsWith('/reshma');
  const prefix = hasPrefix ? '/reshma' : '';

  return `${prefix}/api/v1`;
};

const BASE_URL = getBaseUrl();

async function request(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    const contentType = res.headers?.get?.('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await res.json();
      throw new Error(body.error || `Request failed (${res.status})`);
    }

    const body = await res.text();
    throw new Error(body || `Request failed (${res.status})`);
  }

  return res.json();
}

export const weatherApi = {
  getCurrent: (city) =>
    request(`/weather/current?city=${encodeURIComponent(city)}`),

  getForecast: (city) =>
    request(`/weather/forecast?city=${encodeURIComponent(city)}`),
};
