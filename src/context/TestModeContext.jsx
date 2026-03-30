import { createContext, useContext, useRef } from "react";

const TestModeContext = createContext(null);

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
    isTestMode: localStorage.getItem("CHART_TEST_MODE") === "true",
    intakeFillRef: ctx?.intakeFillRef,
  };
}
