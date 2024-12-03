import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

// mock material-ui icons
// icons cause vitest to hang for some reason
vi.mock("@mui/icons-material", () => ({
  NavigationOutlined: "NavigationOutlined",
  KeyboardArrowLeft: "KeyboardArrowLeft",
  KeyboardArrowRight: "KeyboardArrowRight",
}));

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
