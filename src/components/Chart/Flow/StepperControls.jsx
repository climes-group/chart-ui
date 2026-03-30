import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowLeftIcon, ArrowRightIcon, Check } from "lucide-react";
import React from "react";

export function StepperHeader({ steps, currentStep, jumpTo }) {
  return (
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
}

export function DesktopControls({ currentStep, errorMessage, onBack, onNext }) {
  return (
    <div className="flex items-center justify-between w-full">
      <Button variant="outline" disabled={!currentStep?.prev} onClick={onBack}>
        <ArrowLeftIcon className="size-4" />
        Back
      </Button>
      <div className="flex items-center gap-3">
        {currentStep && errorMessage && (
          <span className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {errorMessage}
          </span>
        )}
        <Button
          disabled={!currentStep}
          onClick={onNext}
          className="bg-moss-primary text-white hover:bg-moss-primary/90 disabled:opacity-50"
        >
          {!currentStep?.next ? "Finish" : "Next"}
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function MobileControls({ currentStep, steps, errorMessage, onBack, onNext }) {
  return (
    <div className="flex items-center justify-between w-full">
      <Button
        variant="outline"
        size="icon"
        disabled={!currentStep?.prev}
        onClick={onBack}
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
          {errorMessage && (
            <span className="flex items-center gap-1 text-xs text-destructive mt-0.5">
              <AlertCircle className="size-3 shrink-0" />
              {errorMessage}
            </span>
          )}
        </div>
      )}

      <Button
        disabled={!currentStep}
        onClick={onNext}
        size={currentStep?.next ? "icon" : "default"}
        className="bg-moss-primary text-white hover:bg-moss-primary/90 disabled:opacity-50"
        aria-label={!currentStep?.next ? "Finish" : "Next"}
      >
        {!currentStep?.next && "Finish"}
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
}
