import { downloadCsv } from "@/utils/generateReport";
import { renderWithProviders } from "@/utils/testing";
import { describe } from "vitest";
import ReportCard from "../ReportCard";

// vi.mock generateReport and downloadCsv
vi.mock("@/utils/generateReport", {
  downloadCsv: vi.fn(),
  generateCsvFomJson: vi.fn(),
});

describe("ReportCard tests", () => {
  it("should render a Report card", () => {
    // mock generateReport and downloadCsv

    const { getByText } = renderWithProviders(<ReportCard />);
    getByText("Download site location details").click();
    expect(downloadCsv).toHaveBeenCalled();
  });
});
