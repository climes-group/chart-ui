import { createContext, useCallback, useContext, useRef, useState } from "react";

const TestModeContext = createContext(null);

const readFlag = (key) => localStorage.getItem(key) === "true";

export function TestModeProvider({ children }) {
  // Holds a ref to the IntakeCard's live field-setter function.
  // IntakeCard registers this when mounted; TestModePanel calls it on autofill.
  const intakeFillRef = useRef(null);

  const [debugMode, setDebugModeState] = useState(() =>
    readFlag("CHART_DEBUG_MODE"),
  );

  const setDebugMode = useCallback((next) => {
    localStorage.setItem("CHART_DEBUG_MODE", String(next));
    setDebugModeState(next);
  }, []);

  return (
    <TestModeContext.Provider
      value={{ intakeFillRef, debugMode, setDebugMode }}
    >
      {children}
    </TestModeContext.Provider>
  );
}

export function useTestMode() {
  const ctx = useContext(TestModeContext);
  return {
    isTestMode: import.meta.env.DEV || readFlag("CHART_TEST_MODE"),
    intakeFillRef: ctx?.intakeFillRef,
  };
}

export function useDebugMode() {
  return useContext(TestModeContext)?.debugMode ?? false;
}

export function useSetDebugMode() {
  return useContext(TestModeContext)?.setDebugMode ?? (() => {});
}
