const BASE_URL = "http://localhost:4000/api/v1";

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