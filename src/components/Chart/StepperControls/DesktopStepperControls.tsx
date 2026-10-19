import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { AlertCircle, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { shouldShowFinishButton } from "./controls";
import type { StepperControlsProps } from "./types";

export function DesktopStepperControls({
  currentStep,
  errorMessage,
  onBack,
  onNext,
  reportStatus,
}: Readonly<StepperControlsProps>) {
  const { t } = useTranslation();
  const showFinish = shouldShowFinishButton(currentStep, reportStatus);
  const nextLabel = currentStep?.next ? t("common.next") : t("common.finish");

  return (
    <div className="flex w-full items-center justify-between">
      <Button variant="outline" disabled={!currentStep?.prev} onClick={onBack}>
        <ArrowLeftIcon />
        {t("common.back")}
      </Button>
      <div className="flex items-center gap-3">
        {currentStep && errorMessage && (
          <span className="text-destructive flex items-center gap-1.5 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {errorMessage}
          </span>
        )}
        {showFinish || currentStep?.next ? (
          <Button disabled={!currentStep} onClick={onNext}>
            {nextLabel}
            <ArrowRightIcon />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
