import { beforeAll, describe, vi } from "vitest";
import { lookUpHumanAddress, searchAddress } from "../geocode";

describe("geocode", () => {
  beforeAll(() => {
    global.fetch = vi.fn();
  });
  it("should fetch address", async () => {
    fetch.mockResolvedValue({
      json: async () => ({
        items: [
          {
            address: {
              label:
                "1600 Amphitheatre Pkwy, Mountain View, California, 94043, United States",
            },
          },
        ],
      }),
    });
    const resp = await searchAddress(
      "1600 Amphitheatre Parkway, Mountain View, CA",
    );
    expect(resp.items[0].address.label).toBe(
      "1600 Amphitheatre Pkwy, Mountain View, California, 94043, United States",
    );
  });

  it("should look up human address", async () => {
    const geo = {
      coords: {
        latitude: 37.4219999,
        longitude: -122.0840575,
      },
    };
    fetch.mockResolvedValue({
      json: async () => ({
        plus_code: {
          compound_code: "CWC8+R9 Mountain View, California, United States",
        },
      }),
    });
    const resp = await lookUpHumanAddress(geo);
    expect(resp).toBe("CWC8+R9 Mountain View, California, United States");
  });
});
