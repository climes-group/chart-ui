import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type ReactNode,
} from "react";

type IntakeFill = ((data: Record<string, unknown>) => void) | null;

type TestModeContextValue = {
  intakeFillRef: RefObject<IntakeFill>;
  debugMode: boolean;
  setDebugMode: (next: boolean) => void;
};

const TestModeContext = createContext<TestModeContextValue | null>(null);

const readFlag = (key: string) => localStorage.getItem(key) === "true";

export function TestModeProvider({ children }: Readonly<{ children: ReactNode }>) {
  // Holds a ref to the IntakeCard's live field-setter function.
  // IntakeCard registers this when mounted; TestModePanel calls it on autofill.
  const intakeFillRef = useRef<IntakeFill>(null);

  const [debugMode, setDebugMode] = useState<boolean>(() =>
    readFlag("CHART_DEBUG_MODE"),
  );

  const setDebugModeCallback = useCallback((next: boolean) => {
    localStorage.setItem("CHART_DEBUG_MODE", String(next));
    setDebugMode(next);
  }, []);

  const contextValue = useMemo(
    () => ({ intakeFillRef, debugMode, setDebugMode: setDebugModeCallback }),
    [intakeFillRef, debugMode, setDebugModeCallback]
  );

  return (
    <TestModeContext.Provider value={contextValue}>
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
