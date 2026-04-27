import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { addSelectedSystem } from "@/state/slices/reportReducer";
import { renderWithProviders } from "@/utils/testing";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, vi } from "vitest";
import ReportCard from "../ReportCard";

describe("ReportCard tests", () => {
  it("renders the heading", () => {
    renderWithProviders(<ReportCard />);
    expect(screen.getByText("Report")).toBeInTheDocument();
  });

  it("renders the pre-flight checklist in not_generated state", () => {
    renderWithProviders(<ReportCard />);
    expect(screen.getByText("Checklist")).toBeInTheDocument();
    expect(screen.getByText("Site location selected")).toBeInTheDocument();
    expect(screen.getByText("Systems selected")).toBeInTheDocument();
    expect(screen.getByText("Intake form filled")).toBeInTheDocument();
  });

  it("shows location detail in checklist when geo data is set", async () => {
    const { store } = renderWithProviders(<ReportCard />);
    await act(async () => {
      store.dispatch(setGeoData({ lat: 49.28, lng: -123.12 }));
      store.dispatch(setHumanAddress("123 Main St"));
    });
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
  });

  it("shows selected system count in checklist", async () => {
    const { store } = renderWithProviders(<ReportCard />);
    await act(async () => {
      store.dispatch(addSelectedSystem({ "ASTM.System.Code": "sys-1" }));
      store.dispatch(addSelectedSystem({ "ASTM.System.Code": "sys-2" }));
    });
    expect(screen.getByText(/2 systems/)).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: /Download PDF/ })).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: /Regenerate/ })).toBeInTheDocument();
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

    await userEvent.click(screen.getByRole("button", { name: /Generate Report/ }));

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

    expect(screen.getByText("Checklist")).toBeInTheDocument();
  });
});
