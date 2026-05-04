import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { afterEach, expect, vi } from "vitest";

expect.extend(matchers);
expect.extend(toHaveNoViolations);

const tempFetch = global.fetch;

beforeEach(() => {
  const response = { json: vi.fn().mockResolvedValue("mocked response") };
  global.fetch = vi.fn().mockResolvedValue(response);
});

afterEach(() => {
  cleanup();
  global.fetch = tempFetch;
});
