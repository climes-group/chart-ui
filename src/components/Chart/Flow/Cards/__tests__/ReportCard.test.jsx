import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import {
  addSelectedFeature,
  addSelectedSystem,
  setIntakeForm,
} from "@/state/slices/reportReducer";
import { renderWithProviders } from "@/utils/testing";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, vi } from "vitest";
import ReportCard from "../ReportCard";

describe("ReportCard tests", () => {
  it("renders the heading", () => {
    renderWithProviders(<ReportCard />);
    expect(screen.getByText("Report")).toBeInTheDocument();
  });

  it("renders the address, system count, site feature count, and modelling standard in the context strip", async () => {
    const { store } = renderWithProviders(<ReportCard />);
    await act(async () => {
      store.dispatch(setHumanAddress("123 Main St, Vancouver"));
      store.dispatch(addSelectedSystem({ "ASTM.System.Code": "sys-1" }));
      store.dispatch(addSelectedSystem({ "ASTM.System.Code": "sys-2" }));
      store.dispatch(addSelectedFeature({ ID: "feat-1" }));
      store.dispatch(setIntakeForm({ modelling_standard: ["EnerGuide"] }));
    });
    expect(screen.getByText("123 Main St, Vancouver")).toBeInTheDocument();
    expect(
      screen.getByText(/2 systems.*1 site feature.*EnerGuide/),
    ).toBeInTheDocument();
  });

  it("renders MEUI / TEDI / GHGI from intakeForm", async () => {
    const { store } = renderWithProviders(<ReportCard />);
    await act(async () => {
      store.dispatch(setIntakeForm({ meui: 60, tedi: 40, ghgi: 5 }));
    });
    expect(screen.getByText(/MEUI 60/)).toBeInTheDocument();
    expect(screen.getByText(/TEDI 40/)).toBeInTheDocument();
    expect(screen.getByText(/GHGI 5/)).toBeInTheDocument();
  });

  it("shows a warning when no location is set", () => {
    renderWithProviders(<ReportCard />);
    expect(
      screen.getByText(/No location set — generation may fail/),
    ).toBeInTheDocument();
  });

  it("renders an edit link back to /flow/summary", () => {
    renderWithProviders(<ReportCard />);
    const link = screen.getByRole("link", { name: /edit the summary/i });
    expect(link).toHaveAttribute("href", "/flow/summary");
  });

  it("shows generating state while report is being created", () => {
    renderWithProviders(<ReportCard />, {
      preloadedState: {
        report: {
          selectedSystems: [],
          intakeForm: {},
          reportStatus: "generating",
          reportData: null,
          reportGenAt: null,
          reportGenTime: null,
        },
      },
    });
    expect(screen.getByText(/Building your report/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generating/ })).toBeDisabled();
  });

  it("shows generated state with download button after success", () => {
    renderWithProviders(<ReportCard />, {
      preloadedState: {
        report: {
          selectedSystems: [],
          intakeForm: {},
          reportStatus: "generated",
          reportData: "base64data==",
          reportGenAt: "12:00:00 PM",
          reportGenTime: 3200,
        },
      },
    });
    expect(screen.getByText("Report ready")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Download PDF/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Generated at 12:00:00 PM/)).toBeInTheDocument();
  });

  it("shows regenerate button in generated state", () => {
    renderWithProviders(<ReportCard />, {
      preloadedState: {
        report: {
          selectedSystems: [],
          intakeForm: {},
          reportStatus: "generated",
          reportData: "base64data==",
          reportGenAt: null,
          reportGenTime: null,
        },
      },
    });
    expect(
      screen.getByRole("button", { name: /Regenerate/ }),
    ).toBeInTheDocument();
  });

  it("shows error state with retry button", () => {
    renderWithProviders(<ReportCard />, {
      preloadedState: {
        report: {
          selectedSystems: [],
          intakeForm: {},
          reportStatus: "error",
          reportData: null,
          reportGenAt: null,
          reportGenTime: null,
        },
      },
    });
    expect(screen.getByText("Report generation failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry/ })).toBeInTheDocument();
  });

  it("transitions to generating state on Generate Report click", async () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves

    const { store } = renderWithProviders(<ReportCard />);
    await act(async () => {
      store.dispatch(setGeoData({ lat: 49.28, lng: -123.12 }));
    });

    await userEvent.click(
      screen.getByRole("button", { name: /Generate Report/ }),
    );

    expect(screen.getByText(/Building your report/)).toBeInTheDocument();
  });

  it("transitions back to not_generated when Regenerate is clicked", async () => {
    renderWithProviders(<ReportCard />, {
      preloadedState: {
        report: {
          selectedSystems: [],
          intakeForm: {},
          reportStatus: "generated",
          reportData: "base64data==",
          reportGenAt: "12:00:00 PM",
          reportGenTime: 1000,
        },
      },
    });

    await userEvent.click(screen.getByRole("button", { name: /Regenerate/ }));

    expect(
      screen.getByRole("link", { name: /edit the summary/i }),
    ).toBeInTheDocument();
  });

  it("has no axe violations in the not_generated state", async () => {
    const { container } = renderWithProviders(<ReportCard />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in the generating state", async () => {
    const { container } = renderWithProviders(<ReportCard />, {
      preloadedState: {
        report: {
          selectedSystems: [],
          intakeForm: {},
          reportStatus: "generating",
          reportData: null,
          reportGenAt: null,
          reportGenTime: null,
        },
      },
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in the generated state", async () => {
    const { container } = renderWithProviders(<ReportCard />, {
      preloadedState: {
        report: {
          selectedSystems: [],
          intakeForm: {},
          reportStatus: "generated",
          reportData: "base64data==",
          reportGenAt: "12:00:00 PM",
          reportGenTime: 3200,
        },
      },
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in the error state", async () => {
    const { container } = renderWithProviders(<ReportCard />, {
      preloadedState: {
        report: {
          selectedSystems: [],
          intakeForm: {},
          reportStatus: "error",
          reportData: null,
          reportGenAt: null,
          reportGenTime: null,
        },
      },
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
