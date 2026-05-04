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

  it("renders the localized tagline and CTA in fr-CA", () => {
    renderWithProviders(<SplashCard />, { locale: "fr-CA" });
    expect(screen.getByText("Tracez votre chemin vers la résilience")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Commencer" })).toBeInTheDocument();
  });

  it("has no axe violations in en-CA", async () => {
    const { container } = renderWithProviders(<SplashCard />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in fr-CA", async () => {
    const { container } = renderWithProviders(<SplashCard />, { locale: "fr-CA" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
