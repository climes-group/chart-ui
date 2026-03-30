import { useRef } from "react";
import { useSelector } from "react-redux";
import SplashCard from "./components/Chart/Flow/Cards/Splash";
import StepperFlow from "./components/Chart/Flow/StepperFlow";
import { selectSplashDismissed } from "./state/slices/flowReducer";
import steps from "./steps";

function Chart() {
  const targetElement = useRef();
  const splashDismissed = useSelector(selectSplashDismissed);

  if (!splashDismissed) {
    return (
      <div ref={targetElement} className="flex flex-grow justify-center">
        <SplashCard />
      </div>
    );
  }

  return (
    <div ref={targetElement} className="flex flex-grow justify-center">
      <StepperFlow steps={steps} />
    </div>
  );
}

export default Chart;
