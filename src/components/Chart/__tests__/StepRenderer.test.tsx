import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../Cards/IntakeCard", () => ({
  default: () => <div>IntakeCard</div>,
}));
vi.mock("../Cards/SystemsCard", () => ({
  default: () => <div>SystemsCard</div>,
}));
vi.mock("../Cards/SiteFeaturesCard", () => ({
  default: () => <div>SiteFeaturesCard</div>,
}));
vi.mock("../Cards/SummaryCard", () => ({
  default: () => <div>SummaryCard</div>,
}));
vi.mock("../Cards/ReportCard", () => ({
  default: () => <div>ReportCard</div>,
}));

import { renderWithProviders } from "@/utils/testing";
import StepRenderer from "../StepRenderer";

describe("StepRenderer", () => {
  it("renders the translated step heading and focuses the heading when the step changes", async () => {
    const registerNext = vi.fn();
    const nav = vi.fn();

    const { rerender } = renderWithProviders(
      <StepRenderer
        step={{ name: "intake" }}
        registerNext={registerNext}
        nav={nav}
      />,
    );

    const intakeHeading = screen.getByRole("heading", { name: "Intake" });
    expect(intakeHeading).toHaveAttribute("tabindex", "-1");

    await waitFor(() => {
      expect(document.activeElement).toBe(intakeHeading);
    });

    rerender(
      <StepRenderer
        step={{ name: "systems" }}
        registerNext={registerNext}
        nav={nav}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Systems" })).toBe(
        document.activeElement,
      );
    });
  });
});
