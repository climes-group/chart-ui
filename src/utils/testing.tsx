import { LocaleProvider, type Locale } from "@/i18n";
import {
  setupTestStore,
  type AppStore,
  type PreloadedRootState,
} from "@/state/store";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

type ExtendedRenderOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: PreloadedRootState;
  locale?: Locale;
  store?: AppStore;
};

export function renderWithProviders(
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) {
  const {
    preloadedState = {},
    locale = "en-CA",
    store = setupTestStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <LocaleProvider initialLocale={locale}>
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    </LocaleProvider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export function renderWithLocale(
  ui: ReactElement,
  options: ExtendedRenderOptions = {},
) {
  return renderWithProviders(ui, options);
}
