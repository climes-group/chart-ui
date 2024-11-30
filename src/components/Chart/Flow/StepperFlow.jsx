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
import PropTypes from "prop-types";
import * as React from "react";
import styled from "styled-components";
import useFlow from "../../../hooks/useFlow";
import useMedia from "../../../hooks/useMedia";
import ApplicableSystemsCard from "./Cards/ApplicableSystemsCard";
import SiteLocationCard from "./Cards/SiteLocationCard";
import IntakeCard from "./Flow/Cards/IntakeCard";
import ReportCard from "./Flow/Cards/ReportCard";

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

const CardWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  border: 1px solid;
  padding: 1rem;
  min-height: 90vh;
  @media (max-width: 767px) {
    border: 0px;
    padding: 0.5rem;
  }
`;

const steps = [
  {
    name: "intake",
    label: "Intake",
    enterCond: [],
    leaveCond: (state) => state,
  },
  {
    name: "siteLocation",
    label: "Site Location",
    enterCond: [],
    leaveCond: (state) => state,
  },
  {
    name: "applicableSystems",
    label: "System Inventory",
    enterCond: [(state) => state],
    leaveCond: (state) => state,
  },
  {
    name: "summary",
    label: "Summary",
    enterCond: [],
    leaveCond: (state) => state,
  },
  { name: "report", label: "Report" },
];

function renderInnerCard(currStep) {
  if (!currStep) {
    return null;
  }
  const { name } = currStep;
  switch (name) {
    case "intake":
      return <IntakeCard />;
    case "siteLocation":
      return <SiteLocationCard activeStep={currStep} />;
    case "applicableSystems":
      return <ApplicableSystemsCard activeStep={currStep} />;
    case "report":
      return <ReportCard />;
    default:
      return <SampleCard activeStep={currStep}>Lorem</SampleCard>;
  }
}

function StepperFlow({ steps }) {
  const [completed, setCompleted] = React.useState({});
  const [errorMsg, setErrorMsg] = React.useState("");

  const [isSmallDevice] = useMedia();

  const { currentStep, done, next, back, jumpTo } = useFlow(steps);

  const theme = useTheme();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    console.log(completedSteps(), totalSteps());
    return completedSteps() === totalSteps();
  };

  const handleComplete = () => {
    setCompleted((x) => ({ ...x, [currentStep.id]: true }));
    done();
    next();
  };

  const handleReset = () => {};

  const DesktopStepper = (
    <Stepper nonLinear activeStep={currentStep?.id} sx={{ padding: "2em 0" }}>
      {steps.map((stepObj, index) => (
        <Step key={stepObj.label} completed={completed[index]}>
          <StepButton color="inherit" onClick={() => jumpTo(index)}>
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
        disabled={currentStep?.prev === null}
        onClick={back}
        sx={{ mr: 1 }}
      >
        Back
      </Button>
      <Box sx={{ flex: "1 1 auto" }} />
      <Button onClick={next} sx={{ mr: 1 }}>
        Next
      </Button>
      {currentStep?.done ? (
        <Typography variant="caption" sx={{ display: "inline-block" }}>
          Step already completed
        </Typography>
      ) : (
        <Button onClick={handleComplete}>
          {currentStep?.next === undefined ? "Finish" : "Complete Step"}
        </Button>
      )}
    </Box>
  );

  const MobileStepperControls = (
    <MobileStepper
      variant="progress"
      steps={steps.length}
      position="static"
      activeStep={currentStep?.id}
      nextButton={
        <Button
          size="small"
          onClick={next}
          disabled={currentStep?.next === null}
        >
          Next
          <KeyboardArrowRight />
        </Button>
      }
      backButton={
        <Button
          size="small"
          onClick={back}
          disabled={currentStep?.prev === null}
        >
          <KeyboardArrowLeft />
          Back
        </Button>
      }
    />
  );

  return (
    <Container sx={{ padding: "1rem" }}>
      {!isSmallDevice && DesktopStepper}
      <CardWrapper>
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
            {!isSmallDevice && (
              <StepHeading>Step {currentStep?.label}</StepHeading>
            )}
            <InnerFrame>{renderInnerCard(currentStep)}</InnerFrame>
            <Typography textAlign={"left"}>{errorMsg}</Typography>
            {isSmallDevice ? MobileStepperControls : DesktopStepperControl}
          </React.Fragment>
        )}
      </CardWrapper>
    </Container>
  );
}

StepperFlow.defaultProps = {
  steps: [],
};

StepperFlow.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object),
};

export default StepperFlow;
