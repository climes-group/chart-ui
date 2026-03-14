import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectSplashDismissed } from "./state/slices/flowReducer";
import StepperFlow from "./components/Chart/Flow/StepperFlow";
import SplashCard from "./components/Chart/Flow/Cards/Splash";
import steps from "./steps";

function Chart() {
  const targetElement = useRef();
  const splashDismissed = useSelector(selectSplashDismissed);

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

  if (!splashDismissed) {
    return (
      <div ref={targetElement} className="flex justify-center flex-grow">
        <SplashCard />
      </div>
    );
  }

  return (
    <div ref={targetElement} className="flex justify-center flex-grow">
      <StepperFlow steps={steps} />
    </div>
  );
}

export default Chart;
