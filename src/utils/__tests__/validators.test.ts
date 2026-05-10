import { isValidPhone } from "../validators";

describe("isValidPhone", () => {
  it("accepts a 10-digit number with dashes", () => {
    expect(isValidPhone("604-555-0100")).toBe(true);
  });

  it("accepts a number with parentheses and spaces", () => {
    expect(isValidPhone("(604) 555-0100")).toBe(true);
  });

  it("accepts a +1 prefixed number", () => {
    expect(isValidPhone("+1 604 555 0100")).toBe(true);
  });

  it("accepts a bare 10-digit string", () => {
    expect(isValidPhone("6045550100")).toBe(true);
  });

  it("rejects non-numeric input", () => {
    expect(isValidPhone("abc")).toBe(false);
  });

  it("rejects too-few digits", () => {
    expect(isValidPhone("1234")).toBe(false);
  });

  it("rejects empty input", () => {
    expect(isValidPhone("")).toBe(false);
  });

  it("rejects an 11-digit number not starting with 1", () => {
    expect(isValidPhone("26045550100")).toBe(false);
  });
});
