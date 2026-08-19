import type { Step } from "@/steps";
import type { ComponentType } from "react";
import IntakeCard from "./Cards/IntakeCard";
import ReportCard from "./Cards/ReportCard";
import SelectedSystemsCard from "./Cards/SelectedSystemsCard";
import SummaryCard from "./Cards/SummaryCard";

export type StepNextFn = () => void | Promise<void>;

export type StepCardProps = {
  registerNext: (fn: StepNextFn | null) => void;
  nav: () => void;
  step: Step;
};

const STEP_CARDS: Record<string, ComponentType<StepCardProps>> = {
  intake: IntakeCard,
  inventory: SelectedSystemsCard,
  summary: SummaryCard,
  report: ReportCard,
};

// create type from STEP_CARDS keys
export type StepCardName = keyof typeof STEP_CARDS;

export default function StepRenderer({
  step,
  registerNext,
  nav,
}: Readonly<StepCardProps>) {
  const StepCard = STEP_CARDS[step.name];
  if (!StepCard) return null;
  return <StepCard step={step} registerNext={registerNext} nav={nav} />;
}
