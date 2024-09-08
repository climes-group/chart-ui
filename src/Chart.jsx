import { Divider, Typography } from "@mui/material";
import StepperFlow from "./components/Chart/StepperFlow";
function Chart() {
  return (
    <>
      <Typography variant="h4">CHART</Typography>

      <Divider sx={{ margin: "2rem" }} />
      <StepperFlow />
    </>
  );
}

export default Chart;
