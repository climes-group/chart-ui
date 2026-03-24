import { useSelector } from "react-redux";
import { Outlet } from "react-router";

function App() {
  const theme = useSelector((state) => state.flow.theme);

  return (
    <>
      <main className="p-8 min-h-[90vh]" data-theme={theme}>
        <Outlet />
      </main>
    </>
  );
}

export default App;
