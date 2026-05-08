import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
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
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import Chart from "./Chart.jsx";
import SplashCard from "./components/Chart/Flow/Cards/Splash.jsx";
import Design from "./components/Design/index.jsx";
import SavedReports from "./components/SavedReports/index.jsx";
import { LocaleProvider } from "./i18n";
import "./index.css";
import { setupStore } from "./state/store.js";

const { store, persistor } = setupStore();

enableMapSet();

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: globalThis.location.origin,
  },
  cache: { cacheLocation: "sessionStorage" },
});
await msalInstance.initialize();

const router = createBrowserRouter([
  {
    exact: true,
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <SplashCard />,
      },
      {
        exact: true,
        path: "/design",
        element: <Design />,
      },
      {
        exact: true,
        path: "/flow/*",
        element: <Chart />,
      },
      {
        path: "/reports",
        element: <SavedReports />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: "#224352", // --color-teal-deep
    },
    secondary: {
      main: "#e2b046", // --color-golden-accent
    },
    error: {
      main: "#e3724f", // --color-coral
    },
  },
  typography: {
    // Inherit the app's custom font so MUI labels/inputs render consistently
    fontFamily: ["AvenirLtNextPro", "Helvetica", "Arial", "sans-serif"].join(
      ",",
    ),
  },
  shape: {
    // Match the app's --radius: 0.625rem (10 px) for TextFields, selects, etc.
    borderRadius: 10,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <MsalProvider instance={msalInstance}>
      <React.StrictMode>
        <LocaleProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </LocaleProvider>
      </React.StrictMode>
    </MsalProvider>
  </GoogleOAuthProvider>,
);
