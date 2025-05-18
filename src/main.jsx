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

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { setupStore } from "./state/store.js";

const router = createBrowserRouter([
  {
    exact: true,
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/flow/intake" replace />,
      },
      {
        exact: true,
        path: "/flow/*",
        element: <Chart />,
      },
      {
        path: "*",
        element: <Navigate to="/flow/intake" replace />,
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
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <Provider store={setupStore()}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
