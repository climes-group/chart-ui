import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  steps: [],
  currentStep: undefined,
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
      state.conditions = action.payload.map(() => true);
      state.error = undefined;
    },
    stepBackward: (state) => {
      state.currentStep = state.steps.find(
        (x) => x.name === state.currentStep.prev,
      );
    },
    stepForward: (state) => {
      state.currentStep = state.steps.find(
        (x) => x.name === state.currentStep.next,
      );
    },
    stepDone: (state) => {
      state.currentStep = { ...state.currentStep, done: true };
    },
    jumpToStep: (state, action) => {
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
  stepDone,
  jumpToStep,
  setInitial,
  meetCondition,
  setConditions,
  setError,
  setSteps,
} = flowSlice.actions;

export default flowSlice.reducer;
