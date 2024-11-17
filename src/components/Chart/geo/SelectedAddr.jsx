import { Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";
import MapView from "../../Map/MapView";

function SelectedAddr({ humanAddr, geoData }) {
  return (
    <Container sx={{ marginTop: "2rem", marginBottom: "2rem" }} maxWidth="xl">
      <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography>Address </Typography>
          <Typography>{humanAddr}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {geoData && (
            <Stack sx={{ textAlign: "left" }}>
              <Typography>Geo Code</Typography>
              <div>Lat:&nbsp; {geoData.lat}</div>
              <div>Long: {geoData.lng} </div>
            </Stack>
          )}
        </Grid>
      </Grid>
      <MapView geoData={geoData} />
    </Container>
  );
}

SelectedAddr.propTypes = {
  humanAddr: PropTypes.string,
  geoData: PropTypes.object,
};

export default SelectedAddr;
