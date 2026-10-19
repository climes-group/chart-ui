import type { StepCardName } from "@/components/Chart/StepRenderer";
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
  syncSteps,
} from "../state/slices/flowReducer";
import type { RootState } from "../state/store";
import type { Step } from "../steps";

function useFlow(initialSteps: Step[] = []) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useStore<RootState>();
  const { t } = useTranslation();

  const stepsInitialized = useSelector(
    (s: RootState) => s.flow.steps.length > 0,
  );
  const currentStep = useSelector((s: RootState) => s.flow.currentStep);
  const conditions = useSelector((s: RootState) => s.flow.conditions);
  const steps = useSelector((s: RootState) => s.flow.steps);
  const error = useSelector((s: RootState) => s.flow.error);
  const stepsNeedSync =
    stepsInitialized &&
    (steps.length !== initialSteps.length ||
      steps.some((step, index) => step.name !== initialSteps[index]?.name));

  useEffect(() => {
    if (initialSteps.length === 0) return;
    if (!stepsInitialized) {
      dispatch(setSteps(initialSteps));
    } else if (stepsNeedSync) {
      const currentName = currentStep?.name;
      const removedStepNext = steps.find(
        (step) => step.name === currentName,
      )?.next;
      const destination =
        initialSteps.find((step) => step.name === currentName) ??
        initialSteps.find((step) => step.name === removedStepNext) ??
        initialSteps[0];

      dispatch(syncSteps(initialSteps));
      navigate(`/flow/${destination.name}`, { replace: true });
    }
  }, [
    currentStep?.name,
    dispatch,
    initialSteps,
    navigate,
    steps,
    stepsInitialized,
    stepsNeedSync,
  ]);

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
  function jumpTo(name: StepCardName): string[] {
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
