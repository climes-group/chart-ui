import useMedia from "@/hooks/useMedia.js";
import steps from "@/steps.js";
import { renderWithProviders } from "@/utils/testing";
import { act } from "@testing-library/react";
import { describe } from "vitest";
import StepperFlow from "../StepperFlow.jsx";

vi.mock("@/hooks/useFlow", { spy: true });
vi.mock("@/hooks/useMedia");

describe("StepperFlow tests", () => {
  beforeEach(() => {
    useMedia.mockReturnValue([false]);
  });

  it("should render Desktop stepper with clickable step", async () => {
    const { getByText, findByText } = renderWithProviders(
      <StepperFlow steps={steps} />,
    );
    act(() => {
      getByText("Intake").click();
    });
    await findByText("Intake");
  });

  it("should render Mobile stepper with clickable step", async () => {
    const { getByText, findByText } = renderWithProviders(
      <StepperFlow steps={steps} />,
    );
    act(() => {
      getByText("Proceed").click();
    });
    await findByText("Proceed");
  });

  it("should have a finish button that completes step if last step", async () => {
    // mock small screen
    useMedia.mockReturnValueOnce([true]);
    const oneStep = [
      {
        id: 0,
        name: "intake",
        label: "Intake",
        prev: undefined,
        next: undefined,
      },
    ];
    const { getByText, findByText } = renderWithProviders(
      <StepperFlow steps={oneStep} />,
    );
    act(() => {
      getByText("Finish").click();
    });
    await findByText("All steps completed - you're finished");
  });
});
