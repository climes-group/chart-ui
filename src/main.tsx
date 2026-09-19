import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
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
import { LocaleProvider } from "./i18n";
import "./index.css";
import Chart from "./pages/Chart";
import Design from "./pages/Design";
import SavedReports from "./pages/SavedReports";
import SplashCard from "./pages/Splash";
import { setupStore } from "./state/store";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";

const { store, persistor } = setupStore();

enableMapSet();

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: "https://login.microsoftonline.com/consumers",
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

const MUI_FALLBACKS = {
  primary: "#224352",
  secondary: "#e2b046",
  destructive: "#c85a3a",
};

function readSemanticColor(
  name: keyof typeof MUI_FALLBACKS,
): string {
  const probe = document.createElement("span");
  probe.style.color = `var(--${name})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color.trim();
  probe.remove();
  return value && value !== `var(--${name})`
    ? value
    : MUI_FALLBACKS[name];
}

function MuiThemeBridge({ children }: Readonly<{ children: React.ReactNode }>) {
  const { mode } = useTheme();
  const [colors, setColors] = React.useState(MUI_FALLBACKS);

  React.useEffect(() => {
    setColors({
      primary: readSemanticColor("primary"),
      secondary: readSemanticColor("secondary"),
      destructive: readSemanticColor("destructive"),
    });
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: colors.primary },
          secondary: { main: colors.secondary },
          error: { main: colors.destructive },
        },
        typography: {
          fontFamily: [
            "AvenirLtNextPro",
            "Helvetica",
            "Arial",
            "sans-serif",
          ].join(","),
        },
        shape: { borderRadius: 10 },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: "var(--foreground)",
                backgroundColor: "var(--surface)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--input)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--foreground)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--ring)",
                },
              },
              input: {
                color: "var(--foreground)",
                "&::placeholder": {
                  color: "var(--muted-foreground)",
                  opacity: 1,
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: "var(--muted-foreground)",
                "&.Mui-focused": {
                  color: "var(--ring)",
                },
              },
            },
          },
          MuiFormHelperText: {
            styleOverrides: {
              root: {
                color: "var(--muted-foreground)",
                "&.Mui-error": {
                  color: "var(--destructive)",
                },
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: "var(--input)",
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
                "&.Mui-checked": {
                  color: "var(--primary)",
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                color: "var(--foreground)",
                backgroundColor: "var(--surface)",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: "var(--foreground)",
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
                "&.Mui-selected": {
                  backgroundColor: "var(--accent)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "var(--accent)",
                },
              },
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              paper: {
                color: "var(--foreground)",
                backgroundColor: "var(--surface)",
              },
              option: {
                color: "var(--foreground)",
                "&[aria-selected='true']": {
                  backgroundColor: "var(--accent)",
                },
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
              },
            },
          },
        },
      }),
    [colors],
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <MsalProvider instance={msalInstance}>
      <React.StrictMode>
        <ThemeProvider>
          <LocaleProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <MuiThemeBridge>
                  <RouterProvider router={router} />
                </MuiThemeBridge>
              </PersistGate>
            </Provider>
          </LocaleProvider>
        </ThemeProvider>
      </React.StrictMode>
    </MsalProvider>
  </GoogleOAuthProvider>,
);
