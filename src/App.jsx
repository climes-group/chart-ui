import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import OidcLogin from "./components/Auth/OidcLogin";
import TestModePanel from "./components/TestMode/TestModePanel";
import { TestModeProvider } from "./context/TestModeContext";
import { useIdleTimeout } from "./hooks/useIdleTimeout";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

function AppInner() {
  const theme = useSelector((state) => state.flow.theme);

  useIdleTimeout(() => {
    sessionStorage.clear();
    window.location.reload();
  }, IDLE_TIMEOUT_MS);

  return (
    <>
      <div className="page-bg fixed inset-0 z-0" data-theme={theme} />

      <div className="relative z-[2] flex flex-col min-h-full">
        <header className="flex justify-end px-4 pt-3 pb-2 sm:px-8 sm:pt-4">
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
