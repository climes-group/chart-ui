import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Step } from "@/steps";

type FlowState = {
  steps: Step[];
  currentStep: Step | undefined;
  error: string | null | undefined;
  conditions: Record<string, boolean>;
  theme: number;
};

const initialState: FlowState = {
  steps: [],
  currentStep: undefined,
  error: undefined,
  conditions: {},
  theme: 1,
};

export const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<number>) => {
      state.theme = action.payload;
    },
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
  setTheme,
} = flowSlice.actions;

export default flowSlice.reducer;
