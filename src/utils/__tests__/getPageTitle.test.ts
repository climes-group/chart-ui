import { getPageTitle } from "../getPageTitle";

describe("getPageTitle", () => {
  const translations: Record<string, string> = {
    "pageTitle.design": "Design System",
    "savedReports.heading": "Saved Reports",
    "finish.title": "All done!",
    "steps.intake": "Intake",
    "steps.systems": "Building Systems",
    "steps.features": "Site Features",
    "steps.report": "Report",
  };
  const t = (key: string) => translations[key] ?? key;

  it("uses the app name for the splash route", () => {
    expect(getPageTitle("/", t)).toBe("CHART");
  });

  it("includes the page name for non-flow routes", () => {
    expect(getPageTitle("/design", t)).toBe("CHART — Design System");
    expect(getPageTitle("/reports", t)).toBe("CHART — Saved Reports");
  });

  it("includes the current flow step", () => {
    expect(getPageTitle("/flow/systems", t)).toBe("CHART — Building Systems");
    expect(getPageTitle("/flow/finish", t)).toBe("CHART — All done!");
  });

  it("falls back to the intake title for an unknown flow route", () => {
    expect(getPageTitle("/flow/unknown", t)).toBe("CHART — Intake");
  });
});
