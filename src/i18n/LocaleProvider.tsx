import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import enCA from "./locales/en-CA.json";

export const SUPPORTED_LOCALES = ["en-CA"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en-CA";

type Dictionary = Record<string, string>;
const DICTIONARIES: Record<Locale, Dictionary> = {
  "en-CA": enCA,
};

const STORAGE_KEY = "locale";

function isLocale(value: string | null): value is Locale {
  return value !== null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function detectInitialLocale(): Locale {
  if (typeof globalThis.window === "undefined") return DEFAULT_LOCALE;
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;
  return DEFAULT_LOCALE;
}

function interpolate(
  template: string,
  vars?: Record<string, unknown>,
): string {
  if (!vars) return template;
  return template.replaceAll(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(vars, key) ? String(vars[key]) : match,
  );
}

export type TranslateFn = (
  key: string,
  vars?: Record<string, unknown>,
) => string;

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: TranslateFn;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function LocaleProvider({
  children,
  initialLocale,
}: Readonly<LocaleProviderProps>) {
  const [localeState, setLocaleState] = useState<Locale>(
    () => initialLocale ?? detectInitialLocale(),
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = localeState;
    }
  }, [localeState]);

  const setLocale = useCallback((next: Locale) => {
    if (!(SUPPORTED_LOCALES as readonly string[]).includes(next)) return;
    setLocaleState(next);
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const dict = DICTIONARIES[localeState] ?? DICTIONARIES[DEFAULT_LOCALE];
    const t: TranslateFn = (key, vars) => {
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
