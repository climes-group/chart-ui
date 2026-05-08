import { renderWithProviders } from "@/utils/testing";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import SplashCard from "../Splash";

describe("SplashCard", () => {
  it("renders the title, tagline, and call-to-action in en-CA", () => {
    renderWithProviders(<SplashCard />);
    expect(screen.getByRole("heading", { name: "CHART" })).toBeInTheDocument();
    expect(screen.getByText("Charting your path to resilience")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
  });

  it("has no axe violations in en-CA", async () => {
    const { container } = renderWithProviders(<SplashCard />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
