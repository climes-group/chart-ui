import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  jumpToStep,
  setError,
  setSteps,
  stepBackward,
  stepForward,
} from "../state/slices/flowReducer";

function useFlow(initialSteps = []) {
  const dispatch = useDispatch();

  const activeStep = useSelector((s) => s.flow.currentStepInd);
  const conditions = useSelector((s) => s.flow.conditions);
  const error = useSelector((s) => s.flow.error);

  useEffect(() => {
    if (initialSteps.length > 0) {
      dispatch(setSteps(initialSteps));
    }
  }, [initialSteps]);

  function next() {
    console.log(conditions);
    if (conditions.every((x) => x)) {
      console.log("Conditions passed");
      dispatch(stepForward());
    } else {
      console.warn("Conditions did not pass");
      dispatch(setError("Please specify a location."));
    }
  }

  function back() {
    dispatch(stepBackward());
  }

  function jumpTo(step) {
    dispatch(jumpToStep(step));
  }

  return { activeStep, next, back, jumpTo, error };
}

export default useFlow;
