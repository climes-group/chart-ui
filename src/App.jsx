import { Outlet } from "react-router";

function App() {
  return (
    <>
      <main className="m-8 min-h-[90vh]">
        <Outlet />
      </main>
    </>
  );
}

export default App;
