import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import OidcLogin from "./components/Auth/OidcLogin";
import TestModePanel from "./components/TestMode/TestModePanel";
import { TestModeProvider } from "./components/TestMode/TestModeContext";
import { useIdleTimeout } from "./hooks/useIdleTimeout";
import type { RootState } from "./state/store";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

function AppInner() {
  const theme = useSelector((state: RootState) => state.flow.theme);

  useIdleTimeout(() => {
    sessionStorage.clear();
    globalThis.location.reload();
  }, IDLE_TIMEOUT_MS);

  return (
    <>
      <div className="page-bg fixed inset-0 z-0" data-theme={theme} />

      <div className="relative z-[2] flex min-h-full flex-col">
        <header className="flex items-center justify-end gap-4 px-4 pt-3 pb-2 sm:px-8 sm:pt-4">
          <OidcLogin />
        </header>

        <main className="flex-1 px-4 pb-4 sm:px-8 sm:pb-8">
          <Outlet />
        </main>
      </div>

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
