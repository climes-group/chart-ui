import { LocaleProvider, useTranslation } from "@/i18n";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { beforeEach, describe, expect, it } from "vitest";
import LocaleSwitcher from "../index";

function CurrentLocale() {
  const { locale } = useTranslation();
  return <p data-testid="current-locale">{locale}</p>;
}

function renderSwitcher(initialLocale = "en-CA") {
  return render(
    <LocaleProvider initialLocale={initialLocale}>
      <LocaleSwitcher />
      <CurrentLocale />
    </LocaleProvider>,
  );
}

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "";
  });

  it("renders both locale buttons", () => {
    renderSwitcher();
    expect(screen.getByRole("button", { name: /English/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /français/i })).toBeInTheDocument();
  });

  it("marks the active locale with aria-current", () => {
    renderSwitcher("en-CA");
    const en = screen.getByRole("button", { name: /English/i });
    const fr = screen.getByRole("button", { name: /français/i });
    expect(en).toHaveAttribute("aria-current", "true");
    expect(fr).not.toHaveAttribute("aria-current");
  });

  it("disables the active locale button to prevent re-clicks", () => {
    renderSwitcher("en-CA");
    expect(screen.getByRole("button", { name: /English/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /français/i })).toBeEnabled();
  });

  it("clicking FR switches the active locale", async () => {
    renderSwitcher("en-CA");
    await userEvent.click(screen.getByRole("button", { name: /français/i }));
    expect(screen.getByTestId("current-locale")).toHaveTextContent("fr-CA");
    expect(screen.getByRole("button", { name: /français/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("clicking FR persists the choice to localStorage", async () => {
    renderSwitcher("en-CA");
    await userEvent.click(screen.getByRole("button", { name: /français/i }));
    expect(window.localStorage.getItem("locale")).toBe("fr-CA");
  });

  it("clicking FR updates document.documentElement.lang", async () => {
    renderSwitcher("en-CA");
    await userEvent.click(screen.getByRole("button", { name: /français/i }));
    expect(document.documentElement.lang).toBe("fr-CA");
  });

  it("exposes a labelled navigation landmark", () => {
    renderSwitcher();
    expect(screen.getByRole("navigation", { name: /Language/i })).toBeInTheDocument();
  });

  it("has no axe violations in en-CA", async () => {
    const { container } = renderSwitcher("en-CA");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in fr-CA", async () => {
    const { container } = renderSwitcher("fr-CA");
    expect(await axe(container)).toHaveNoViolations();
  });
});
