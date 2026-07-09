// PUBLIC_URL is empty for root deploys (e.g. local docker-compose) and
// becomes the ALB path prefix (e.g. "/reshma") for the shared-ALB build,
// set via the PUBLIC_URL build arg in Dockerfile.client. Requests then go
// through the same-origin nginx, which proxies them to the backend.
function getBaseUrl() {
  const explicitBase = process.env.REACT_APP_API_BASE_URL || process.env.PUBLIC_URL || '';
  if (explicitBase) {
    return `${explicitBase.replace(/\/$/, '')}/api/v1`;
  }

  if (typeof window !== 'undefined') {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0] || '';
    const inferredBase = firstSegment && firstSegment !== 'api' && firstSegment !== 'api-docs' ? `/${firstSegment}` : '';
    return `${inferredBase}/api/v1`;
  }

  return '/api/v1';
}

const BASE_URL = getBaseUrl();

async function request(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) {
    const contentType = res.headers?.get?.('content-type') || '';
    let message = 'Request failed';

    if (contentType.includes('application/json')) {
      const err = await res.json();
      message = err.error || err.message || message;
    } else {
      message = await res.text();
    }

    throw new Error(message || 'Request failed');
  }
  return res.json();
}

export const weatherApi = {
  getCurrent: (city) => request(`/weather/current?city=${encodeURIComponent(city)}`),
  getForecast: (city) => request(`/weather/forecast?city=${encodeURIComponent(city)}`),
};
