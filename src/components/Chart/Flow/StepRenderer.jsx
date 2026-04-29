import IntakeCard from "./Cards/IntakeCard";
import ReportCard from "./Cards/ReportCard";
import SelectedSystemsCard from "./Cards/SelectedSystemsCard";
import SummaryCard from "./Cards/SummaryCard";

const STEP_CARDS = {
  intake: IntakeCard,
  selectedSystems: SelectedSystemsCard,
  summary: SummaryCard,
  report: ReportCard,
};

export default function StepRenderer({ step, registerNext, nav }) {
  const StepCard = STEP_CARDS[step.name];
  if (!StepCard) return null;
  return <StepCard activeStep={step} registerNext={registerNext} nav={nav} />;
}
