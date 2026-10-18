import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import type { Step } from "@/steps";
import { cn } from "@/utils/cn";
import { Check } from "lucide-react";
import React from "react";

type StepperHeaderProps = {
  steps: Step[];
  currentStep: Step | undefined;
  jumpTo: (name: string) => void;
  isStepLocked?: (name: string) => boolean;
  pulsingSteps?: Set<string>;
};

function getStepCircleClass(
  isActive: boolean | null | undefined,
  isCompleted: boolean | null | undefined,
  isPulsing: boolean,
) {
  if (isActive || isCompleted)
    return "bg-primary border-primary text-primary-foreground";
  if (isPulsing) return "bg-warning border-warning text-warning-foreground";
  return "border-muted-foreground/30 text-muted-foreground group-hover:border-muted-foreground/60 bg-transparent";
}

function getStepLabelClass(
  isActive: boolean | null | undefined,
  isCompleted: boolean | null | undefined,
  isPulsing: boolean,
) {
  if (isActive) return "text-foreground font-semibold";
  if (isCompleted) return "text-foreground";
  if (isPulsing) return "text-warning";
  return "text-muted-foreground group-hover:text-foreground/70";
}

export function StepperHeader({
  steps,
  currentStep,
  jumpTo,
  isStepLocked,
  pulsingSteps,
}: Readonly<StepperHeaderProps>) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center px-2 py-5">
      {steps.map((stepObj, idx) => {
        const isCompleted =
          currentStep && (currentStep.id ?? 0) > (stepObj.id ?? 0);
        const isActive = currentStep && currentStep.id === stepObj.id;
        const isLocked =
          !isActive && !isCompleted && (isStepLocked?.(stepObj.name) ?? false);
        const isPulsing = pulsingSteps?.has(stepObj.name) ?? false;
        const stepLabel = t(`steps.${stepObj.name}`);

        return (
          <React.Fragment key={stepObj.name}>
            <Button
              variant="stepper"
              onClick={() => jumpTo(stepObj.name)}
              className="group shrink-0"
              data-locked={isLocked ? "true" : undefined}
              data-pulsing={isPulsing ? "true" : undefined}
            >
              <div className="relative">
                {isPulsing && (
                  <span
                    className="border-warning absolute inset-0 animate-ping rounded-full border-2"
                    aria-hidden="true"
                  />
                )}
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    getStepCircleClass(isActive, isCompleted, isPulsing),
                  )}
                >
                  {isCompleted ? <Check strokeWidth={2.5} /> : idx + 1}
                </div>
              </div>
              <span
                className={cn(
                  "text-sm transition-colors",
                  getStepLabelClass(isActive, isCompleted, isPulsing),
                )}
              >
                {stepLabel}
              </span>
            </Button>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-px flex-1",
                  isCompleted ? "bg-primary/40" : "bg-border",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
