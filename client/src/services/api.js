// Dynamically set base URL based on environment
// Local development: http://localhost:4000/api/v1
// Production (ALB): /reshma/api/v1 (which nginx rewrites to /api/v1)
const getBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000/api/v1';
  }
  // Production: use the full path that nginx will rewrite
  // This assumes the app is served under /reshma/
  const pathPrefix = window.location.pathname.split('/')[1]; // Get 'reshma' from /reshma/...
  return `/${pathPrefix}/api/v1`;
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