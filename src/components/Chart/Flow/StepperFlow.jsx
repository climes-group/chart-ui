import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useFlow from "@/hooks/useFlow";
import useMedia from "@/hooks/useMedia";
import { Box } from "@mui/material";
import MobileStepper from "@mui/material/MobileStepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import PropTypes from "prop-types";
import * as React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ApplicableSystemsCard from "./Cards/ApplicableSystemsCard";
import IntakeCard from "./Cards/IntakeCard";
import ReportCard from "./Cards/ReportCard";
import SiteLocationCard from "./Cards/SiteLocationCard";

function renderInnerCard(currStep) {
  const { name } = currStep;
  switch (name) {
    case "intake":
      return <IntakeCard activeStep={currStep} />;
    case "siteLocation":
      return <SiteLocationCard activeStep={currStep} />;
    case "applicableSystems":
      return <ApplicableSystemsCard activeStep={currStep} />;
    case "report":
      return <ReportCard />;
    default:
      return (
        <div className="">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam
          velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate
          commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed
          eleifend tristique, tort
        </div>
      );
  }
}

function StepperFlow({ steps }) {
  const errorMessage = useSelector((s) => s.flow.error);

  const [isSmallDevice] = useMedia();

  const { currentStep, next, back, jumpTo, reset } = useFlow(steps);

  function handleNext() {
    next();
  }

  const DesktopStepper = (
    <Stepper nonLinear activeStep={currentStep?.id} sx={{ padding: "2em 0" }}>
      {steps.map((stepObj) => (
        <Step key={stepObj.label}>
          <StepButton color="inherit" onClick={() => jumpTo(stepObj.name)}>
            {stepObj.label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );

  const DesktopStepperControl = (
    <div className="flex w-full px-4 py-2">
      <Button
        size="lg"
        disabled={currentStep?.prev === null}
        onClick={back}
        variant="primary"
      >
        Back
      </Button>
      <div className="flex-1" />
      <Button onClick={handleNext} variant="primary" size="lg">
        {!currentStep?.next ? "Finish" : "Next"}
      </Button>
    </div>
  );

  const MobileStepperControls = (
    <MobileStepper
      variant="dots"
      className="w-full"
      steps={steps.length}
      position="static"
      activeStep={currentStep?.id}
      nextButton={
        <Button
          variant="outline"
          size="default"
          onClick={handleNext}
          disabled={currentStep?.next === null}
        >
          <ArrowRightIcon />
        </Button>
      }
      backButton={
        <Button
          variant="outline"
          size="default"
          onClick={back}
          disabled={currentStep?.prev === null}
        >
          <ArrowLeftIcon />
        </Button>
      }
    />
  );

  return (
    <Card className="max-w-screen-lg w-full flex-auto">
      {!isSmallDevice && (
        <CardHeader className="bg-gradient-to-b from-gray-50 to-white">
          {DesktopStepper}
        </CardHeader>
      )}
      <div className="flex flex-col min-h-[calc(100vh-18rem)] md:min-h-[calc(100vh-24rem)] justify-between">
        <CardContent className="p-8 flex flex-col flex-grow">
          {!currentStep ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={reset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="flex-grow relative">
                <Routes>
                  {steps.map((step) => (
                    <Route
                      exact
                      key={`route-${step.name}`}
                      path={`/${step.name}`}
                      element={renderInnerCard(step)}
                    />
                  ))}
                  <Route
                    path="/*"
                    element={<IntakeCard activeStep={currentStep} />}
                  />
                </Routes>
              </div>
              {currentStep?.id > 0 && (
                <div className="text-right">
                  <em>{errorMessage}</em>
                </div>
              )}
            </React.Fragment>
          )}
        </CardContent>
        {currentStep?.id > 0 && (
          <CardFooter>
            {isSmallDevice ? MobileStepperControls : DesktopStepperControl}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}

StepperFlow.defaultProps = {
  steps: [],
};

StepperFlow.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object),
};

export default StepperFlow;
