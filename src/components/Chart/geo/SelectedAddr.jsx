import { Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
const apiKey = import.meta.env.VITE_GEO_API_KEY;

export default function SelectedAddr({ humanAddr, geoData }) {
  return (
    <Container sx={{ marginTop: "2rem", marginBottom: "2rem" }} maxWidth="xl">
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Address </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Geo Code</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>{humanAddr}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          {geoData && (
            <Stack sx={{ textAlign: "right" }}>
              <div>Lat:&nbsp; {geoData.lat}</div>
              <div>Long: {geoData.lng} </div>
            </Stack>
          )}
        </Grid>
      </Grid>

      {humanAddr && (
        <iframe
          width="100%"
          height="250"
          frameborder="0"
          style={{ border: 0 }}
          referrerpolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${geoData.lat},${geoData.lng}&zoom=18&maptype=satellite`}
          allowfullscreen
        ></iframe>
      )}
    </Container>
  );
}
