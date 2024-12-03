import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import Chart from "./Chart.jsx";

import "./index.css";

import { Provider } from "react-redux";
import { store } from "./state/store.js";
const router = createBrowserRouter([
  {
    exact: true,
    path: "/",
    element: <App />,
    children: [
      {
        exact: true,
        path: "/flow/*",
        element: <Chart />,
      },
      {
        path: "*",
        element: <Navigate to="/flow/intake" />,
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
