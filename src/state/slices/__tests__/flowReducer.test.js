import reducer, {
  jumpToStep,
  meetCondition,
  setError,
  setSteps,
  setTheme,
  stepBackward,
  stepForward,
} from "../flowReducer";

const initialState = {
  steps: [],
  currentStep: undefined,
  error: undefined,
  conditions: {},
  theme: 1,
};

const steps = [
  { name: "step-1", next: "step-2", prev: null },
  { name: "step-2", next: "step-3", prev: "step-1" },
  { name: "step-3", next: null, prev: "step-2" },
];

const stepsWithCondition = [
  { name: "step-1", next: "step-2", prev: null, leaveCondition: true },
  { name: "step-2", next: null, prev: "step-1" },
];

describe("flowReducer", () => {
  it("returns the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("setSteps", () => {
    it("sets steps and initialises currentStep to the first step", () => {
      const state = reducer(initialState, setSteps(steps));
      expect(state.steps).toEqual(steps);
      expect(state.currentStep).toEqual(steps[0]);
    });

    it("clears error when steps are set", () => {
      const withError = reducer(initialState, setError("oops"));
      const state = reducer(withError, setSteps(steps));
      expect(state.error).toBeUndefined();
    });

    it("initialises conditions for steps that have leaveCondition", () => {
      const state = reducer(initialState, setSteps(stepsWithCondition));
      expect(state.conditions).toEqual({ "step-1": false });
    });

    it("does not create conditions for steps without leaveCondition", () => {
      const state = reducer(initialState, setSteps(steps));
      expect(Object.keys(state.conditions)).toHaveLength(0);
    });
  });

  describe("stepForward", () => {
    it("moves to the next step", () => {
      const s1 = reducer(initialState, setSteps(steps));
      const s2 = reducer(s1, stepForward());
      expect(s2.currentStep.name).toBe("step-2");
    });
  });

  describe("stepBackward", () => {
    it("moves to the previous step", () => {
      const s1 = reducer(initialState, setSteps(steps));
      const s2 = reducer(s1, stepForward());
      const s3 = reducer(s2, stepBackward());
      expect(s3.currentStep.name).toBe("step-1");
    });
  });

  describe("jumpToStep", () => {
    it("jumps to the named step", () => {
      const s1 = reducer(initialState, setSteps(steps));
      const s2 = reducer(s1, jumpToStep("step-3"));
      expect(s2.currentStep.name).toBe("step-3");
    });

    it("sets currentStep to undefined for an unknown step name", () => {
      const s1 = reducer(initialState, setSteps(steps));
      const s2 = reducer(s1, jumpToStep("does-not-exist"));
      expect(s2.currentStep).toBeUndefined();
    });
  });

  describe("meetCondition", () => {
    it("marks a condition as met", () => {
      const s1 = reducer(initialState, setSteps(stepsWithCondition));
      const s2 = reducer(s1, meetCondition({ name: "step-1" }));
      expect(s2.conditions["step-1"]).toBe(true);
    });

    it("marks a condition as explicitly false", () => {
      const s1 = reducer(initialState, setSteps(stepsWithCondition));
      const s2 = reducer(s1, meetCondition({ name: "step-1", condition: false }));
      expect(s2.conditions["step-1"]).toBe(false);
    });

    it("defaults condition to true when not specified", () => {
      const s1 = reducer(initialState, setSteps(stepsWithCondition));
      const s2 = reducer(s1, meetCondition({ name: "step-1" }));
      expect(s2.conditions["step-1"]).toBe(true);
    });
  });

  describe("setError", () => {
    it("sets an error message", () => {
      const state = reducer(initialState, setError("Something went wrong"));
      expect(state.error).toBe("Something went wrong");
    });

    it("clears an error when set to undefined", () => {
      const s1 = reducer(initialState, setError("err"));
      const s2 = reducer(s1, setError(undefined));
      expect(s2.error).toBeUndefined();
    });
  });

  describe("setTheme", () => {
    it("updates the theme", () => {
      const state = reducer(initialState, setTheme(2));
      expect(state.theme).toBe(2);
    });
  });
});
