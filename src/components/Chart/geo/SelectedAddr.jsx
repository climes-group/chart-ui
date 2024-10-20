import { Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
const apiKey = import.meta.env.VITE_GEO_API_KEY;

export default function SelectedAddr({ humanAddr, geoData }) {
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
