import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header/index.jsx";

function App() {
  return (
    <>
      <Header />
      <main className="m-8">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
