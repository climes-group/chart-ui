import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Chart from "./Chart.jsx";
import Header from "./components/Header/index.jsx";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./state/store.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Header />
            <Chart />
          </>
        ),
      },
    ],
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(52, 88, 0)",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
