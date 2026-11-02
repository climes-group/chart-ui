import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import OidcLogin from "./components/Auth/OidcLogin";
import DebugBanner from "./components/TestMode/DebugBanner";
import { TestModeProvider } from "./components/TestMode/TestModeContext";
import { useIdleTimeout } from "./hooks/useIdleTimeout";
import { useTranslation } from "./i18n";
import { getPageTitle } from "./utils/getPageTitle";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

function AppInner() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useIdleTimeout(() => {
    sessionStorage.clear();
    globalThis.location.reload();
  }, IDLE_TIMEOUT_MS);

  useEffect(() => {
    document.title = getPageTitle(pathname, t);
  }, [pathname, t]);

  return (
    <>
      <div className="page-bg fixed inset-0 z-0" />

      <div className="relative z-[2] flex min-h-full flex-col">
        <header className="flex items-center justify-end gap-4 px-4 pt-3 pb-2 sm:px-8 sm:pt-4">
          <OidcLogin />
        </header>

        <main className="flex-1 px-4 pb-4 sm:px-8 sm:pb-8">
          <Outlet />
        </main>
      </div>
      <DebugBanner />
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
