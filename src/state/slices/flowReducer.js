import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  steps: [],
  currentStep: undefined,
  currentStepInd: 0,
  conditions: [true],
  error: undefined,
};

export const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setInitial: (state, action) => {
      state.currentStep = action.payload;
    },
    setSteps: (state, action) => {
      state.steps = action.payload;
      state.currentStep = action.payload[0];
      state.currentStepInd = action.payload[0]?.id ?? 0;
      state.conditions = action.payload.map(() => true);
      state.error = undefined;
    },
    stepBackward: (state) => {
      console.log("stepBackward", state);
      state.currentStepInd = state.currentStep.prev;
      state.currentStep = state.steps.find(
        (x) => x.id === state.currentStep.prev,
      );
    },
    stepForward: (state) => {
      state.currentStepInd = state.currentStep.next;
      state.currentStep = state.steps.find(
        (x) => x.id === state.currentStep.next,
      );
    },
    jumpToStep: (state, action) => {
      state.currentStepInd = action.payload;
      state.currentStep = state.steps.find((x) => x.id === action.payload);
    },
    meetCondition: (state, action) => {
      const newArr = [...state.conditions];
      newArr[Math.min(newArr.length - 1, action.payload)] = true;
      if (newArr.every((x) => x)) {
        state.error = undefined;
      }
      state.conditions = newArr;
    },
    setConditions: (state, action) => {
      state.conditions = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  stepForward,
  stepBackward,
  jumpToStep,
  setInitial,
  meetCondition,
  setConditions,
  setError,
  setSteps,
} = flowSlice.actions;

export default flowSlice.reducer;
