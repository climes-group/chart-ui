import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";

type IntakeFill = ((data: Record<string, unknown>) => void) | null;

type TestModeContextValue = {
  intakeFillRef: MutableRefObject<IntakeFill>;
  debugMode: boolean;
  setDebugMode: (next: boolean) => void;
};

const TestModeContext = createContext<TestModeContextValue | null>(null);

const readFlag = (key: string) => localStorage.getItem(key) === "true";

export function TestModeProvider({ children }: { children: ReactNode }) {
  // Holds a ref to the IntakeCard's live field-setter function.
  // IntakeCard registers this when mounted; TestModePanel calls it on autofill.
  const intakeFillRef = useRef<IntakeFill>(null);

  const [debugMode, setDebugModeState] = useState<boolean>(() =>
    readFlag("CHART_DEBUG_MODE"),
  );

  const setDebugMode = useCallback((next: boolean) => {
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

export function useDebugMode(): boolean {
  return useContext(TestModeContext)?.debugMode ?? false;
}

export function useSetDebugMode(): (next: boolean) => void {
  return useContext(TestModeContext)?.setDebugMode ?? (() => {});
}
