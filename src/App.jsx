import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import OidcLogin from "./components/Auth/OidcLogin";

function App() {
  const theme = useSelector((state) => state.flow.theme);

  return (
    <>
      <header className="absolute right-0">
        <OidcLogin />
      </header>
      <main className="p-8 h-full" data-theme={theme}>
        <Outlet />
      </main>
    </>
  );
}

export default App;
