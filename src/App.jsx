import "./App.css";
import Footer from "./components/Footer";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
