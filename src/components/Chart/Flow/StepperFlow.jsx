import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import useFlow from "@/hooks/useFlow";
import useMedia from "@/hooks/useMedia";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { DesktopControls, MobileControls, StepperHeader } from "./StepperControls";
import StepRenderer from "./StepRenderer";
import FinishCard from "./Cards/FinishCard";

function StepperFlow({ steps = [] }) {
  const errorMessage = useSelector((s) => s.flow.error);
  const [isSmallDevice] = useMedia();
  const { currentStep, next, back, jumpTo, reset, isStepLocked } = useFlow(steps);
  const nextRef = useRef(next);
  nextRef.current = next;
  // Stable wrapper so cards can call the latest next() without a stale closure.
  const nav = useRef(() => nextRef.current()).current;

  const overrideRef = useRef(null);
  const [pulsingSteps, setPulsingSteps] = useState(new Set());

  function registerNext(fn) {
    overrideRef.current = fn;
  }

  function handleNext() {
    (overrideRef.current ?? nextRef.current)();
  }

  function handleJumpTo(stepName) {
    const blocked = jumpTo(stepName);
    if (blocked.length > 0) {
      setPulsingSteps(new Set(blocked));
      setTimeout(() => setPulsingSteps(new Set()), 1500);
    }
  }

  return (
    <Card className="max-w-screen-lg w-full flex-auto">
      {!isSmallDevice && (
        <CardHeader className="bg-gradient-to-b from-linen-bkg to-transparent border-b border-border/50">
          <StepperHeader steps={steps} currentStep={currentStep} jumpTo={handleJumpTo} isStepLocked={isStepLocked} pulsingSteps={pulsingSteps} />
        </CardHeader>
      )}
      <div className="flex flex-col min-h-[calc(100vh-18rem)] md:min-h-[calc(100vh-24rem)] justify-between">
        <CardContent className="p-4 md:p-8 md:pt-6 flex flex-col flex-grow">
          {!currentStep ? (
            <FinishCard
              onReset={reset}
              onBackToReport={() => jumpTo("report")}
            />
          ) : (
            <div className="flex-grow relative">
              <Routes>
                {steps.map((step) => (
                  <Route
                    exact
                    key={`route-${step.name}`}
                    path={`/${step.name}`}
                    element={<StepRenderer step={step} registerNext={registerNext} nav={nav} />}
                  />
                ))}
                <Route
                  path="/*"
                  element={<StepRenderer step={steps[0]} registerNext={registerNext} />}
                />
              </Routes>
            </div>
          )}
        </CardContent>

        {currentStep && (
          <CardFooter>
            {isSmallDevice
              ? <MobileControls currentStep={currentStep} steps={steps} errorMessage={errorMessage} onBack={back} onNext={handleNext} />
              : <DesktopControls currentStep={currentStep} errorMessage={errorMessage} onBack={back} onNext={handleNext} />
            }
          </CardFooter>
        )}
      </div>
    </Card>
  );
}

export default StepperFlow;
