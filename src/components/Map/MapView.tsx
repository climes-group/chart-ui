import { GeoCode } from "@/utils/geocode";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type Props = {
  geoData?: { lat: number; lng: number };
  compact?: boolean;
};

function MapView({ geoData, compact }: Readonly<Props>) {
  if (!geoData) return null;

  const geoCode = new GeoCode(geoData.lat, geoData.lng);

  return (
    <div>
      <MapContainer
        key={geoCode.str}
        center={[geoCode.lat, geoCode.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className={compact ? "h-64 w-full" : "h-96 w-full"}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[geoCode.lat, geoCode.lng]}>
          <Popup>{geoCode.str}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;
