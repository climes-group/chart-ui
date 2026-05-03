import { setIntakeForm } from "@/state/slices/reportReducer";
import { renderWithProviders } from "@/utils/testing";
import { act, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe } from "vitest";
import SummaryCard from "../SummaryCard";

function getProjectInformationCard() {
  const heading = screen.getByRole("heading", { name: "Project Information" });
  // The h3 sits inside a SectionHeader div; the outer card is its grandparent.
  return heading.closest("div").parentElement;
}

describe("SummaryCard — Project Information", () => {
  it("renders the empty state when no intake data is present", () => {
    renderWithProviders(<SummaryCard />);
    const card = getProjectInformationCard();
    expect(
      within(card).getByText("No project information entered."),
    ).toBeInTheDocument();
  });

  it("renders building type and unit counts as a headline", async () => {
    const { store } = renderWithProviders(<SummaryCard />);
    await act(async () => {
      store.dispatch(
        setIntakeForm({
          unit_model_type: "Single Detached w/Secondary Suite",
          total_primary_units: "1",
          total_secondary_suites: "1",
        }),
      );
    });
    const card = getProjectInformationCard();
    expect(
      within(card).getByText(
        "Single Detached w/Secondary Suite — 1 primary unit + 1 secondary suite",
      ),
    ).toBeInTheDocument();
  });

  it("pluralizes unit counts", async () => {
    const { store } = renderWithProviders(<SummaryCard />);
    await act(async () => {
      store.dispatch(
        setIntakeForm({
          unit_model_type: "Row House (non-MURB)",
          total_primary_units: "4",
          total_secondary_suites: "0",
        }),
      );
    });
    const card = getProjectInformationCard();
    expect(
      within(card).getByText("Row House (non-MURB) — 4 primary units"),
    ).toBeInTheDocument();
    expect(within(card).queryByText(/secondary suite/)).toBeNull();
  });

  it("renders modelling standards as pills", async () => {
    const { store } = renderWithProviders(<SummaryCard />);
    await act(async () => {
      store.dispatch(
        setIntakeForm({
          modelling_standard: ["EnerGuide", "CHBA Net-Zero"],
        }),
      );
    });
    const card = getProjectInformationCard();
    expect(within(card).getByText("Modelling Standard")).toBeInTheDocument();
    expect(within(card).getByText("EnerGuide")).toBeInTheDocument();
    expect(within(card).getByText("CHBA Net-Zero")).toBeInTheDocument();
  });

  it("substitutes the custom name when 'Other' is selected and specified", async () => {
    const { store } = renderWithProviders(<SummaryCard />);
    await act(async () => {
      store.dispatch(
        setIntakeForm({
          modelling_standard: ["EnerGuide", "Other"],
          modelling_standard_other: "BC Energy Step Code 5",
        }),
      );
    });
    const card = getProjectInformationCard();
    expect(within(card).getByText("EnerGuide")).toBeInTheDocument();
    expect(within(card).getByText("BC Energy Step Code 5")).toBeInTheDocument();
    expect(within(card).queryByText("Other")).toBeNull();
  });

  it("renders the plan reference, permit and PID lines when set", async () => {
    const { store } = renderWithProviders(<SummaryCard />);
    await act(async () => {
      store.dispatch(
        setIntakeForm({
          building_plan_version: "v1.0",
          building_plan_date: "2026-01-15",
          building_plan_author: "J. Smith",
          building_permit: "BP-2026-0042",
          pid_legal: "012-345-678",
        }),
      );
    });
    const card = getProjectInformationCard();
    expect(
      within(card).getByText("Plan v1.0 · 2026-01-15 · J. Smith"),
    ).toBeInTheDocument();
    expect(within(card).getByText("Permit #BP-2026-0042")).toBeInTheDocument();
    expect(within(card).getByText("PID: 012-345-678")).toBeInTheDocument();
  });

  it("renders only the tiers that have data", async () => {
    const { store } = renderWithProviders(<SummaryCard />);
    await act(async () => {
      store.dispatch(
        setIntakeForm({
          modelling_standard: ["Passive House"],
        }),
      );
    });
    const card = getProjectInformationCard();
    expect(within(card).getByText("Passive House")).toBeInTheDocument();
    expect(within(card).queryByText(/Plan /)).toBeNull();
    expect(within(card).queryByText(/Permit #/)).toBeNull();
    expect(within(card).queryByText(/PID:/)).toBeNull();
  });

  it("falls back to the empty state when only non-project intake fields are filled", async () => {
    const { store } = renderWithProviders(<SummaryCard />);
    await act(async () => {
      store.dispatch(
        setIntakeForm({
          ea_name: "Jane Doe",
          ea_number: "12345",
        }),
      );
    });
    const card = getProjectInformationCard();
    expect(
      within(card).getByText("No project information entered."),
    ).toBeInTheDocument();
  });

  it("has no axe violations in the empty state", async () => {
    const { container } = renderWithProviders(<SummaryCard />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when populated", async () => {
    const { container, store } = renderWithProviders(<SummaryCard />);
    await act(async () => {
      store.dispatch(
        setIntakeForm({
          unit_model_type: "Single Detached w/Secondary Suite",
          total_primary_units: "1",
          total_secondary_suites: "1",
          modelling_standard: ["EnerGuide", "Passive House"],
          building_plan_version: "v1.0",
          building_plan_date: "2026-01-15",
          building_plan_author: "J. Smith",
          building_permit: "BP-2026-0042",
          pid_legal: "012-345-678",
        }),
      );
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
