import { render } from "@testing-library/react";
import { describe } from "vitest";
import useFlow from "../../../../hooks/useFlow";
import StepperFlow from "../StepperFlow";

vi.mock("../../../../hooks/useFlow");

describe("StepperFlow tests", () => {
  it("should render Desktop stepper with clickable step", () => {
    const mockUseFlow = {
      next: vi.fn(),
      back: vi.fn(),
      done: vi.fn(),
      jumpTo: vi.fn(),
    };
    useFlow.mockReturnValue(mockUseFlow);
    const { getByText } = render(<StepperFlow />);
    getByText("Intake").click();

    expect(mockUseFlow.jumpTo).toHaveBeenCalledWith(0);
  });
});
