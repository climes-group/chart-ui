import { useEffect, useRef } from "react";

const EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

export function useIdleTimeout(onIdle, timeoutMs) {
  const onIdleRef = useRef(onIdle);
  const timerRef = useRef(null);

  useEffect(() => {
    onIdleRef.current = onIdle;
  });

  useEffect(() => {
    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    EVENTS.forEach((e) =>
      globalThis.addEventListener(e, reset, { passive: true }),
    );
    reset();

    return () => {
      clearTimeout(timerRef.current);
      EVENTS.forEach((e) => globalThis.removeEventListener(e, reset));
    };
  }, [timeoutMs]);
}
