import useMedia from "@/hooks/useMedia";
import { GeoCode } from "@/utils/geocode";
import { Box, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import MapView from "../../Map/MapView";

function SelectedLocation({ humanAddr, geoData }) {
  const [isSmallDevice] = useMedia();

  if (!geoData && !humanAddr) {
    return null;
  }

  const geoCode = geoData ? new GeoCode(geoData.lat, geoData.lng) : null;

  if (isSmallDevice) {
    return (
      <Box sx={{ mt: 4 }}>
        {humanAddr && <Typography variant="h6">{humanAddr}</Typography>}
        {geoCode && (
          <Typography variant="body2" color="text.secondary">
            {geoCode.str}
          </Typography>
        )}
        <Box sx={{ pt: 2 }}>
          <MapView geoData={geoData} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <div>
        <Typography variant="h6" gutterBottom>
          Selected Location
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" display="block">
              Address
            </Typography>
            <Typography>{humanAddr || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" display="block">
              Geo-coordinates
            </Typography>
            <Typography>{geoCode ? geoCode.str : "N/A"}</Typography>
          </Grid>
        </Grid>
      </div>
      <MapView geoData={geoData} />
    </Box>
  );
}

SelectedLocation.propTypes = {
  humanAddr: PropTypes.string,
  geoData: PropTypes.object,
};

export default SelectedLocation;
