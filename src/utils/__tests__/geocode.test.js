import { afterAll, beforeAll, describe, vi } from "vitest";
import { GeoCode, lookUpHumanAddress, searchAddress } from "../geocode";

describe("geocode", () => {
  let consoleErr = console.error;
  beforeAll(() => {
    global.fetch = vi.fn();
    vi.stubEnv("VITE_FF_USE_GEO_API", "true");
    console.error = vi.fn();
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    console.error = consoleErr;
  });

  describe("Geocode tests", () => {
    const geodata = {
      lat: 37.4219999,
      lng: -122.0840575,
    };
    const geocode = new GeoCode(geodata.lat, geodata.lng);

    it("should generate query string", () => {
      expect(geocode.queryStr).toBe("37.4219999,-122.0840575");
    });

    it("should format as DMS", () => {
      expect(geocode.formatAsDMS()).toEqual({
        lat: { deg: 37, min: 25, sec: 19.2, dir: "N" },
        lng: { deg: 122, min: 5, sec: 2.61, dir: "W" },
      });
    });

    it("should generate string", () => {
      expect(geocode.str).toBe("37°25'19.20\"N 122°5'2.61\"W");
    });
  });

  it("should search address", async () => {
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

  it("should handle error when calling searchAddress", async () => {
    fetch.mockRejectedValueOnce(new Error("error"));
    const resp = await searchAddress(
      "1600 Amphitheatre Parkway, Mountain View, CA",
    );
    expect(resp).toStrictEqual({});
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

  it("should handle error when calling lookUpHumanAddress", async () => {
    const geo = {
      coords: {
        latitude: 37.4219999,
        longitude: -122.0840575,
      },
    };
    fetch.mockRejectedValueOnce(new Error("error"));
    const resp = await lookUpHumanAddress(geo);
    expect(resp).toBe("");
  });

  it("should handle missing API key", async () => {
    vi.stubEnv("VITE_FF_USE_GEO_API", "");
    const resp = await lookUpHumanAddress({});
    expect(resp).toBe(undefined);
  });
});
