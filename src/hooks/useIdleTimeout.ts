import { useEffect, useRef } from "react";

const EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

export function useIdleTimeout(onIdle: () => void, timeoutMs: number) {
  const onIdleRef = useRef(onIdle);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onIdleRef.current = onIdle;
  });

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    EVENTS.forEach((e) =>
      globalThis.addEventListener(e, reset, { passive: true }),
    );
    reset();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      EVENTS.forEach((e) => globalThis.removeEventListener(e, reset));
    };
  }, [timeoutMs]);
}
