import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n";
import type { Step } from "../steps";
import {
  jumpToStep,
  setError,
  setSteps,
  stepBackward,
  stepForward,
} from "../state/slices/flowReducer";
import type { RootState } from "../state/store";

function useFlow(initialSteps: Step[] = []) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useStore<RootState>();
  const { t } = useTranslation();

  const stepsInitialized = useSelector(
    (s: RootState) => s.flow.steps.length > 0,
  );

  useEffect(() => {
    if (initialSteps.length > 0 && !stepsInitialized) {
      dispatch(setSteps(initialSteps));
    }
  }, [initialSteps, stepsInitialized, dispatch]);

  const currentStep = useSelector((s: RootState) => s.flow.currentStep);
  const conditions = useSelector((s: RootState) => s.flow.conditions);
  const steps = useSelector((s: RootState) => s.flow.steps);
  const error = useSelector((s: RootState) => s.flow.error);

  // Returns true if any step preceding stepName has an unmet leaveCondition.
  function isStepLocked(stepName: string): boolean {
    let prevStep: Step | undefined = steps.find((s) => s.next === stepName);
    while (prevStep) {
      if (!(conditions[prevStep.name] ?? true)) return true;
      prevStep = steps.find((s) => s.name === prevStep!.prev);
    }
    return false;
  }

  function next() {
    if (!currentStep) return;
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
      dispatch(
        setError(
          translated === errorKey ? t("flow.errors.default") : translated,
        ),
      );
    }
  }

  function back() {
    if (!currentStep) return;
    dispatch(setError(null));
    dispatch(stepBackward());
    navigate(`/flow/${currentStep.prev}`);
  }

  // Returns step names blocking navigation to `name`. Empty array on success.
  function jumpTo(name: string): string[] {
    const blockingSteps: string[] = [];
    let prevStep: Step | undefined = steps.find((s) => s.next === name);
    while (prevStep) {
      if (!(conditions[prevStep.name] ?? true))
        blockingSteps.push(prevStep.name);
      prevStep = steps.find((s) => s.name === prevStep!.prev);
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

  return { currentStep, next, back, jumpTo, error, isStepLocked };
}

export default useFlow;
