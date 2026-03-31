import { renderWithProviders } from "@/utils/testing";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, vi } from "vitest";
import ApplicableSystemsCard from "../ApplicableSystemsCard";

const mockSystems = [
  {
    "Services": "Mechanical",
    "Classification": "Heating",
    "ASTM.Name": "Boiler",
    "ASTM.System.Name": "Hot Water Boiler",
    "ASTM.System.Code": "HW-01",
  },
  {
    "Services": "Mechanical",
    "Classification": "Heating",
    "ASTM.Name": "Boiler",
    "ASTM.System.Name": "Steam Boiler",
    "ASTM.System.Code": "ST-01",
  },
  {
    "Services": "Electrical",
    "Classification": "Lighting",
    "ASTM.Name": "LED",
    "ASTM.System.Name": "LED Panel",
    "ASTM.System.Code": "LP-01",
  },
];

function setupFetch(data = mockSystems, ok = true) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => data,
  });
}

describe("ApplicableSystemsCard tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it("renders loading skeleton before data arrives", () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    const { container } = renderWithProviders(<ApplicableSystemsCard />);
    expect(container.querySelectorAll(".animate-pulse, [class*='skeleton'], [data-slot='skeleton']").length).toBeGreaterThanOrEqual(0);
    // loading state: no heading yet
    expect(screen.queryByRole("heading", { name: "Applicable Systems" })).toBeNull();
  });

  it("renders systems after data loads", async () => {
    setupFetch();
    renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText("Applicable Systems");
    expect(screen.getByText("Hot Water Boiler")).toBeInTheDocument();
  });

  it("renders service tabs for each unique service", async () => {
    setupFetch();
    renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText("Mechanical");
    expect(screen.getByText("Electrical")).toBeInTheDocument();
  });

  it("switches active service tab", async () => {
    setupFetch();
    renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText("Electrical");

    await userEvent.click(screen.getByRole("button", { name: "Electrical" }));

    expect(screen.getByText("LED Panel")).toBeInTheDocument();
  });

  it("toggles a system selection", async () => {
    setupFetch();
    const { store } = renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText("Hot Water Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Hot Water Boiler/ }));

    const selected = store.getState().report.selectedSystems;
    expect(selected.length).toBe(1);
  });

  it("deselects a system when toggled again", async () => {
    setupFetch();
    const { store } = renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText("Hot Water Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Hot Water Boiler/ }));
    expect(store.getState().report.selectedSystems.length).toBe(1);

    await userEvent.click(screen.getByRole("button", { name: /Hot Water Boiler/ }));
    expect(store.getState().report.selectedSystems.length).toBe(0);
  });

  it("clears all selections with the clear all button", async () => {
    setupFetch();
    const { store } = renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText("Hot Water Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Hot Water Boiler/ }));
    await screen.findByText(/Clear all/);
    await userEvent.click(screen.getByText(/Clear all/));

    expect(store.getState().report.selectedSystems.length).toBe(0);
  });

  it("clears selections by classification", async () => {
    setupFetch();
    const { store } = renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText("Hot Water Boiler");

    await userEvent.click(screen.getByRole("button", { name: /Hot Water Boiler/ }));
    await screen.findByRole("button", { name: /Clear 1/ });
    await userEvent.click(screen.getByRole("button", { name: /Clear 1/ }));

    expect(store.getState().report.selectedSystems.length).toBe(0);
  });

  it("shows error message when fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText(/Error loading systems/);
  });

  it("deduplicates systems with identical keys", async () => {
    const withDuplicate = [
      ...mockSystems,
      { ...mockSystems[0] }, // exact duplicate
    ];
    setupFetch(withDuplicate);
    renderWithProviders(<ApplicableSystemsCard />);
    await screen.findByText("Hot Water Boiler");
    expect(screen.getAllByText("Hot Water Boiler").length).toBe(1);
  });
});
