import { useEffect, useRef } from "react";
import StepperFlow from "./components/Chart/StepperFlow";

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
    <>
      <div ref={targetElement}>
        <StepperFlow />
      </div>
    </>
  );
}

export default Chart;
