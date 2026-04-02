import { renderHook, act } from "@testing-library/react";
import { useIdleTimeout } from "../useIdleTimeout";

describe("useIdleTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onIdle after the timeout elapses with no activity", () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleTimeout(onIdle, 1000));

    act(() => vi.advanceTimersByTime(1000));

    expect(onIdle).toHaveBeenCalledOnce();
  });

  it("resets the timer on user activity", () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleTimeout(onIdle, 1000));

    act(() => {
      vi.advanceTimersByTime(800);
      window.dispatchEvent(new MouseEvent("mousemove"));
      vi.advanceTimersByTime(800);
    });

    expect(onIdle).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));

    expect(onIdle).toHaveBeenCalledOnce();
  });

  it("does not call onIdle after unmount", () => {
    const onIdle = vi.fn();
    const { unmount } = renderHook(() => useIdleTimeout(onIdle, 1000));

    unmount();
    act(() => vi.advanceTimersByTime(1000));

    expect(onIdle).not.toHaveBeenCalled();
  });
});
