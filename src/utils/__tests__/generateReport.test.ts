import { json2csv } from "json-2-csv";
import { afterAll, beforeAll, describe, vi } from "vitest";
import { downloadCsv, generateCsvFomJson } from "../generateReport";

describe("generateReport tests", () => {
  beforeAll(() => {
    // mock globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = vi.fn(() => "mocked url");
    HTMLAnchorElement.prototype.click = vi.fn();
  });
  afterAll(() => {
    vi.resetAllMocks();
  });
  it("should return a report", () => {
    const mockGeoData = {
      geo: {
        lat: "40.7128",
        lon: "74.0060",
      },
      humanAddress: "123 Main St.",
    };
    const expectedCsv = json2csv([mockGeoData]);
    const report = generateCsvFomJson([mockGeoData]);
    expect(report).toEqual(expectedCsv);
  });

  it("should download a report", () => {
    downloadCsv("mocked csv", "mocked.csv");
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
  });
});
