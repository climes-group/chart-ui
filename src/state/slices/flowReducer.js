import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  steps: [],
  currentStep: undefined,
  error: undefined,
  conditions: {},
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
      // call up to setIntial
      flowSlice.caseReducers.setInitial(state, { payload: action.payload[0] });
      state.error = undefined;
      const newConditions = action.payload.reduce((acc, step) => {
        if (step.leaveCondition) {
          acc[step.name] = false;
        }
        return acc;
      }, {});
      state.conditions = newConditions;
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
    jumpToStep: (state, action) => {
      state.currentStep = state.steps.find((x) => x.name === action.payload);
    },
    meetCondition: (state, action) => {
      const { name, condition = true } = action.payload;

      state.conditions = { ...state.conditions, [name]: condition };
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
  setError,
  setSteps,
} = flowSlice.actions;

export default flowSlice.reducer;
