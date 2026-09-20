import {
  TestModeProvider,
  useDebugMode,
  useTestMode,
} from "@/components/TestMode/TestModeContext";
import { setSteps } from "@/state/slices/flowReducer";
import steps from "@/steps";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { renderWithProviders } from "@/utils/testing";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import DebugBanner from "../DebugBanner";

function renderPanel(options = {}) {
  return renderWithProviders(
    <ThemeProvider>
      <TestModeProvider>
        <DebugBanner />
      </TestModeProvider>
    </ThemeProvider>,
    options,
  );
}

describe("DebugBanner", () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.history.pushState({}, "", "/flow/intake");
  });

  it("renders the collapsed strip when test mode is on", () => {
    renderPanel();
    const strip = screen.getByRole("button", {
      name: /toggle debug banner/i,
    });
    expect(strip).toBeInTheDocument();
    expect(strip).toHaveAttribute("aria-expanded", "false");
    expect(strip).toHaveAttribute("title", "Test mode");
    expect(strip).toHaveClass("h-10", "w-10");
    expect(strip).not.toHaveTextContent("Debug Banner");
  });

  it("opens and closes the panel", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );
    expect(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    ).toHaveAttribute("aria-expanded", "true");
    const toggle = screen.getByRole("button", {
      name: /toggle debug banner/i,
    });
    expect(toggle.querySelector(".lucide-x")).toBeInTheDocument();

    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("uses semantic surfaces and content colors for both themes", async () => {
    const user = userEvent.setup();
    const { container } = renderPanel();

    await user.click(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );

    const panel = container.querySelector("div.w-max");
    expect(panel).toHaveClass(
      "bg-gray-600/50",
      "text-white",
      "rounded-md",
      "backdrop-blur-sm",
    );
    expect(
      screen.getByRole("switch", { name: /debug mode: off/i }),
    ).toHaveAttribute("title", "Toggle debug mode (currently off)");
  });

  it("persists open state to localStorage", async () => {
    const user = userEvent.setup();
    const { unmount } = renderPanel();

    await user.click(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );
    expect(localStorage.getItem("CHART_TEST_PANEL_OPEN")).toBe("true");

    unmount();
    renderPanel();
    expect(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles debug mode reactively across consumers", async () => {
    const user = userEvent.setup();

    function DebugReader() {
      const isDebug = useDebugMode();
      return <div data-testid="debug-reader">{String(isDebug)}</div>;
    }

    renderWithProviders(
      <ThemeProvider>
        <TestModeProvider>
          <DebugBanner />
          <DebugReader />
        </TestModeProvider>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("debug-reader")).toHaveTextContent("false");

    await user.click(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );
    const toggle = screen.getByRole("switch", { name: /debug mode/i });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(localStorage.getItem("CHART_DEBUG_MODE")).toBe("true");
    expect(screen.getByTestId("debug-reader")).toHaveTextContent("true");
    expect(toggle).toHaveAttribute(
      "title",
      "Toggle debug mode (currently on)",
    );
  });

  it("selects a color theme and persists it", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );
    const cyberpunk = screen.getByRole("button", { name: "cyberpunk" });
    expect(cyberpunk).toHaveAttribute("aria-pressed", "false");

    await user.click(cyberpunk);

    expect(cyberpunk).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("chart-ui-theme")).toBe("cyberpunk");
    expect(document.documentElement).toHaveAttribute(
      "data-color-theme",
      "cyberpunk",
    );

    const light = screen.getByRole("button", { name: "light" });
    await user.click(light);

    expect(light).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("chart-ui-theme")).toBe("light");
    expect(document.documentElement).toHaveAttribute(
      "data-color-theme",
      "light",
    );
  });

  it("autofill unlocks every step gate and seeds required state", async () => {
    const user = userEvent.setup();
    const { store } = renderPanel();

    store.dispatch(setSteps(steps));
    expect(store.getState().flow.conditions.intake).toBe(false);
    expect(store.getState().flow.conditions.systems).toBe(false);

    await user.click(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );
    await user.click(screen.getByRole("button", { name: /autofill/i }));

    const state = store.getState();
    expect(state.report.intakeForm.building_permit).toBe("BP-2024-TEST-001");
    expect(state.geo.geoData).toEqual({ lat: 43.6532, lng: -79.3832 });
    expect(state.geo.humanAddress).toMatch(
      /100 Queen St W, Toronto, ON M5H 2N2, Canada/,
    );
  });

  it("autofill prefers a saved snapshot over the canned defaults", async () => {
    const user = userEvent.setup();
    const SNAPSHOT = {
      version: 1,
      savedAt: new Date().toISOString(),
      intakeForm: { building_permit: "BP-FROM-SNAP", ea_name: "Snap EA" },
      selectedSystems: [{ "ASTM.System.Code": "SNAP-SYS-1" }],
      selectedSiteFeatures: [{ ID: "SNAP-FEAT-1" }],
      geoData: { lat: 1.23, lng: 4.56 },
      humanAddress: "1 Snapshot Lane",
    };
    localStorage.setItem("CHART_FORM_SNAPSHOT", JSON.stringify(SNAPSHOT));

    const { store } = renderPanel();

    await user.click(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );
    const autofillBtn = screen.getByRole("button", {
      name: /autofill from snapshot/i,
    });
    await user.click(autofillBtn);

    const state = store.getState();
    expect(state.report.intakeForm.building_permit).toBe("BP-FROM-SNAP");
    expect(state.report.intakeForm.ea_name).toBe("Snap EA");
    expect(state.geo.geoData).toEqual({ lat: 1.23, lng: 4.56 });
    expect(state.geo.humanAddress).toBe("1 Snapshot Lane");
  });

  it("invokes the registered intakeFillRef on autofill", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();

    function RegisterRef() {
      const { intakeFillRef } = useTestMode();
      useEffect(() => {
        if (intakeFillRef) intakeFillRef.current = spy;
      }, [intakeFillRef]);
      return null;
    }

    renderWithProviders(
      <ThemeProvider>
        <TestModeProvider>
          <DebugBanner />
          <RegisterRef />
        </TestModeProvider>
      </ThemeProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );
    await user.click(screen.getByRole("button", { name: /autofill/i }));

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
      screen.getByRole("button", { name: /toggle debug banner/i }),
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
