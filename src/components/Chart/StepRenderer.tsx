import type { ComponentType } from "react";
import type { Step } from "@/steps";
import IntakeCard from "./Cards/IntakeCard";
import ReportCard from "./Cards/ReportCard";
import SelectedSystemsCard from "./Cards/SelectedSystemsCard";
import SummaryCard from "./Cards/SummaryCard";

export type StepNextFn = () => void | Promise<void>;

export type StepCardProps = {
  activeStep?: Step;
  registerNext?: (fn: StepNextFn | null) => void;
  nav?: () => void;
};

const STEP_CARDS: Record<string, ComponentType<StepCardProps>> = {
  intake: IntakeCard,
  inventory: SelectedSystemsCard,
  summary: SummaryCard,
  report: ReportCard,
};

type Props = {
  step: Step;
  registerNext: (fn: StepNextFn | null) => void;
  nav?: () => void;
};

export default function StepRenderer({ step, registerNext, nav }: Props) {
  const StepCard = STEP_CARDS[step.name];
  if (!StepCard) return null;
  return <StepCard activeStep={step} registerNext={registerNext} nav={nav} />;
}
