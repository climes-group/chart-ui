import { createContext, useContext, useRef } from "react";

const TestModeContext = createContext(null);

const readFlag = (key) => localStorage.getItem(key) === "true";

export function TestModeProvider({ children }) {
  // Holds a ref to the IntakeCard's live field-setter function.
  // IntakeCard registers this when mounted; TestModePanel calls it on autofill.
  const intakeFillRef = useRef(null);

  return (
    <TestModeContext.Provider value={{ intakeFillRef }}>
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
  return readFlag("CHART_DEBUG_MODE");
}
