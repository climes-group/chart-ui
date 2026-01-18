const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
// Nominatim requires a custom User-Agent header for API requests.
// Replace with your actual app name and contact email.
const USER_AGENT = "chart@climesgroup.ca";

export class GeoCode {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }

  formatAsDMS() {
    const lat = this.lat;
    const lng = this.lng;

    const latAbs = Math.abs(lat);
    const lngAbs = Math.abs(lng);

    const latDeg = Math.floor(latAbs);
    const latMin = Math.floor((latAbs - latDeg) * 60);
    const latSec = (latAbs - latDeg - latMin / 60) * 3600;

    const lngDeg = Math.floor(lngAbs);
    const lngMin = Math.floor((lngAbs - lngDeg) * 60);
    const lngSec = (lngAbs - lngDeg - lngMin / 60) * 3600;

    const roundedLatSec = Math.round(latSec * 100) / 100;
    const roundedLngSec = Math.round(lngSec * 100) / 100;

    return {
      lat: {
        deg: latDeg,
        min: latMin,
        sec: roundedLatSec,
        dir: lat >= 0 ? "N" : "S",
      },
      lng: {
        deg: lngDeg,
        min: lngMin,
        sec: roundedLngSec,
        dir: lng >= 0 ? "E" : "W",
      },
    };
  }

  get str() {
    const dmsFormat = this.formatAsDMS();
    return `${dmsFormat.lat.deg}°${
      dmsFormat.lat.min
    }'${dmsFormat.lat.sec.toFixed(2)}"${dmsFormat.lat.dir} ${
      dmsFormat.lng.deg
    }°${dmsFormat.lng.min}'${dmsFormat.lng.sec.toFixed(2)}"${
      dmsFormat.lng.dir
    }`;
  }

  get queryStr() {
    return `${this.lat},${this.lng}`;
  }

  get obj() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }
}

/**
 * Search for an address using Nominatim
 * @param {string} query
 * @returns {Promise<{items: Array}>}
 */
export async function searchAddress(query) {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
  });

  try {
    const resp = await fetch(
      `${NOMINATIM_BASE_URL}/search?${params.toString()}`,
      {
        headers: { "User-Agent": USER_AGENT },
      },
    );
    const result = await resp.json();

    // Map the Nominatim response to the format your app expects
    const mappedItems = result.map((item) => ({
      id: item.place_id,
      address: {
        label: item.display_name,
      },
      position: {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      },
    }));

    return { items: mappedItems };
  } catch (e) {
    console.error(e);
    return { items: [] };
  }
}

/**
 * Look up human readable address from a geocode using Nominatim
 * @param {GeoCode} geoCode
 * @returns {Promise<string>} human readable address
 */
export async function lookUpHumanAddress(geoCode) {
  if (
    !geoCode ||
    typeof geoCode.lat === "undefined" ||
    typeof geoCode.lng === "undefined"
  ) {
    return "";
  }

  const params = new URLSearchParams({
    lat: geoCode.lat,
    lon: geoCode.lng,
    format: "json",
  });

  try {
    const resp = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?${params.toString()}`,
      {
        headers: { "User-Agent": USER_AGENT },
      },
    );
    const jsonResp = await resp.json();

    return jsonResp?.display_name || "";
  } catch (e) {
    console.error(e);
  }
  return "";
}
