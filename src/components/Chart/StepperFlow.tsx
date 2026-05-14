import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useFlow from "@/hooks/useFlow";
import useMedia from "@/hooks/useMedia";
import type { Step } from "@/steps";
import type { RootState } from "@/state/store";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import FinishCard from "./Cards/FinishCard";
import StepRenderer, { type StepNextFn } from "./StepRenderer";
import {
  DesktopControls,
  MobileControls,
  StepperHeader,
} from "./StepperControls";

type Props = { steps?: Step[] };

function StepperFlow({ steps = [] }: Readonly<Props>) {
  const errorMessage = useSelector((s: RootState) => s.flow.error);
  const [isSmallDevice] = useMedia();
  const { currentStep, next, back, jumpTo, isStepLocked } = useFlow(steps);
  const nextRef = useRef(next);
  nextRef.current = next;
  // Stable wrapper so cards can call the latest next() without a stale closure.
  const nav = useRef(() => nextRef.current()).current;

  const overrideRef = useRef<StepNextFn | null>(null);
  const [pulsingSteps, setPulsingSteps] = useState<Set<string>>(new Set());

  function registerNext(fn: StepNextFn | null) {
    overrideRef.current = fn;
  }

  function handleNext() {
    (overrideRef.current ?? nextRef.current)();
  }

  function handleJumpTo(stepName: string) {
    const blocked = jumpTo(stepName);
    if (blocked.length > 0) {
      setPulsingSteps(new Set(blocked));
      setTimeout(() => setPulsingSteps(new Set()), 1500);
    }
  }

  return (
    <Card className="w-full max-w-screen-lg flex-auto">
      {!isSmallDevice && (
        <CardHeader className="from-linen-bkg border-border/50 border-b bg-gradient-to-b to-transparent">
          <StepperHeader
            steps={steps}
            currentStep={currentStep}
            jumpTo={handleJumpTo}
            isStepLocked={isStepLocked}
            pulsingSteps={pulsingSteps}
          />
        </CardHeader>
      )}
      <div className="flex min-h-[calc(100vh-18rem)] flex-col justify-between md:min-h-[calc(100vh-24rem)]">
        <CardContent className="flex flex-grow flex-col p-4 md:p-8 md:pt-6">
          <div className="relative flex-grow">
            <Routes>
              {steps.map((step) => (
                <Route
                  key={`route-${step.name}`}
                  path={`/${step.name}`}
                  element={
                    <StepRenderer
                      step={step}
                      registerNext={registerNext}
                      nav={nav}
                    />
                  }
                />
              ))}
              <Route
                path="/finish"
                element={
                  <FinishCard onBackToReport={() => jumpTo("report")} />
                }
              />
              <Route
                path="/*"
                element={
                  <StepRenderer step={steps[0]} registerNext={registerNext} />
                }
              />
            </Routes>
          </div>
        </CardContent>

        {currentStep && (
          <CardFooter>
            {isSmallDevice ? (
              <MobileControls
                currentStep={currentStep}
                steps={steps}
                errorMessage={errorMessage}
                onBack={back}
                onNext={handleNext}
              />
            ) : (
              <DesktopControls
                currentStep={currentStep}
                errorMessage={errorMessage}
                onBack={back}
                onNext={handleNext}
              />
            )}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}

export default StepperFlow;
