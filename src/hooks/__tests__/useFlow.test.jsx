import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "../../state/store.js";
import useFlow from "../useFlow";

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
vi.mock("react-redux", { spy: true });

// each step has a next and previous step
const testSteps = [
  { id: 1, name: "Step 1" },
  { id: 2, name: "Step 2" },
  { id: 3, name: "Step 3" },
];
testSteps.forEach((step, index) => {
  step.next = index < testSteps.length - 1 ? testSteps[index + 1].id : null;
  step.prev = index > 0 ? testSteps[index - 1].id : null;
});

describe("useFlow", () => {
  beforeEach(() => {});

  it("should go to the next step", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { activeStep, next } = result.current;
    expect(activeStep).toBe(1);
    act(() => {
      next();
    });
    expect(result.current.activeStep).toBe(2);
  });

  it("should jump to step", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { activeStep, jumpTo } = result.current;
    expect(activeStep).toBe(1);
    act(() => {
      jumpTo(3);
    });
    expect(result.current.activeStep).toBe(3);
  });

  it("should go back", () => {
    const { result } = renderHook(() => useFlow(testSteps), { wrapper });
    const { activeStep, jumpTo, back } = result.current;
    expect(activeStep).toBe(1);
    act(() => {
      jumpTo(2);
      back();
    });
    expect(result.current.activeStep).toBe(1);
  });
});
