import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "../../state/store.js";
import useFlow from "../useFlow";

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
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

describe("useFlow", () => {
  beforeEach(() => {});

  it("should go to the next step", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { currentStep, next } = result.current;
    expect(currentStep.id).toBe(1);
    act(() => {
      next();
    });
    expect(result.current.currentStep.id).toBe(2);
  });

  it("should jump to step", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { currentStep, jumpTo } = result.current;
    expect(currentStep.id).toBe(1);
    act(() => {
      jumpTo(3);
    });
    expect(result.current.currentStep.id).toBe(3);
  });

  it("should go back", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { currentStep, jumpTo, back } = result.current;
    expect(currentStep.id).toBe(1);
    act(() => {
      jumpTo(2);
      back();
    });
    expect(result.current.currentStep.id).toBe(1);
  });
});
