import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  jumpToStep,
  setError,
  setSteps,
  stepBackward,
  stepForward,
} from "../state/slices/flowReducer";

function useFlow(initialSteps = []) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialSteps.length > 0) {
      dispatch(setSteps(initialSteps));
    }
  }, [initialSteps]);

  const currentStep = useSelector((s) => s.flow.currentStep);
  const conditions = useSelector((s) => s.flow.conditions);
  const steps = useSelector((s) => s.flow.steps);
  const error = useSelector((s) => s.flow.error);

  function next() {
    const conditionsMet = conditions[currentStep.name] ?? true;
    if (conditionsMet) {
      console.log("Conditions passed");
      dispatch(stepForward());
      navigate(`/flow/${currentStep.next}`);
    } else {
      console.log("Not passed");
      dispatch(setError("Please specify a location."));
    }
  }

  function reset() {
    console.log("Resetting");
    dispatch(setSteps(initialSteps));
    navigate("/flow/intake");
  }

  function back() {
    dispatch(stepBackward());
    navigate(`/flow/${currentStep.prev}`);
  }

  function jumpTo(name) {
    // all previous steps in chain should have conditions met
    let allConditionsMet = true;
    let prevStep = steps.find((s) => s.next === name);

    while (prevStep) {
      allConditionsMet =
        allConditionsMet && (conditions[prevStep.name] ?? true);
      prevStep = prevStep.prev;
    }

    if (allConditionsMet) {
      dispatch(jumpToStep(name));
      navigate(`/flow/${name}`);
    } else {
      dispatch(setError("Conditions not met"));
    }
  }

  return { currentStep, next, back, jumpTo, reset, error };
}

export default useFlow;
