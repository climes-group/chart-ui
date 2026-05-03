import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LocaleProvider } from "../LocaleProvider";
import { useTranslation } from "../useTranslation";

function wrapper(initialLocale) {
  // eslint-disable-next-line react/display-name
  return ({ children }) => (
    <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
  );
}

describe("useTranslation", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("looks up a key in en-CA by default", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(result.current.t("common.back")).toBe("Back");
  });

  it("looks up a key in fr-CA", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("fr-CA"),
    });
    expect(result.current.t("common.back")).toBe("Précédent");
  });

  it("returns the key itself when a translation is missing", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(result.current.t("does.not.exist")).toBe("does.not.exist");
  });

  it("interpolates {name} placeholders", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(
      result.current.t("auth.loggedInAs", { email: "a@b.com" }),
    ).toBe("Logged in as a@b.com");
  });

  it("leaves an unknown placeholder untouched", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(
      result.current.t("auth.loggedInAs", { other: "x" }),
    ).toBe("Logged in as {email}");
  });

  it("setLocale switches the active dictionary", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(result.current.t("common.next")).toBe("Next");

    act(() => result.current.setLocale("fr-CA"));

    expect(result.current.locale).toBe("fr-CA");
    expect(result.current.t("common.next")).toBe("Suivant");
  });

  it("setLocale persists to localStorage", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    act(() => result.current.setLocale("fr-CA"));
    expect(window.localStorage.getItem("locale")).toBe("fr-CA");
  });

  it("setLocale ignores unsupported locales", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    act(() => result.current.setLocale("es-MX"));
    expect(result.current.locale).toBe("en-CA");
  });

  it("setLocale updates document.documentElement.lang", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(document.documentElement.lang).toBe("en-CA");
    act(() => result.current.setLocale("fr-CA"));
    expect(document.documentElement.lang).toBe("fr-CA");
  });
});
