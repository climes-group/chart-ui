import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getUserTimezone } from "../timezone";

describe("getUserTimezone", () => {
  const originalIntl = globalThis.Intl;

  afterEach(() => {
    // Restore original Intl
    (globalThis as any).Intl = originalIntl;
  });

  it("returns a valid IANA timezone string on success", () => {
    const result = getUserTimezone();
    expect(typeof result).toBe("string");
    // Basic check: should be non-empty and not "UTC" unless that's the actual timezone
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns UTC when Intl.DateTimeFormat is not available", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    (globalThis as any).Intl = undefined;

    const result = getUserTimezone();
    expect(result).toBe("UTC");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to detect user timezone, falling back to UTC",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("returns UTC when resolvedOptions throws an error", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    (globalThis as any).Intl = {
      DateTimeFormat: vi.fn(() => ({
        resolvedOptions: vi.fn(() => {
          throw new Error("Intl error");
        }),
      })),
    };

    const result = getUserTimezone();
    expect(result).toBe("UTC");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to detect user timezone, falling back to UTC",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("logs a warning when fallback is triggered", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    (globalThis as any).Intl = undefined;

    getUserTimezone();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
