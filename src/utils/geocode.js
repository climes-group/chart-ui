const BASE_GEOCODE_URL = "https://geocode.search.hereapi.com/v1/geocode";
const apiKey = import.meta.env.VITE_GEO_API_KEY;
const useGeoApi = import.meta.env.VITE_FF_USE_GEO_API;

export async function searchAddress(query) {
  const resp = await fetch(`${BASE_GEOCODE_URL}?q=${query}&apiKey=${apiKey}`);
  const result = await resp.json();
  return result;
}
