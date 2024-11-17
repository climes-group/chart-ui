import PropTypes from "prop-types";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import styled from "styled-components";

const apiKey = import.meta.env.VITE_GEO_API_KEY;

const Root = styled.div`
  & > div {
    height: 400px;
    width: 100%;
  }
`;

function MapView({ geoData }) {
  if (!geoData) return null;

  const position = [geoData.lat, geoData.lng];

  return (
    <Root>
      <MapContainer
        key={`${geoData.lat}-${geoData.lng}`}
        center={position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Latitude: {geoData.lat}
            <br />
            Longitude: {geoData.lng}
          </Popup>
        </Marker>
      </MapContainer>
    </Root>
  );
}
MapView.propTypes = {
  geoData: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default MapView;
