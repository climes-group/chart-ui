import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: undefined,
  currentStepInd: 0,
  conditions: [true],
  error: undefined,
};

export const flowSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setInitial: (state, action) => {
      state.currentStep = action.payload;
    },
    stepBackward: (state) => {
      state.currentStepInd = state.currentStep.prev;
    },
    stepForward: (state) => {
      state.currentStepInd = state.currentStep.next;
    },
    jumpToStep: (state, action) => {
      state.currentStepInd = action.payload;
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
} = flowSlice.actions;

export default flowSlice.reducer;
