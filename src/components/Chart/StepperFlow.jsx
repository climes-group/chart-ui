import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@uidotdev/usehooks";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { jumpToStep } from "../../state/slices/flowReducer";
import ApplicableSystemsCard from "./Flow/Cards/ApplicableSystemsCard";
import SiteLocationCard from "./Flow/Cards/SiteLocationCard";

const StepHeading = styled.h2`
  margin-top: 0px;
`;

const InnerFrame = styled.div`
  flex-grow: 1;
  position: relative;
`;

const SampleCard = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: repeating-linear-gradient(
    45deg,
    rgb(255, 255, 255),
    rgb(255, 255, 255) 10px,
    rgba(226, 176, 70, 0.5) 10px,
    rgba(226, 176, 70, 0.5) 20px
  );
`;

const steps = [
  {
    name: "intake",
    label: "Intake",
    enterCond: [],
    leaveCond: [(state) => state.geo.geoData],
  },
  {
    name: "siteLocation",
    label: "Site Location",
    enterCond: [],
    leaveCond: [(state) => state.geo.geoData],
  },
  {
    name: "applicableSystems",
    label: "System Inventory",
    enterCond: [(state) => state.geo.geoData],
    leaveCond: [],
  },
  { name: "summary", label: "Summary" },
  { name: "report", label: "Report" },
];

function renderInnerCard(currStep) {
  const { name } = currStep;
  switch (name) {
    case "siteLocation":
      return <SiteLocationCard />;
    case "applicableSystems":
      return <ApplicableSystemsCard />;
    default:
      return <SampleCard>Lorem</SampleCard>;
      break;
  }
}

export default function StepperFlow() {
  const activeStep = useSelector((s) => s.flow.currentStepInd);

  const dispatch = useDispatch();

  const [completed, setCompleted] = React.useState({});
  const [errorMsg, setErrorMsg] = React.useState("");

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 992px)",
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 993px) and (max-width : 1200px)",
  );
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width : 1201px)",
  );

  const theme = useTheme();

  const handleNext = () => {
    // check leave condition
    const { leaveCond } = steps[activeStep];

    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    dispatch(jumpToStep(newActiveStep));
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const handleBack = () => {
    dispatch(jumpToStep(activeStep - 1));
  };

  const handleStep = (step) => () => {
    dispatch(jumpToStep(step));
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const DesktopStepper = (
    <Stepper nonLinear activeStep={activeStep}>
      {steps.map((stepObj, index) => (
        <Step key={stepObj.label} completed={completed[index]}>
          <StepButton color="inherit" onClick={handleStep(index)}>
            {stepObj.label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );

  const DesktopStepperControl = (
    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
      <Button
        color="inherit"
        disabled={activeStep === 0}
        onClick={handleBack}
        sx={{ mr: 1 }}
      >
        Back
      </Button>
      <Box sx={{ flex: "1 1 auto" }} />
      <Button onClick={handleNext} sx={{ mr: 1 }}>
        Next
      </Button>
      {activeStep !== steps.length &&
        (completed[activeStep] ? (
          <Typography variant="caption" sx={{ display: "inline-block" }}>
            Step {activeStep + 1} already completed
          </Typography>
        ) : (
          <Button onClick={handleComplete}>
            {completedSteps() === totalSteps() - 1 ? "Finish" : "Complete Step"}
          </Button>
        ))}
    </Box>
  );

  const MobileStepperControls = (
    <MobileStepper
      variant="progress"
      steps={steps.length}
      position="static"
      activeStep={activeStep}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
          Next
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
      }
    />
  );

  return (
    <Container sx={{ padding: "1rem" }}>
      {!isSmallDevice && DesktopStepper}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "0.5px solid",
          padding: "1rem",
          minHeight: "90vh",
        }}
      >
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <StepHeading>
              Step {activeStep + 1} - {steps[activeStep]?.label}
            </StepHeading>
            <InnerFrame>{renderInnerCard(steps[activeStep])}</InnerFrame>
            <Typography textAlign={"left"}>{errorMsg}</Typography>
            {isSmallDevice ? MobileStepperControls : DesktopStepperControl}
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
}
