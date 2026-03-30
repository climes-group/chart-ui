import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useFlow from "@/hooks/useFlow";
import useMedia from "@/hooks/useMedia";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { DesktopControls, MobileControls, StepperHeader } from "./StepperControls";
import StepRenderer from "./StepRenderer";

function StepperFlow({ steps = [] }) {
  const errorMessage = useSelector((s) => s.flow.error);
  const [isSmallDevice] = useMedia();
  const { currentStep, next, back, jumpTo, reset } = useFlow(steps);
  const nextRef = useRef(next);
  nextRef.current = next;

  function registerNext(fn) {
    nextRef.current = fn;
  }

  function handleNext() {
    nextRef.current();
  }

  return (
    <Card className="max-w-screen-lg w-full flex-auto">
      {!isSmallDevice && (
        <CardHeader className="bg-gradient-to-b from-linen-bkg to-transparent border-b border-border/50">
          <StepperHeader steps={steps} currentStep={currentStep} jumpTo={jumpTo} />
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
                      element={<StepRenderer step={step} registerNext={registerNext} />}
                    />
                  ))}
                  <Route
                    path="/*"
                    element={<StepRenderer step={steps[0]} registerNext={registerNext} />}
                  />
                </Routes>
              </div>
            </React.Fragment>
          )}
        </CardContent>

        <CardFooter>
          {isSmallDevice
            ? <MobileControls currentStep={currentStep} steps={steps} errorMessage={errorMessage} onBack={back} onNext={handleNext} />
            : <DesktopControls currentStep={currentStep} errorMessage={errorMessage} onBack={back} onNext={handleNext} />
          }
        </CardFooter>
      </div>
    </Card>
  );
}

export default StepperFlow;
