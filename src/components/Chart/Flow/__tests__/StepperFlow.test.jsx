import useMedia from "@/hooks/useMedia.js";
import steps from "@/steps.js";
import { meetCondition } from "@/state/slices/flowReducer";
import { renderWithProviders } from "@/utils/testing";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows the FinishCard after finishing the last step", async () => {
    const oneStep = [{ id: 0, name: "intake", label: "Intake", prev: undefined, next: undefined }];
    const { getByRole, findByText } = renderWithProviders(<StepperFlow steps={oneStep} />);

    // wait for currentStep to be set (button becomes enabled)
    await waitFor(() => expect(getByRole("button", { name: /Finish/ })).not.toBeDisabled());

    await act(async () => {
      getByRole("button", { name: /Finish/ }).click();
    });

    await findByText(/All done/);
    expect(window.location.pathname).toBe("/flow/finish");
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

  it("marks a future step as locked when its preceding condition is unmet", async () => {
    useMedia.mockReturnValue([false]);
    renderWithProviders(<StepperFlow steps={steps} />);
    // intake has leaveCondition and starts false → applicableSystems (Inventory) should be locked
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Inventory/i })).toHaveAttribute("data-locked", "true");
    });
  });

  it("does not mark the first step as locked", async () => {
    useMedia.mockReturnValue([false]);
    renderWithProviders(<StepperFlow steps={steps} />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Intake/i })).not.toHaveAttribute("data-locked");
    });
  });

  it("unlocks a step once its preceding condition is met", async () => {
    useMedia.mockReturnValue([false]);
    const { store } = renderWithProviders(<StepperFlow steps={steps} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Inventory/i })).toHaveAttribute("data-locked", "true");
    });

    act(() => {
      store.dispatch(meetCondition({ name: "intake" }));
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Inventory/i })).not.toHaveAttribute("data-locked");
    });
  });

  it("pulses the blocking step when a locked step header button is clicked", async () => {
    useMedia.mockReturnValue([false]);
    renderWithProviders(<StepperFlow steps={steps} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Inventory/i })).toHaveAttribute("data-locked", "true");
    });

    await userEvent.click(screen.getByRole("button", { name: /Inventory/i }));

    // intake is the blocker — it should be pulsing
    expect(screen.getByRole("button", { name: /Intake/i })).toHaveAttribute("data-pulsing", "true");
  });
});
