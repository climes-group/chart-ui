import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import OidcLogin from "./components/Auth/OidcLogin";
import {
  CrystallineAccent,
  FractalBranchAccent,
  TessellationAccent,
} from "./components/BackgroundAccent";

const VARIANTS = [
  { label: "A · Tessellation", Component: TessellationAccent },
  { label: "B · Fractal Branches", Component: FractalBranchAccent },
  { label: "C · Crystalline", Component: CrystallineAccent },
];

function App() {
  const theme = useSelector((state) => state.flow.theme);
  const [variantIdx, setVariantIdx] = useState(0);
  const { Component: Accent } = VARIANTS[variantIdx];

  return (
    <>
      {/*
       * Layer 1 — page background (white + linen corner gradients).
       * Sits at z-0, behind the SVG accent.
       */}
      <div className="page-bg fixed inset-0 z-0" data-theme={theme} />

      {/*
       * Layer 2 — SVG fractal accent.
       * z-[1]: above background, below card content.
       */}
      <Accent />

      {/*
       * Layer 3 — page chrome + content.
       * main is transparent (no background-color) so the SVG shows through
       * around the card. The card itself has bg-card (white) which covers the SVG.
       */}
      <header className="absolute right-0 z-[3]">
        <OidcLogin />
      </header>

      <main className="p-8 h-full relative z-[2]">
        <Outlet />
      </main>

      {/* Dev-only variant picker — remove once design is finalised */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/90 backdrop-blur border border-border rounded-full px-3 py-1.5 shadow-md">
          {VARIANTS.map((v, i) => (
            <button
              key={v.label}
              onClick={() => setVariantIdx(i)}
              className={[
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                i === variantIdx
                  ? "bg-moss-primary text-white"
                  : "text-muted-foreground hover:bg-muted",
              ].join(" ")}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
