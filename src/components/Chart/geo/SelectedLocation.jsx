import useMedia from "@/hooks/useMedia";
import { GeoCode } from "@/utils/geocode";
import { Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import MapView from "../../Map/MapView";

function SelectedLocation({ humanAddr, geoData }) {
  const [isSmallDevice] = useMedia();
  const geoCode = new GeoCode(geoData?.lat, geoData?.lng);

  const containerSx = isSmallDevice
    ? {
        margin: "0rem",
        padding: "0rem",
      }
    : {
        marginTop: "2rem",
        marginBottom: "2rem",
      };

  return (
    <Container sx={containerSx} maxWidth="xl">
      {!isSmallDevice && (
        <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography>Address</Typography>
            <Typography>{humanAddr}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {geoData && (
              <Stack sx={{ textAlign: "left" }}>
                <Typography>Geo Code</Typography>
                {geoCode.str}
              </Stack>
            )}
          </Grid>
        </Grid>
      )}
      <MapView geoData={geoData} />
    </Container>
  );
}

SelectedLocation.propTypes = {
  humanAddr: PropTypes.string,
  geoData: PropTypes.object,
};

export default SelectedLocation;
