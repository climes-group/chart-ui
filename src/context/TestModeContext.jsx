import { createContext, useContext, useRef, useState } from "react";
import {
  CrystallineAccent,
  FractalBranchAccent,
  TessellationAccent,
} from "@/components/BackgroundAccent";

export const VARIANTS = [
  { label: "A · Tessellation", Component: TessellationAccent },
  { label: "B · Fractal Branches", Component: FractalBranchAccent },
  { label: "C · Crystalline", Component: CrystallineAccent },
];

const TestModeContext = createContext(null);

export function TestModeProvider({ children }) {
  // Holds a ref to the IntakeCard's live field-setter function.
  // IntakeCard registers this when mounted; TestModePanel calls it on autofill.
  const intakeFillRef = useRef(null);
  const [variantIdx, setVariantIdx] = useState(0);

  return (
    <TestModeContext.Provider value={{ intakeFillRef, variantIdx, setVariantIdx }}>
      {children}
    </TestModeContext.Provider>
  );
}

export function useTestMode() {
  const ctx = useContext(TestModeContext);
  return {
    isTestMode: import.meta.env.DEV || localStorage.getItem("CHART_TEST_MODE") === "true",
    intakeFillRef: ctx?.intakeFillRef,
    variantIdx: ctx?.variantIdx ?? 0,
    setVariantIdx: ctx?.setVariantIdx,
  };
}
