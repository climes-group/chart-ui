import { useEffect, useRef } from "react";
import StepperFlow from "./components/Chart/Flow/StepperFlow";
import steps from "./steps";

function Chart() {
  const targetElement = useRef();
  const scrollingTop = () => {
    targetElement.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  };

  useEffect(() => {
    scrollingTop();
  }, []);

  return (
    <div ref={targetElement}>
      <StepperFlow steps={steps} />
    </div>
  );
}

export default Chart;
