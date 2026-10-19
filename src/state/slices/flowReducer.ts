import type { Step } from "@/steps";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FlowState = {
  steps: Step[];
  currentStep: Step | undefined;
  error: string | null | undefined;
  conditions: Record<string, boolean>;
};

const initialState: FlowState = {
  steps: [],
  currentStep: undefined,
  error: undefined,
  conditions: {},
};

export const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setInitial: (state, action: PayloadAction<Step | undefined>) => {
      state.currentStep = action.payload;
    },
    setSteps: (state, action: PayloadAction<Step[]>) => {
      state.steps = action.payload;
      flowSlice.caseReducers.setInitial(state, {
        type: "flow/setInitial",
        payload: action.payload[0],
      });
      state.error = undefined;
      state.conditions = action.payload.reduce<Record<string, boolean>>(
        (acc, step) => {
          if (step.leaveCondition) acc[step.name] = false;
          return acc;
        },
        {},
      );
    },
    syncSteps: (state, action: PayloadAction<Step[]>) => {
      const currentStepName = state.currentStep?.name;
      const nextStepName = state.steps.find(
        (step) => step.name === currentStepName,
      )?.next;
      const previousConditions = state.conditions;

      state.steps = action.payload;
      state.currentStep =
        action.payload.find((step) => step.name === currentStepName) ??
        action.payload.find((step) => step.name === nextStepName) ??
        action.payload[0];
      state.conditions = action.payload.reduce<Record<string, boolean>>(
        (conditions, step) => {
          if (step.leaveCondition) {
            conditions[step.name] = previousConditions[step.name] ?? false;
          }
          return conditions;
        },
        {},
      );
    },
    stepBackward: (state) => {
      if (!state.currentStep) return;
      state.currentStep = state.steps.find(
        (x) => x.name === state.currentStep!.prev,
      );
    },
    stepForward: (state) => {
      if (!state.currentStep) return;
      state.currentStep = state.steps.find(
        (x) => x.name === state.currentStep!.next,
      );
    },
    jumpToStep: (state, action: PayloadAction<string>) => {
      state.currentStep = state.steps.find((x) => x.name === action.payload);
    },
    meetCondition: (
      state,
      action: PayloadAction<{ name: string; condition?: boolean }>,
    ) => {
      const { name, condition = true } = action.payload;
      state.conditions = { ...state.conditions, [name]: condition };
    },
    setError: (state, action: PayloadAction<string | null | undefined>) => {
      state.error = action.payload;
    },
  },
});

export const {
  stepForward,
  stepBackward,
  jumpToStep,
  meetCondition,
  setError,
  setSteps,
  syncSteps,
} = flowSlice.actions;

export default flowSlice.reducer;
