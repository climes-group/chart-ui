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

      <header className="absolute top-2 right-2 z-[3]">
        <OidcLogin />
      </header>

      <main className="relative z-[2] h-full px-4 pt-14 pb-4 sm:p-8">
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
