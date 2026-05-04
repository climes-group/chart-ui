import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n";
import {
  jumpToStep,
  setError,
  setSteps,
  stepBackward,
  stepForward,
} from "../state/slices/flowReducer";
import {
  clearIntakeForm,
  clearSelectedSystems,
  resetReport,
} from "../state/slices/reportReducer";
import { setGeoData, setHumanAddress } from "../state/slices/geoReducer";

function useFlow(initialSteps = []) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useStore();
  const { t } = useTranslation();

  const stepsInitialized = useSelector((s) => s.flow.steps.length > 0);

  useEffect(() => {
    if (initialSteps.length > 0 && !stepsInitialized) {
      dispatch(setSteps(initialSteps));
    }
  }, [initialSteps, stepsInitialized]);

  const currentStep = useSelector((s) => s.flow.currentStep);
  const conditions = useSelector((s) => s.flow.conditions);
  const steps = useSelector((s) => s.flow.steps);
  const error = useSelector((s) => s.flow.error);

  // Returns true if any step preceding stepName has an unmet leaveCondition.
  function isStepLocked(stepName) {
    let prevStep = steps.find((s) => s.next === stepName);
    while (prevStep) {
      if (!(conditions[prevStep.name] ?? true)) return true;
      prevStep = steps.find((s) => s.name === prevStep.prev);
    }
    return false;
  }

  function next() {
    // Read conditions directly from the store so a dispatch that happened in the
    // same synchronous call (e.g. meetCondition inside onSubmit) is visible here
    // without waiting for a React re-render to refresh the selector closure.
    const liveConditions = store.getState().flow.conditions;
    const conditionsMet = liveConditions[currentStep.name] ?? true;
    if (conditionsMet) {
      dispatch(setError(null));
      dispatch(stepForward());
      navigate(`/flow/${currentStep.next ?? "finish"}`);
    } else {
      const errorKey = `steps.errors.${currentStep.name}`;
      const translated = t(errorKey);
      dispatch(setError(translated === errorKey ? t("flow.errors.default") : translated));
    }
  }

  function reset() {
    dispatch(clearIntakeForm());
    dispatch(clearSelectedSystems());
    dispatch(resetReport());
    dispatch(setGeoData(undefined));
    dispatch(setHumanAddress(undefined));
    dispatch(setSteps(initialSteps));
    navigate("/flow/intake");
  }

  function back() {
    dispatch(setError(null));
    dispatch(stepBackward());
    navigate(`/flow/${currentStep.prev}`);
  }

  // Returns an array of step names whose conditions are blocking navigation to `name`.
  // Returns an empty array on success.
  function jumpTo(name) {
    const blockingSteps = [];
    let prevStep = steps.find((s) => s.next === name);
    while (prevStep) {
      if (!(conditions[prevStep.name] ?? true)) blockingSteps.push(prevStep.name);
      prevStep = steps.find((s) => s.name === prevStep.prev);
    }

    if (blockingSteps.length === 0) {
      dispatch(setError(null));
      dispatch(jumpToStep(name));
      navigate(`/flow/${name}`);
    } else {
      dispatch(setError(t("flow.errors.conditionsNotMet")));
    }
    return blockingSteps;
  }

  return { currentStep, next, back, jumpTo, reset, error, isStepLocked };
}

export default useFlow;
