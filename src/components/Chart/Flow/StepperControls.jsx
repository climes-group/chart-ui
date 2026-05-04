import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeftIcon,
  ArrowRightIcon,
  Check,
} from "lucide-react";
import React from "react";

export function StepperHeader({
  steps,
  currentStep,
  jumpTo,
  isStepLocked,
  pulsingSteps,
}) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full items-center px-2 py-5">
      {steps.map((stepObj, idx) => {
        const isCompleted = currentStep && currentStep.id > stepObj.id;
        const isActive = currentStep && currentStep.id === stepObj.id;
        const isLocked =
          !isActive && !isCompleted && (isStepLocked?.(stepObj.name) ?? false);
        const isPulsing = pulsingSteps?.has(stepObj.name) ?? false;

        // get translations for step labels

        const stepLabel = t(`steps.${stepObj.name}`);

        return (
          <React.Fragment key={stepObj.name}>
            <button
              onClick={() => jumpTo(stepObj.name)}
              className="group flex shrink-0 items-center gap-2"
              data-locked={isLocked ? "true" : undefined}
              data-pulsing={isPulsing ? "true" : undefined}
            >
              <div className="relative">
                {isPulsing && (
                  <span
                    className="border-warm-brown absolute inset-0 animate-ping rounded-full border-2"
                    aria-hidden="true"
                  />
                )}
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    isActive || isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isPulsing
                        ? "bg-warm-brown border-warm-brown text-white"
                        : "border-muted-foreground/30 text-muted-foreground group-hover:border-muted-foreground/60 bg-transparent",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    idx + 1
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "text-sm transition-colors",
                  isActive
                    ? "text-foreground font-semibold"
                    : isCompleted
                      ? "text-foreground"
                      : isPulsing
                        ? "text-warm-brown"
                        : "text-muted-foreground group-hover:text-foreground/70",
                )}
              >
                {stepLabel}
              </span>
            </button>

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

export function DesktopControls({ currentStep, errorMessage, onBack, onNext }) {
  const { t } = useTranslation();
  const nextLabel = !currentStep?.next ? t("common.finish") : t("common.next");
  return (
    <div className="flex w-full items-center justify-between">
      <Button variant="outline" disabled={!currentStep?.prev} onClick={onBack}>
        <ArrowLeftIcon className="size-4" />
        {t("common.back")}
      </Button>
      <div className="flex items-center gap-3">
        {currentStep && errorMessage && (
          <span className="text-destructive flex items-center gap-1.5 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {errorMessage}
          </span>
        )}
        <Button
          disabled={!currentStep}
          onClick={onNext}
          className="disabled:opacity-50"
        >
          {nextLabel}
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function MobileControls({
  currentStep,
  steps,
  errorMessage,
  onBack,
  onNext,
}) {
  const { t } = useTranslation();
  const nextLabel = !currentStep?.next ? t("common.finish") : t("common.next");
  return (
    <div className="flex w-full items-center justify-between">
      <Button
        variant="outline"
        size="icon"
        disabled={!currentStep?.prev}
        onClick={onBack}
        aria-label={t("common.back")}
      >
        <ArrowLeftIcon className="size-4" />
      </Button>

      {currentStep && (
        <div className="flex flex-col items-center">
          <span className="text-foreground text-sm font-medium">
            {t(`steps.${currentStep.name}`)}
          </span>
          <span className="text-muted-foreground text-xs">
            {t("flow.stepper.stepCounter", {
              current: currentStep.id + 1,
              total: steps.length,
            })}
          </span>
          {errorMessage && (
            <span className="text-destructive mt-0.5 flex items-center gap-1 text-xs">
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
        className="disabled:opacity-50"
        aria-label={nextLabel}
      >
        {!currentStep?.next && t("common.finish")}
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
}
