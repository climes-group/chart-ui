import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import enCA from "./locales/en-CA.json";
import frCA from "./locales/fr-CA.json";

export const SUPPORTED_LOCALES = ["en-CA", "fr-CA"];
export const DEFAULT_LOCALE = "en-CA";

const DICTIONARIES = {
  "en-CA": enCA,
  "fr-CA": frCA,
};

const STORAGE_KEY = "locale";

function detectInitialLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage?.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;
  const browser = window.navigator?.language;
  if (browser?.toLowerCase().startsWith("fr")) return "fr-CA";
  return DEFAULT_LOCALE;
}

function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match,
  );
}

export const LocaleContext = createContext(null);

export function LocaleProvider({ children, initialLocale }) {
  const [locale, setLocaleState] = useState(
    () => initialLocale ?? detectInitialLocale(),
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next) => {
    if (!SUPPORTED_LOCALES.includes(next)) return;
    setLocaleState(next);
    try {
      window.localStorage?.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, []);

  const value = useMemo(() => {
    const dict = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
    const t = (key, vars) => {
      const template = dict[key];
      if (template === undefined) return key;
      return interpolate(template, vars);
    };
    return { locale, setLocale, t };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
