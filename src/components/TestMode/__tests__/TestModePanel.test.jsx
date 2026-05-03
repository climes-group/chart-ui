import {
  TestModeProvider,
  useDebugMode,
  useTestMode,
} from "@/context/TestModeContext";
import { setSteps } from "@/state/slices/flowReducer";
import steps from "@/steps";
import { renderWithProviders } from "@/utils/testing";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import TestModePanel from "../TestModePanel";

function renderPanel(options = {}) {
  return renderWithProviders(
    <TestModeProvider>
      <TestModePanel />
    </TestModeProvider>,
    options,
  );
}

describe("TestModePanel", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/flow/intake");
  });

  it("renders the collapsed strip when test mode is on", () => {
    renderPanel();
    const strip = screen.getByRole("button", {
      name: /open test mode panel/i,
    });
    expect(strip).toBeInTheDocument();
    expect(strip).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and closes the panel", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(
      screen.getByRole("button", { name: /open test mode panel/i }),
    );
    expect(
      screen.getByRole("button", { name: /open test mode panel/i }),
    ).toHaveAttribute("aria-expanded", "true");
    const closeBtn = screen.getByRole("button", {
      name: /close test mode panel/i,
    });
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
    expect(
      screen.getByRole("button", { name: /open test mode panel/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("persists open state to localStorage", async () => {
    const user = userEvent.setup();
    const { unmount } = renderPanel();

    await user.click(
      screen.getByRole("button", { name: /open test mode panel/i }),
    );
    expect(localStorage.getItem("CHART_TEST_PANEL_OPEN")).toBe("true");

    unmount();
    renderPanel();
    expect(
      screen.getByRole("button", { name: /open test mode panel/i }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("dispatches setTheme when a theme pill is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderPanel({
      preloadedState: { flow: { theme: 99, steps: [], conditions: {} } },
    });

    await user.click(
      screen.getByRole("button", { name: /open test mode panel/i }),
    );
    await user.click(screen.getByRole("button", { name: "1" }));
    expect(store.getState().flow.theme).toBe(1);
  });

  it("toggles debug mode reactively across consumers", async () => {
    const user = userEvent.setup();

    function DebugReader() {
      const isDebug = useDebugMode();
      return <div data-testid="debug-reader">{String(isDebug)}</div>;
    }

    renderWithProviders(
      <TestModeProvider>
        <TestModePanel />
        <DebugReader />
      </TestModeProvider>,
    );

    expect(screen.getByTestId("debug-reader")).toHaveTextContent("false");

    await user.click(
      screen.getByRole("button", { name: /open test mode panel/i }),
    );
    const toggle = screen.getByRole("switch", { name: /debug mode/i });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(localStorage.getItem("CHART_DEBUG_MODE")).toBe("true");
    expect(screen.getByTestId("debug-reader")).toHaveTextContent("true");
  });

  it("autofill unlocks every step gate and seeds required state", async () => {
    const user = userEvent.setup();
    const { store } = renderPanel();

    store.dispatch(setSteps(steps));
    expect(store.getState().flow.conditions.intake).toBe(false);
    expect(store.getState().flow.conditions.selectedSystems).toBe(false);

    await user.click(
      screen.getByRole("button", { name: /open test mode panel/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /autofill & unlock steps/i }),
    );

    const state = store.getState();
    expect(state.flow.conditions.intake).toBe(true);
    expect(state.flow.conditions.selectedSystems).toBe(true);
    expect(state.report.selectedSystems).toHaveLength(1);
    expect(state.report.selectedSystems[0]["ASTM.System.Code"]).toBe("HW-01");
    expect(state.report.intakeForm.building_permit).toBe("BP-2024-TEST-001");
    expect(state.geo.geoData).toEqual({ lat: 49.2827, lng: -123.1207 });
    expect(state.geo.humanAddress).toMatch(/123 Test Street/);
  });

  it("invokes the registered intakeFillRef on autofill", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();

    function RegisterRef() {
      const { intakeFillRef } = useTestMode();
      if (intakeFillRef) intakeFillRef.current = spy;
      return null;
    }

    renderWithProviders(
      <TestModeProvider>
        <TestModePanel />
        <RegisterRef />
      </TestModeProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: /open test mode panel/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /autofill & unlock steps/i }),
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toMatchObject({
      building_permit: "BP-2024-TEST-001",
      ea_signature: expect.stringMatching(/^data:image\/png;base64,/),
    });
  });

  it("has no axe violations when collapsed", async () => {
    const { container } = renderPanel();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when expanded", async () => {
    const { container } = renderPanel();
    await userEvent.click(
      screen.getByRole("button", { name: /open test mode panel/i }),
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
