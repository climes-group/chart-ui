import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useFlow from "@/hooks/useFlow";
import useMedia from "@/hooks/useMedia";
import { AlertCircle, ArrowLeftIcon, ArrowRightIcon, Check } from "lucide-react";
import * as React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ApplicableSystemsCard from "./Cards/ApplicableSystemsCard";
import IntakeCard from "./Cards/IntakeCard";
import ReportCard from "./Cards/ReportCard";
import SiteLocationCard from "./Cards/SiteLocationCard";
import SummaryCard from "./Cards/SummaryCard";

function renderInnerCard(currStep) {
  const { name } = currStep;
  switch (name) {
    case "intake":
      return <IntakeCard activeStep={currStep} />;
    case "siteLocation":
      return <SiteLocationCard activeStep={currStep} />;
    case "applicableSystems":
      return <ApplicableSystemsCard activeStep={currStep} />;
    case "summary":
      return <SummaryCard activeStep={currStep} />;
    case "report":
      return <ReportCard />;
    default:
      return null;
  }
}

function StepperFlow({ steps = [] }) {
  const errorMessage = useSelector((s) => s.flow.error);
  const [isSmallDevice] = useMedia();
  const { currentStep, next, back, jumpTo, reset } = useFlow(steps);

  const DesktopStepper = (
    <div className="flex items-center w-full py-5 px-2">
      {steps.map((stepObj, idx) => {
        const isCompleted = currentStep && currentStep.id > stepObj.id;
        const isActive = currentStep && currentStep.id === stepObj.id;

        return (
          <React.Fragment key={stepObj.name}>
            <button
              onClick={() => jumpTo(stepObj.name)}
              className="flex items-center gap-2 shrink-0 group"
            >
              <div
                className={cn(
                  "size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all border-2",
                  isActive || isCompleted
                    ? "bg-moss-primary border-moss-primary text-white"
                    : "bg-transparent border-muted-foreground/30 text-muted-foreground group-hover:border-muted-foreground/60",
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" strokeWidth={2.5} />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={cn(
                  "text-sm transition-colors",
                  isActive
                    ? "font-semibold text-foreground"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground/70",
                )}
              >
                {stepObj.label}
              </span>
            </button>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-3",
                  isCompleted ? "bg-moss-primary/40" : "bg-border",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const DesktopControls = (
    <div className="flex items-center justify-between w-full">
      <Button
        variant="outline"
        disabled={!currentStep?.prev}
        onClick={back}
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </Button>
      <div className="flex items-center gap-3">
        {currentStep?.id > 0 && errorMessage && (
          <span className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {errorMessage}
          </span>
        )}
        <Button
          disabled={!currentStep}
          onClick={next}
          className="bg-moss-primary text-white hover:bg-moss-primary/90 disabled:opacity-50"
        >
          {!currentStep?.next ? "Finish" : "Next"}
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );

  const MobileControls = (
    <div className="flex items-center justify-between w-full">
      <Button
        variant="outline"
        size="icon"
        disabled={!currentStep?.prev}
        onClick={back}
        aria-label="Back"
      >
        <ArrowLeftIcon className="size-4" />
      </Button>

      {currentStep && (
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-foreground">
            {currentStep.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentStep.id + 1} of {steps.length}
          </span>
          {currentStep.id > 0 && errorMessage && (
            <span className="flex items-center gap-1 text-xs text-destructive mt-0.5">
              <AlertCircle className="size-3 shrink-0" />
              {errorMessage}
            </span>
          )}
        </div>
      )}

      <Button
        disabled={!currentStep}
        onClick={next}
        size={currentStep?.next ? "icon" : "default"}
        className="bg-moss-primary text-white hover:bg-moss-primary/90 disabled:opacity-50"
        aria-label={!currentStep?.next ? "Finish" : "Next"}
      >
        {!currentStep?.next && "Finish"}
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );

  return (
    <Card className="max-w-screen-lg w-full flex-auto">
      {!isSmallDevice && (
        <CardHeader className="bg-gradient-to-b from-linen-bkg to-transparent border-b border-border/50">
          {DesktopStepper}
        </CardHeader>
      )}
      <div className="flex flex-col min-h-[calc(100vh-18rem)] md:min-h-[calc(100vh-24rem)] justify-between">
        <CardContent className="p-8 flex flex-col flex-grow md:pt-6">
          {!currentStep ? (
            <div className="mt-4 mb-2">
              <p className="text-foreground mb-4">
                All steps completed — you&apos;re finished
              </p>
              <div className="flex justify-end">
                <Button onClick={reset} variant="outline">
                  Reset
                </Button>
              </div>
            </div>
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
            </React.Fragment>
          )}
        </CardContent>

        <CardFooter>
          {isSmallDevice ? MobileControls : DesktopControls}
        </CardFooter>
      </div>
    </Card>
  );
}

export default StepperFlow;
