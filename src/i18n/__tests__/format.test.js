import { describe, expect, it } from "vitest";
import { formatDate, formatNumber, formatPhone } from "../format";

describe("formatDate", () => {
  const value = "2026-05-03T14:30:00Z";

  it("formats with the en-CA locale", () => {
    const out = formatDate(value, "en-CA", { dateStyle: "medium" });
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/May/i);
  });

  it("formats with the fr-CA locale", () => {
    const out = formatDate(value, "fr-CA", { dateStyle: "medium" });
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/mai/i);
  });

  it("returns an empty string for empty input", () => {
    expect(formatDate(null, "en-CA")).toBe("");
    expect(formatDate("", "en-CA")).toBe("");
    expect(formatDate(undefined, "en-CA")).toBe("");
  });

  it("returns an empty string for invalid dates", () => {
    expect(formatDate("not-a-date", "en-CA")).toBe("");
  });
});

describe("formatNumber", () => {
  it("uses comma grouping for en-CA", () => {
    expect(formatNumber(1234.56, "en-CA")).toBe("1,234.56");
  });

  it("uses non-breaking space grouping and decimal comma for fr-CA", () => {
    const out = formatNumber(1234.56, "fr-CA");
    expect(out).toMatch(/1.234,56/);
  });

  it("returns an empty string for empty input", () => {
    expect(formatNumber(null, "en-CA")).toBe("");
    expect(formatNumber("", "en-CA")).toBe("");
  });

  it("returns an empty string for non-numeric input", () => {
    expect(formatNumber("abc", "en-CA")).toBe("");
  });
});

describe("formatPhone", () => {
  it("formats a 10-digit number", () => {
    expect(formatPhone("5555550100")).toBe("555-555-0100");
  });

  it("strips a leading 1 country code", () => {
    expect(formatPhone("15555550100")).toBe("555-555-0100");
  });

  it("formats already-grouped input", () => {
    expect(formatPhone("(555) 555-0100")).toBe("555-555-0100");
  });

  it("returns the original value when it isn't 10 digits", () => {
    expect(formatPhone("123")).toBe("123");
  });

  it("returns an empty string for empty input", () => {
    expect(formatPhone("")).toBe("");
    expect(formatPhone(null)).toBe("");
  });
});
