import { useRef } from "react";
import StepperFlow from "@/components/Chart/StepperFlow";
import steps from "@/steps";

function Chart() {
  const targetElement = useRef<HTMLDivElement>(null);

  return (
    <div ref={targetElement} className="flex flex-grow justify-center">
      <StepperFlow steps={steps} />
    </div>
  );
}

export default Chart;
