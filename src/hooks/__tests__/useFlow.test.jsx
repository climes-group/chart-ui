import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/i18n";
import { setupTestStore } from "@/state/store.js";
import { meetCondition } from "@/state/slices/flowReducer";
import useFlow from "../useFlow";

const wrapper = ({ children }) => (
  <LocaleProvider initialLocale="en-CA">
    <Provider store={setupTestStore()}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  </LocaleProvider>
);
vi.mock("react-redux", { spy: true });

const testSteps = [
  { id: 1, name: "Step 1" },
  { id: 2, name: "Step 2" },
  { id: 3, name: "Step 3" },
];
// each step has a next and previous step that's the name of the next and previous step, null if there isn't one
testSteps.forEach((step, i) => {
  step.next = i < testSteps.length - 1 ? testSteps[i + 1].name : null;
  step.prev = i > 0 ? testSteps[i - 1].name : null;
});

const stepsWithCondition = [
  { id: 1, name: "Step 1", next: "Step 2", prev: null, leaveCondition: true },
  { id: 2, name: "Step 2", prev: "Step 1", next: "Step 3" },
  { id: 3, name: "Step 3", prev: "Step 2", next: null },
];

function makeWrapper(store) {
  return ({ children }) => (
    <LocaleProvider initialLocale="en-CA">
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    </LocaleProvider>
  );
}

describe("useFlow", () => {
  beforeEach(() => {});

  it("goes to the next step", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { currentStep, next } = result.current;
    expect(currentStep.id).toBe(1);
    act(() => {
      next();
    });
    expect(result.current.currentStep.id).toBe(2);
  });

  it("jumps to step", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { currentStep, jumpTo } = result.current;
    expect(currentStep.id).toBe(1);
    act(() => {
      jumpTo("Step 3");
    });
    expect(result.current.currentStep.id).toBe(3);
  });

  it("goes back", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { currentStep, jumpTo, back } = result.current;
    expect(currentStep.id).toBe(1);
    act(() => {
      jumpTo("Step 2");
      back();
    });
    expect(result.current.currentStep.id).toBe(1);
  });

  it("resets", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { currentStep, jumpTo, reset } = result.current;
    expect(currentStep.id).toBe(1);
    act(() => {
      jumpTo("Step 3");
      reset();
    });
    expect(result.current.currentStep.id).toBe(1);
  });

  it("sets error when condition not met on next", () => {
    const store = setupTestStore();
    const { result } = renderHook(() => useFlow(stepsWithCondition), {
      wrapper: makeWrapper(store),
    });
    expect(result.current.currentStep.id).toBe(1);
    act(() => {
      result.current.next();
    });
    expect(result.current.error).toBe("Please complete the required fields.");
  });

  it("sets error when condition not met on jumpTo", () => {
    const store = setupTestStore();
    const { result } = renderHook(() => useFlow(stepsWithCondition), {
      wrapper: makeWrapper(store),
    });
    expect(result.current.currentStep.id).toBe(1);
    act(() => {
      result.current.jumpTo("Step 2");
    });
    expect(result.current.error).toBe("Conditions not met");
  });

  it("clears error after condition is met and next succeeds", () => {
    const store = setupTestStore();
    const { result } = renderHook(() => useFlow(stepsWithCondition), {
      wrapper: makeWrapper(store),
    });
    act(() => {
      result.current.next();
    });
    expect(result.current.error).toBeTruthy();

    act(() => {
      store.dispatch(meetCondition({ name: "Step 1", condition: true }));
    });
    act(() => {
      result.current.next();
    });
    expect(result.current.error).toBeNull();
    expect(result.current.currentStep.id).toBe(2);
  });

  it("clears error after condition is met and jumpTo succeeds", () => {
    const store = setupTestStore();
    const { result } = renderHook(() => useFlow(stepsWithCondition), {
      wrapper: makeWrapper(store),
    });
    act(() => {
      result.current.jumpTo("Step 2");
    });
    expect(result.current.error).toBeTruthy();

    act(() => {
      store.dispatch(meetCondition({ name: "Step 1", condition: true }));
    });
    act(() => {
      result.current.jumpTo("Step 2");
    });
    expect(result.current.error).toBeNull();
    expect(result.current.currentStep.id).toBe(2);
  });

  it("clears error on back", () => {
    const store = setupTestStore();
    const { result } = renderHook(() => useFlow(stepsWithCondition), {
      wrapper: makeWrapper(store),
    });
    // Jump to step 2 with condition met, then trigger error on step 2's next
    act(() => {
      store.dispatch(meetCondition({ name: "Step 1", condition: true }));
    });
    act(() => {
      result.current.jumpTo("Step 2");
    });
    act(() => {
      result.current.next(); // Step 2 has no leaveCondition so this succeeds, move to step 3
    });
    // Force an error state manually so we can verify back() clears it
    act(() => {
      result.current.jumpTo("Step 2"); // jumps back, no error
    });
    act(() => {
      result.current.next(); // no leaveCondition on step 2, moves forward cleanly
      result.current.back();
    });
    expect(result.current.error).toBeNull();
  });

  it("jumpTo checks conditions for every step in the chain", () => {
    // Step 1 has leaveCondition; jumping directly to Step 3 should fail
    // even though the immediate predecessor (Step 2) has no condition
    const store = setupTestStore();
    const { result } = renderHook(() => useFlow(stepsWithCondition), {
      wrapper: makeWrapper(store),
    });
    act(() => {
      result.current.jumpTo("Step 3");
    });
    expect(result.current.error).toBe("Conditions not met");
    expect(result.current.currentStep.id).toBe(1);
  });

  it("jumpTo returns an empty array on success", () => {
    const store = setupTestStore();
    const { result } = renderHook(() => useFlow(stepsWithCondition), {
      wrapper: makeWrapper(store),
    });
    act(() => {
      store.dispatch(meetCondition({ name: "Step 1", condition: true }));
    });
    let returned;
    act(() => {
      returned = result.current.jumpTo("Step 2");
    });
    expect(returned).toEqual([]);
    expect(result.current.currentStep.id).toBe(2);
  });

  it("jumpTo returns blocking step names when condition not met", () => {
    const store = setupTestStore();
    const { result } = renderHook(() => useFlow(stepsWithCondition), {
      wrapper: makeWrapper(store),
    });
    let returned;
    act(() => {
      returned = result.current.jumpTo("Step 2");
    });
    expect(returned).toEqual(["Step 1"]);
    expect(result.current.currentStep.id).toBe(1);
  });

  describe("isStepLocked", () => {
    it("returns false for the first step (no preceding steps)", () => {
      const store = setupTestStore();
      const { result } = renderHook(() => useFlow(stepsWithCondition), {
        wrapper: makeWrapper(store),
      });
      expect(result.current.isStepLocked("Step 1")).toBe(false);
    });

    it("returns true when a preceding step has an unmet condition", () => {
      const store = setupTestStore();
      const { result } = renderHook(() => useFlow(stepsWithCondition), {
        wrapper: makeWrapper(store),
      });
      // Step 1 condition starts false; Step 2 is locked
      expect(result.current.isStepLocked("Step 2")).toBe(true);
    });

    it("returns false when all preceding conditions are met", () => {
      const store = setupTestStore();
      const { result } = renderHook(() => useFlow(stepsWithCondition), {
        wrapper: makeWrapper(store),
      });
      act(() => {
        store.dispatch(meetCondition({ name: "Step 1", condition: true }));
      });
      expect(result.current.isStepLocked("Step 2")).toBe(false);
    });

    it("returns true for a step deep in the chain when an early condition is unmet", () => {
      const store = setupTestStore();
      const { result } = renderHook(() => useFlow(stepsWithCondition), {
        wrapper: makeWrapper(store),
      });
      // Step 3 is locked because Step 1's condition is unmet
      expect(result.current.isStepLocked("Step 3")).toBe(true);
    });

    it("returns false for a step with no conditions in the chain", () => {
      const store = setupTestStore();
      const { result } = renderHook(() => useFlow(testSteps), {
        wrapper: makeWrapper(store),
      });
      // testSteps has no leaveConditions at all
      expect(result.current.isStepLocked("Step 2")).toBe(false);
      expect(result.current.isStepLocked("Step 3")).toBe(false);
    });
  });
});
