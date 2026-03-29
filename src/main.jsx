import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { enableMapSet } from "immer";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import Chart from "./Chart.jsx";
import Design from "./components/Design/index.jsx";
import "./index.css";
import { setupStore } from "./state/store.js";

enableMapSet();

const router = createBrowserRouter([
  {
    exact: true,
    path: "/",
    element: <App />,
    children: [
      {
        exact: true,
        path: "/design",
        element: <Design />,
      },
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
    secondary: {
      main: "#e2b046",
    },
  },
  typography: {
    // This applies the font to all variants (h1, body1, button, etc.)
    fontFamily: ["AvenirLtNextPro", "Helvetica", "Arial", "sans-serif"].join(
      ",",
    ),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        /* If you prefer to keep your @font-face inside the JS theme 
           instead of a separate CSS file, paste it here:
        */
        @font-face {
          font-family: 'AvenirLtNextPro';
          src: url('assets/fonts/avenirLtPro.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'AvenirLtNextPro';
          src: url('assets/fonts/avenirLtProItalic.otf') format('opentype');
          font-weight: 400;
          font-style: italic;
        }
      `,
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
