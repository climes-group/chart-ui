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
import App from "./App";
import Chart from "./Chart";
import SplashCard from "./components/Chart/Flow/Cards/Splash";
import Design from "./components/Design";
import SavedReports from "./components/SavedReports";
import { LocaleProvider } from "./i18n";
import "./index.css";
import { setupStore } from "./state/store";

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
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <SplashCard />,
      },
      {
        path: "/design",
        element: <Design />,
      },
      {
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
    fontFamily: ["AvenirLtNextPro", "Helvetica", "Arial", "sans-serif"].join(
      ",",
    ),
  },
  shape: {
    borderRadius: 10,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
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
