import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

expect.extend(matchers);

const tempFetch = global.fetch;

beforeEach(() => {
  const response = { json: vi.fn().mockResolvedValue("mocked response") };
  global.fetch = vi.fn().mockResolvedValue(response);
});

afterEach(() => {
  cleanup();
  global.fetch = tempFetch;
});
