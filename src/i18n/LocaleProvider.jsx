import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import enCA from "./locales/en-CA.json";

export const SUPPORTED_LOCALES = ["en-CA"];
export const DEFAULT_LOCALE = "en-CA";

const DICTIONARIES = {
  "en-CA": enCA,
};

const STORAGE_KEY = "locale";

function detectInitialLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;
  return DEFAULT_LOCALE;
}

function interpolate(template, vars) {
  if (!vars) return template;
  return template.replaceAll(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(vars, key) ? String(vars[key]) : match,
  );
}

export const LocaleContext = createContext(null);

export function LocaleProvider({ children, initialLocale }) {
  const [localeState, setLocaleState] = useState(
    () => initialLocale ?? detectInitialLocale(),
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = localeState;
    }
  }, [localeState]);

  const setLocale = useCallback((next) => {
    if (!SUPPORTED_LOCALES.includes(next)) return;
    setLocaleState(next);
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, []);

  const value = useMemo(() => {
    const dict = DICTIONARIES[localeState] ?? DICTIONARIES[DEFAULT_LOCALE];
    const t = (key, vars) => {
      const template = dict[key];
      if (template === undefined) return key;
      return interpolate(template, vars);
    };
    return { locale: localeState, setLocale, t };
  }, [localeState, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
