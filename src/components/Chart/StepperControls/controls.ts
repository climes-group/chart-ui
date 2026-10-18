import type { Step } from "@/steps";

export function shouldShowFinishButton(
  currentStep: Step | undefined,
  reportStatus: string | undefined,
) {
  const isReportStep = currentStep?.name === "report";
  const reportAttempted = Boolean(
    reportStatus && reportStatus !== "not_generated",
  );

  return !currentStep?.next && (!isReportStep || reportAttempted);
}
