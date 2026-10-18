import type { Step } from "@/steps";

export type StepperControlsProps = {
  currentStep: Step | undefined;
  errorMessage?: string | null;
  onBack: () => void;
  onNext: () => void;
  reportStatus?: string;
};
