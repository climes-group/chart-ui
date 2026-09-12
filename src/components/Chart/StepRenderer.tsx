import { useEffect, useRef, type ComponentType } from "react";

import { useTranslation } from "@/i18n";
import type { Step } from "@/steps";
import IntakeCard from "./Cards/IntakeCard";
import ReportCard from "./Cards/ReportCard";
import SiteFeaturesCard from "./Cards/SiteFeaturesCard";
import SummaryCard from "./Cards/SummaryCard";
import SystemsCard from "./Cards/SystemsCard";

export type StepNextFn = () => void | Promise<void>;

export type StepCardProps = {
  registerNext: (fn: StepNextFn | null) => void;
  nav: () => void;
  step: Step;
};

const STEP_CARDS: Record<string, ComponentType<StepCardProps>> = {
  intake: IntakeCard,
  systems: SystemsCard,
  features: SiteFeaturesCard,
  summary: SummaryCard,
  report: ReportCard,
};

const STEP_CARD_HEADING_KEYS: Record<string, string> = {
  intake: "intake.heading",
  systems: "inventory.systems.heading",
  features: "inventory.siteFeatures.heading",
  summary: "summary.heading",
  report: "report.heading",
};

// create type from STEP_CARDS keys
export type StepCardName = keyof typeof STEP_CARDS;

export default function StepRenderer({
  step,
  registerNext,
  nav,
}: Readonly<StepCardProps>) {
  const StepCard = STEP_CARDS[step.name];
  const { t } = useTranslation();
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step.name]);

  if (!StepCard) return null;

  const headingKey = STEP_CARD_HEADING_KEYS[step.name] ?? "";

  return (
    <>
      <h2 ref={headingRef} tabIndex={-1} className={"heading-card mb-4"}>
        {headingKey ? t(headingKey) : null}
      </h2>
      <StepCard step={step} registerNext={registerNext} nav={nav} />
    </>
  );
}
