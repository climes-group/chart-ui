const BASE_GEOCODE_URL = "https://geocode.search.hereapi.com/v1/geocode";

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

function getApiKey() {
  const apiKey = import.meta.env.VITE_GEO_API_KEY;
  const useGeoApi = import.meta.env.VITE_FF_USE_GEO_API;
  return useGeoApi && apiKey;
}

/*
 * Search for an address
 * @param {string} query
 * @returns {Promise}
 */
export async function searchAddress(query) {
  try {
    const resp = await fetch(
      `${BASE_GEOCODE_URL}?q=${query}&apiKey=${getApiKey()}`,
    );
    const result = await resp.json();
    return result;
  } catch (e) {
    console.error(e);
    return {};
  }
}

/**
 * Look up human readable address from a geocode
 * @param {GeoCode} geoCode
 * @returns {string} human readable address
 */
export async function lookUpHumanAddress(geoCode) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return;
  }

  const baseGeoCodeApi = `https://geocode.search.hereapi.com/v1/geocode`;

  const finalUrl = `${baseGeoCodeApi}?at=${
    geoCode.queryStr
  }&apikey=${getApiKey()}`;
  console.log(finalUrl);
  try {
    const resp = await fetch(finalUrl);
    const jsonResp = await resp.json();
    console.log(jsonResp);
    if (jsonResp?.plus_code?.compound_code) {
      return jsonResp?.plus_code?.compound_code;
    }
  } catch (e) {
    console.error(e);
  }
  return "";
}
