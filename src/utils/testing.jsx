import { LocaleProvider } from "@/i18n";
import { setupTestStore } from "@/state/store.js";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

export function renderWithProviders(ui, extendedRenderOptions = {}) {
  const {
    preloadedState = {},
    locale = "en-CA",
    // Automatically create a store instance if no store was passed in
    store = setupTestStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }) => (
    <LocaleProvider initialLocale={locale}>
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    </LocaleProvider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export function renderWithLocale(ui, options = {}) {
  return renderWithProviders(ui, options);
}
