import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import type { Step } from "@/steps";
import { AlertCircle, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { shouldShowFinishButton } from "./controls";
import type { StepperControlsProps } from "./types";

type MobileStepperControlsProps = StepperControlsProps & { steps: Step[] };

export function MobileStepperControls({
  currentStep,
  steps,
  errorMessage,
  onBack,
  onNext,
  reportStatus,
}: Readonly<MobileStepperControlsProps>) {
  const { t } = useTranslation();
  const showFinish = shouldShowFinishButton(currentStep, reportStatus);
  const nextLabel = currentStep?.next ? t("common.next") : t("common.finish");

  return (
    <div className="flex w-full items-center justify-between">
      <Button
        variant="outline"
        size="icon"
        disabled={!currentStep?.prev}
        onClick={onBack}
        aria-label={t("common.back")}
      >
        <ArrowLeftIcon />
      </Button>

      {currentStep && (
        <div className="flex flex-col items-center">
          <span className="text-foreground text-sm font-medium">
            {t(`steps.${currentStep.name}`)}
          </span>
          <span className="text-muted-foreground text-sm">
            {t("flow.stepper.stepCounter", {
              current: (currentStep.id ?? 0) + 1,
              total: steps.length,
            })}
          </span>
          {errorMessage && (
            <span className="text-destructive mt-0.5 flex items-center gap-1 text-sm">
              <AlertCircle className="size-3 shrink-0" />
              {errorMessage}
            </span>
          )}
        </div>
      )}

      {showFinish || currentStep?.next ? (
        <Button
          disabled={!currentStep}
          onClick={onNext}
          size={currentStep?.next ? "icon" : "default"}
          aria-label={nextLabel}
        >
          {!currentStep?.next && t("common.finish")}
          <ArrowRightIcon />
        </Button>
      ) : null}
    </div>
  );
}
