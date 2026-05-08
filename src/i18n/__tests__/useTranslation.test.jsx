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
    globalThis.localStorage.clear();
  });

  it("looks up a key in en-CA by default", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(result.current.t("common.back")).toBe("Back");
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
    expect(result.current.t("auth.loggedInAs", { email: "a@b.com" })).toBe(
      "Logged in as a@b.com",
    );
  });

  it("leaves an unknown placeholder untouched", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(result.current.t("auth.loggedInAs", { other: "x" })).toBe(
      "Logged in as {email}",
    );
  });

  it("setLocale ignores unsupported locales", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    act(() => result.current.setLocale("es-MX"));
    expect(result.current.locale).toBe("en-CA");
  });

  it("sets document.documentElement.lang from the active locale", () => {
    renderHook(() => useTranslation(), {
      wrapper: wrapper("en-CA"),
    });
    expect(document.documentElement.lang).toBe("en-CA");
  });
});
