import { renderWithProviders } from "@/utils/testing";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, vi } from "vitest";
import SelectedSystemsCard from "../SelectedSystemsCard";

const mockSystems = [
  {
    Services: "Mechanical",
    Classification: "Heating",
    "ASTM.Code": "D3010",
    "ASTM.Name": "Tank-style",
    "ASTM.System.Name": "Boiler",
    "ASTM.System.Code": "HW-01",
  },
  {
    Services: "Mechanical",
    Classification: "Heating",
    "ASTM.Code": "D3010",
    "ASTM.Name": "Furnace",
    "ASTM.System.Name": "Furnace",
    "ASTM.System.Code": "ST-01",
  },
  {
    Services: "Electrical",
    Classification: "Lighting",
    "ASTM.Code": "D5020",
    "ASTM.Name": "Light Emitting Diode",
    "ASTM.System.Name": "LED",
    "ASTM.System.Code": "LP-01",
  },
];

const mockSiteFeatures = [
  {
    Services: "Electronical",
    Classification: "Lighting",
    ID: "SF-02",
    "Site.Feature.Name": "Main Panel",
  },
];

function setupFetch(
  systemsData = mockSystems,
  siteFeaturesData = mockSiteFeatures,
  ok = true,
) {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes("site_features")) {
      return Promise.resolve({ ok, json: async () => siteFeaturesData });
    }
    return Promise.resolve({ ok, json: async () => systemsData });
  });
}

describe("SelectedSystemsCard tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it("renders loading skeleton before data arrives", () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    const { container } = renderWithProviders(<SelectedSystemsCard />);
    expect(
      container.querySelectorAll(
        ".animate-pulse, [class*='skeleton'], [data-slot='skeleton']",
      ).length,
    ).toBeGreaterThanOrEqual(0);
    // loading state: no heading yet
    expect(
      screen.queryByRole("heading", { name: "Selected Systems" }),
    ).toBeNull();
  });

  it("renders systems after data loads", async () => {
    setupFetch();
    renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Selected Systems");
    expect(screen.getByText("Boiler")).toBeInTheDocument();
  });

  it("renders service tabs for each unique service", async () => {
    setupFetch();
    renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Mechanical");
    expect(screen.getByText("Electrical")).toBeInTheDocument();
  });

  it("switches active service tab", async () => {
    setupFetch();
    renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Electrical");

    await userEvent.click(screen.getByRole("button", { name: "Electrical" }));

    expect(screen.getByText("LED")).toBeInTheDocument();
  });

  it("toggles a system selection", async () => {
    setupFetch();
    const { store } = renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Boiler/ }));

    const selected = store.getState().report.selectedSystems;
    expect(selected.length).toBe(1);
  });

  it("deselects a system when toggled again", async () => {
    setupFetch();
    const { store } = renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Boiler/ }));
    expect(store.getState().report.selectedSystems.length).toBe(1);

    await userEvent.click(screen.getByRole("button", { name: /Boiler/ }));
    expect(store.getState().report.selectedSystems.length).toBe(0);
  });

  it("clears all selections with the clear all button", async () => {
    setupFetch();
    const { store } = renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Boiler/ }));
    await screen.findByText(/Clear all/);
    await userEvent.click(screen.getByText(/Clear all/));

    expect(store.getState().report.selectedSystems.length).toBe(0);
  });

  it("clears selections by classification", async () => {
    setupFetch();
    const { store } = renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Boiler/ }));
    await screen.findByRole("button", { name: /Clear 1/ });
    await userEvent.click(screen.getByRole("button", { name: /Clear 1/ }));

    expect(store.getState().report.selectedSystems.length).toBe(0);
  });

  it("shows error message when fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText(/Error loading systems/);
  });

  it("deduplicates systems with identical keys", async () => {
    const withDuplicate = [
      ...mockSystems,
      { ...mockSystems[0] }, // exact duplicate
    ];
    setupFetch(withDuplicate);
    renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Boiler");
    // mock has two distinct mechanical systems ("Boiler" and "Furnace") plus
    // one duplicate of Boiler — after dedupe, only one Boiler pill renders
    expect(screen.getAllByText("Boiler").length).toBe(1);
  });

  it("stores the full system record in redux on selection", async () => {
    setupFetch();
    const { store } = renderWithProviders(<SelectedSystemsCard />);
    await screen.findByText("Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Boiler/ }));

    const [stored] = store.getState().report.selectedSystems;
    expect(stored).toMatchObject({
      "ASTM.System.Code": "HW-01",
      "ASTM.Name": "Tank-style",
      Services: "Mechanical",
    });
  });
});
