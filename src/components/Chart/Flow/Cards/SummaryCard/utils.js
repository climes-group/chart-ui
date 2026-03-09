function formatLatLong(lat, long) {
  const latAbs = Math.abs(lat);
  const longAbs = Math.abs(long);

  const latDeg = Math.floor(latAbs);
  const latMin = Math.floor((latAbs - latDeg) * 60);
  const latSec = (latAbs - latDeg - latMin / 60) * 3600;

  const longDeg = Math.floor(longAbs);
  const longMin = Math.floor((longAbs - longDeg) * 60);
  const longSec = (longAbs - longDeg - longMin / 60) * 3600;

  const roundedLatSec = Math.round(latSec * 100) / 100;
  const roundedLongSec = Math.round(longSec * 100) / 100;

  return `${latDeg}°${latMin}'${roundedLatSec}"${
    lat >= 0 ? "N" : "S"
  } ${longDeg}°${longMin}'${roundedLongSec}"${long >= 0 ? "E" : "W"}`;
}

export { formatLatLong };
