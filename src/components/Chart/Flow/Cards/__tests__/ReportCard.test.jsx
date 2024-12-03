import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe } from "vitest";
import { store } from "../../../../../state/store";
import { downloadCsv } from "../../../../../utils/generateReport";
import ReportCard from "../ReportCard";

// vi.mock generateReport and downloadCsv
vi.mock("../../../../../utils/generateReport", {
  downloadCsv: vi.fn(),
  generateCsvFomJson: vi.fn(),
});

describe("ReportCard tests", () => {
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it("should render a Report card", () => {
    // mock generateReport and downloadCsv

    const { getByText } = render(<ReportCard />, { wrapper });
    getByText("Download site location details").click();
    expect(downloadCsv).toHaveBeenCalled();
  });
});
