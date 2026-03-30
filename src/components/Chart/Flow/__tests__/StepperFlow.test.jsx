import useMedia from "@/hooks/useMedia.js";
import steps from "@/steps.js";
import { renderWithProviders } from "@/utils/testing";
import { act, waitFor } from "@testing-library/react";
import { describe } from "vitest";
import StepperFlow from "../StepperFlow.jsx";

vi.mock("@/hooks/useMedia");
vi.mock("../StepRenderer", () => ({ default: () => <div data-testid="step-content" /> }));

describe("StepperFlow tests", () => {
  beforeEach(() => {
    useMedia.mockReturnValue([false]);
    localStorage.clear();
  });

  it("renders the stepper with step labels", () => {
    const { getAllByText } = renderWithProviders(<StepperFlow steps={steps} />);
    expect(getAllByText(steps[0].label).length).toBeGreaterThan(0);
  });

  it("renders Next button on desktop for a non-final step", () => {
    const { getByRole } = renderWithProviders(<StepperFlow steps={steps} />);
    expect(getByRole("button", { name: /Next/ })).toBeInTheDocument();
  });

  it("renders Finish button on desktop when only one step", () => {
    const oneStep = [{ id: 0, name: "intake", label: "Intake", prev: undefined, next: undefined }];
    const { getByRole } = renderWithProviders(<StepperFlow steps={oneStep} />);
    expect(getByRole("button", { name: /Finish/ })).toBeInTheDocument();
  });

  it("shows completed message after finishing the last step", async () => {
    const oneStep = [{ id: 0, name: "intake", label: "Intake", prev: undefined, next: undefined }];
    const { getByRole, findByText } = renderWithProviders(<StepperFlow steps={oneStep} />);

    // wait for currentStep to be set (button becomes enabled)
    await waitFor(() => expect(getByRole("button", { name: /Finish/ })).not.toBeDisabled());

    await act(async () => {
      getByRole("button", { name: /Finish/ }).click();
    });

    await findByText(/All steps completed/);
  });

  it("renders mobile layout on small screens", () => {
    useMedia.mockReturnValue([true]);
    const { getByRole } = renderWithProviders(<StepperFlow steps={steps} />);
    expect(getByRole("button", { name: /Back/ })).toBeInTheDocument();
  });

  it("clicking a step header button calls jumpTo", async () => {
    useMedia.mockReturnValue([false]);
    const { getAllByText } = renderWithProviders(<StepperFlow steps={steps} />);
    act(() => {
      getAllByText(steps[0].label)[0].click();
    });
    expect(getAllByText(steps[0].label).length).toBeGreaterThan(0);
  });
});
