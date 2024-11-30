import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  jumpToStep,
  setError,
  setSteps,
  stepBackward,
  stepDone,
  stepForward,
} from "../state/slices/flowReducer";

function useFlow(initialSteps = []) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialSteps.length > 0) {
      dispatch(setSteps(initialSteps));
    }
  }, [initialSteps]);

  const currentStep = useSelector((s) => s.flow.currentStep);
  const conditions = useSelector((s) => s.flow.conditions);
  const error = useSelector((s) => s.flow.error);

  function next() {
    if (conditions.every((x) => x)) {
      console.log("Conditions passed");
      dispatch(stepForward());
    } else {
      console.warn("Conditions did not pass");
      dispatch(setError("Please specify a location."));
    }
  }

  function done() {
    dispatch(stepDone());
  }

  function back() {
    dispatch(stepBackward());
  }

  function jumpTo(step) {
    dispatch(jumpToStep(step));
  }

  return { currentStep, done, next, back, jumpTo, error };
}

export default useFlow;
