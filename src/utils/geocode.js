const BASE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const apiKey = import.meta.env.VITE_GEO_API_KEY;
const useGeoApi = import.meta.env.VITE_FF_USE_GEO_API;

export async function searchAddress(query) {
  const resp = await fetch(
    `${BASE_GEOCODE_URL}?key=${apiKey}&address=${query}`,
  );
  const result = await resp.json();
  return result;
}
