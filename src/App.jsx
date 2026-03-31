import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import OidcLogin from "./components/Auth/OidcLogin";
import { TestModeProvider, useTestMode, VARIANTS } from "./context/TestModeContext";
import TestModePanel from "./components/TestMode/TestModePanel";

function AppInner() {
  const theme = useSelector((state) => state.flow.theme);
  const { variantIdx } = useTestMode();
  const Accent = VARIANTS[variantIdx]?.Component;

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
      {Accent && <Accent />}

      {/*
       * Layer 3 — page chrome + content.
       * main is transparent (no background-color) so the SVG shows through
       * around the card. The card itself has bg-card (white) which covers the SVG.
       */}
      <header className="absolute top-2 right-2 z-[3]">
        <OidcLogin />
      </header>

      <main className="px-4 pt-14 pb-4 sm:p-8 h-full relative z-[2]">
        <Outlet />
      </main>

      <TestModePanel />
    </>
  );
}

function App() {
  return (
    <TestModeProvider>
      <AppInner />
    </TestModeProvider>
  );
}

export default App;
