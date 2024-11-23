const BASE_GEOCODE_URL = "https://geocode.search.hereapi.com/v1/geocode";
const apiKey = import.meta.env.VITE_GEO_API_KEY;
const useGeoApi = import.meta.env.VITE_FF_USE_GEO_API;

export async function searchAddress(query) {
  const resp = await fetch(`${BASE_GEOCODE_URL}?q=${query}&apiKey=${apiKey}`);
  const result = await resp.json();
  return result;
}

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

    return {
      lat: {
        deg: latDeg,
        min: latMin,
        sec: latSec,
        dir: lat >= 0 ? "N" : "S",
      },
      lng: {
        deg: lngDeg,
        min: lngMin,
        sec: lngSec,
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
  get obj() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }
}

export async function lookUpHumanAddress(geoCode) {
  if (!apiKey || useGeoApi !== "true") {
    return;
  }

  const baseGeoCodeApi = `https://geocode.search.hereapi.com/v1/geocode`;

  const finalUrl = `${baseGeoCodeApi}?q=${geoCode.str}&apikey=${apiKey}`;
  console.log(finalUrl);
  try {
    const resp = await fetch(finalUrl);
    const jsonResp = await resp.json();

    if (jsonResp?.plus_code?.compound_code) {
      return jsonResp?.plus_code?.compound_code;
    }
  } catch (e) {
    console.error(e);
  }
  return "";
}
