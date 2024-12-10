import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { describe } from "vitest";
import useMedia from "../../../../hooks/useMedia.js";
import { store } from "../../../../state/store.js";
import steps from "../../../../steps.js";
import StepperFlow from "../StepperFlow.jsx";

vi.mock("../../../../hooks/useFlow", { spy: true });
vi.mock("../../../../hooks/useMedia");

describe("StepperFlow tests", () => {
  beforeEach(() => {
    useMedia.mockReturnValue([false]);
  });

  it("should render Desktop stepper with clickable step", async () => {
    const { getByText, findByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <StepperFlow steps={steps} />
        </MemoryRouter>
      </Provider>,
    );
    act(() => {
      getByText("Intake").click();
    });
    await findByText("Intake");
  });

  it("should render Mobile stepper with clickable step", async () => {
    const { getByText, findByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <StepperFlow steps={steps} />
        </MemoryRouter>
      </Provider>,
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
    const { getByText, findByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <StepperFlow steps={oneStep} />
        </MemoryRouter>
      </Provider>,
    );
    act(() => {
      getByText("Finish").click();
    });
    await findByText("All steps completed - you're finished");
  });
});
