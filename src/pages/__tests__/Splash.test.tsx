import { renderWithProviders } from "@/utils/testing";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import SplashCard from "../Splash";

function renderSplash() {
  return renderWithProviders(
    <ThemeProvider>
      <SplashCard />
    </ThemeProvider>,
  );
}

describe("SplashCard", () => {
  it("renders the title, tagline, and call-to-action in en-CA", () => {
    renderSplash();
    expect(screen.getByRole("heading", { name: "CHART" })).toBeInTheDocument();
    expect(
      screen.getByText("Charting your path to resilience"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Get started" }),
    ).toBeInTheDocument();
  });

  it("dispatches setLoginModalOpen when the button is clicked and user is not logged in", () => {
    const { store } = renderWithProviders(
      <ThemeProvider>
        <SplashCard />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: "Get started" });
    button.click();

    const state = store.getState();
    expect(state.user.loginModalOpen).toBe(true);
  });

  it("has no axe violations in en-CA", async () => {
    const { container } = renderSplash();
    expect(await axe(container)).toHaveNoViolations();
  });
});
