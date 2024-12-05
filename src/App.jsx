import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header/index.jsx";
function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
