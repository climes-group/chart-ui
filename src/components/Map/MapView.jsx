import { GeoCode } from "@/utils/geocode";
import PropTypes from "prop-types";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

function MapView({ geoData }) {
  if (!geoData) return null;

  const geoCode = new GeoCode(geoData?.lat, geoData?.lng);

  return (
    <div>
      <MapContainer
        key={geoCode.str}
        center={[geoCode.lat, geoCode.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-96 w-full"
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
MapView.propTypes = {
  geoData: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

export default MapView;
