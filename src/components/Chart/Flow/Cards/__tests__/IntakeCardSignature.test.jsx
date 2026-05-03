import { renderWithProviders } from "@/utils/testing";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import IntakeCard from "../IntakeCard";

vi.mock("react-signature-canvas", () => {
  const MockSignatureCanvas = forwardRef(function MockSignatureCanvas(
    { onEnd, canvasProps },
    ref,
  ) {
    const dataRef = useRef("");
    const [, setTick] = useState(0);
    const setData = (v) => {
      dataRef.current = v;
      setTick((t) => t + 1);
    };
    useImperativeHandle(ref, () => ({
      isEmpty: () => dataRef.current === "",
      clear: () => setData(""),
      toDataURL: () => dataRef.current || "data:image/png;base64,STUB",
      fromDataURL: (url) => setData(url || ""),
    }));
    const tid = canvasProps?.["data-testid"] ?? "sig-canvas";
    return (
      <div data-testid={tid} data-value={dataRef.current}>
        <button
          type="button"
          data-testid={`${tid}-draw`}
          onClick={() => {
            setData("data:image/png;base64,DRAWN");
            onEnd?.();
          }}
        >
          simulate-draw
        </button>
      </div>
    );
  });
  return { __esModule: true, default: MockSignatureCanvas };
});

const REQUIRED_TEXT = {
  project_address: "123 Test St",
  municipality: "Vancouver",
  postal_code: "V6B 1A1",
  unit_model_type: "Single Detached",
  total_primary_units: 1,
  ea_name: "Test EA",
  ea_number: "EA-1",
  ea_phone: "555-555-0100",
  ea_business: "Test Co.",
};

function preloadIntake(extra = {}) {
  return {
    preloadedState: {
      report: {
        reportData: null,
        reportDebugData: null,
        reportStatus: "not_generated",
        reportGenAt: null,
        reportGenTime: null,
        selectedSystems: [],
        intakeForm: {
          building_permit: "",
          project_address: "",
          municipality: "",
          postal_code: "",
          pid_legal: "",
          unit_model_type: "",
          total_primary_units: "",
          total_secondary_suites: "",
          building_plan_date: "",
          building_plan_author: "",
          building_plan_version: "",
          modelling_standard: [],
          modelling_standard_other: "",
          heated_floor_area: "",
          number_of_floors: "",
          electricity_use: "",
          fossil_fuel_use: "",
          meui: "",
          tedi: "",
          ghgi: "",
          ea_name: "",
          ea_number: "",
          ea_phone: "",
          ea_business: "",
          so_company_name: "",
          builder_name: "",
          builder_phone: "",
          ea_signature_date: "",
          builder_signature_date: "",
          ea_signature: "",
          builder_signature: "",
          ...extra,
        },
      },
    },
  };
}

describe("IntakeCard signature pads", () => {
  it("renders both signature pads with their date inputs and clear buttons", () => {
    renderWithProviders(
      <IntakeCard registerNext={vi.fn()} nav={vi.fn()} />,
      preloadIntake(),
    );

    expect(screen.getByTestId("ea-sig-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("builder-sig-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("ea-sig-canvas-clear")).toBeInTheDocument();
    expect(screen.getByTestId("builder-sig-canvas-clear")).toBeInTheDocument();
    expect(screen.getByTestId("ea-sig-canvas-date")).toHaveValue("");
    expect(screen.getByTestId("builder-sig-canvas-date")).toHaveValue("");
  });

  it("auto-fills the EA date when the EA signature is drawn", async () => {
    renderWithProviders(
      <IntakeCard registerNext={vi.fn()} nav={vi.fn()} />,
      preloadIntake(),
    );

    const today = new Date().toISOString().slice(0, 10);
    await userEvent.click(screen.getByTestId("ea-sig-canvas-draw"));

    expect(screen.getByTestId("ea-sig-canvas-date")).toHaveValue(today);
    expect(screen.getByTestId("builder-sig-canvas-date")).toHaveValue("");
  });

  it("does not overwrite a manually-entered EA date", async () => {
    renderWithProviders(
      <IntakeCard registerNext={vi.fn()} nav={vi.fn()} />,
      preloadIntake(),
    );

    const dateInput = screen.getByTestId("ea-sig-canvas-date");
    await userEvent.type(dateInput, "2025-01-15");
    expect(dateInput).toHaveValue("2025-01-15");

    await userEvent.click(screen.getByTestId("ea-sig-canvas-draw"));

    expect(dateInput).toHaveValue("2025-01-15");
  });

  it("clearing the EA signature clears its date and shows the required error", async () => {
    renderWithProviders(
      <IntakeCard registerNext={vi.fn()} nav={vi.fn()} />,
      preloadIntake(),
    );

    await userEvent.click(screen.getByTestId("ea-sig-canvas-draw"));
    expect(screen.getByTestId("ea-sig-canvas-date")).not.toHaveValue("");

    await userEvent.click(screen.getByTestId("ea-sig-canvas-clear"));

    expect(screen.getByTestId("ea-sig-canvas-date")).toHaveValue("");
    expect(screen.getByTestId("ea-sig-canvas-error")).toHaveTextContent(
      "Signature required",
    );
  });

  it("blocks proceed when signatures are missing", async () => {
    let nextFn;
    const registerNext = (fn) => {
      nextFn = fn;
    };
    const nav = vi.fn();
    const activeStep = { errorMessage: "Please complete the intake form." };

    const { store } = renderWithProviders(
      <IntakeCard
        activeStep={activeStep}
        registerNext={registerNext}
        nav={nav}
      />,
      preloadIntake(REQUIRED_TEXT),
    );

    await act(async () => {
      await nextFn();
    });

    expect(nav).not.toHaveBeenCalled();
    expect(store.getState().flow.error).toBe(
      "Please complete the intake form.",
    );
    await waitFor(() => {
      expect(screen.getByTestId("ea-sig-canvas-error")).toHaveTextContent(
        "Signature required",
      );
      expect(screen.getByTestId("builder-sig-canvas-error")).toHaveTextContent(
        "Signature required",
      );
    });
  });

  it("allows proceed once both signatures are drawn", async () => {
    let nextFn;
    const registerNext = (fn) => {
      nextFn = fn;
    };
    const nav = vi.fn();
    const activeStep = { errorMessage: "Please complete the intake form." };

    const { store } = renderWithProviders(
      <IntakeCard
        activeStep={activeStep}
        registerNext={registerNext}
        nav={nav}
      />,
      preloadIntake(REQUIRED_TEXT),
    );

    await userEvent.click(screen.getByTestId("ea-sig-canvas-draw"));
    await userEvent.click(screen.getByTestId("builder-sig-canvas-draw"));

    await act(async () => {
      await nextFn();
    });

    expect(nav).toHaveBeenCalledTimes(1);
    const intake = store.getState().report.intakeForm;
    expect(intake.ea_signature).toMatch(/^data:image\/png;base64,/);
    expect(intake.builder_signature).toMatch(/^data:image\/png;base64,/);
  });

  it("restores a persisted signature into the canvas on remount", () => {
    const SAVED = "data:image/png;base64,SAVED";
    renderWithProviders(
      <IntakeCard registerNext={vi.fn()} nav={vi.fn()} />,
      preloadIntake({ ea_signature: SAVED }),
    );

    expect(screen.getByTestId("ea-sig-canvas")).toHaveAttribute(
      "data-value",
      SAVED,
    );
    expect(screen.getByTestId("builder-sig-canvas")).toHaveAttribute(
      "data-value",
      "",
    );
  });

  it("the card-level Clear button wipes both canvases and dates", async () => {
    renderWithProviders(
      <IntakeCard registerNext={vi.fn()} nav={vi.fn()} />,
      preloadIntake(),
    );

    await userEvent.click(screen.getByTestId("ea-sig-canvas-draw"));
    await userEvent.click(screen.getByTestId("builder-sig-canvas-draw"));
    expect(screen.getByTestId("ea-sig-canvas")).toHaveAttribute(
      "data-value",
      "data:image/png;base64,DRAWN",
    );

    await userEvent.click(screen.getByRole("button", { name: "Clear" }));

    await waitFor(() => {
      expect(screen.getByTestId("ea-sig-canvas")).toHaveAttribute(
        "data-value",
        "",
      );
      expect(screen.getByTestId("builder-sig-canvas")).toHaveAttribute(
        "data-value",
        "",
      );
    });
    expect(screen.getByTestId("ea-sig-canvas-date")).toHaveValue("");
    expect(screen.getByTestId("builder-sig-canvas-date")).toHaveValue("");
  });
});
