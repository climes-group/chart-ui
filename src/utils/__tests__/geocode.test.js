import { afterAll, beforeAll, describe, vi } from "vitest";
import { GeoCode, lookUpHumanAddress, searchAddress } from "../geocode";

describe("geocode", () => {
  let consoleErr;

  beforeAll(() => {
    consoleErr = console.error;
    global.fetch = vi.fn();
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = consoleErr;
  });

  describe("Geocode tests", () => {
    const geodata = {
      lat: 37.4219999,
      lng: -122.0840575,
    };
    const geocode = new GeoCode(geodata.lat, geodata.lng);
    const sydney = new GeoCode(-33.865143, 151.2099);

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

    it("should generate another string", () => {
      expect(sydney.str).toBe("33°51'54.51\"S 151°12'35.64\"E");
    });
  });

  it("should search address", async () => {
    fetch.mockResolvedValue({
      json: async () => [
        {
          place_id: 12345,
          display_name:
            "1600 Amphitheatre Pkwy, Mountain View, California, 94043, United States",
          lat: "37.422",
          lon: "-122.084",
        },
      ],
    });
    const resp = await searchAddress(
      "1600 Amphitheatre Parkway, Mountain View, CA",
    );
    const firstItem = resp.items[0];
    expect(firstItem.address.label).toBe(
      "1600 Amphitheatre Pkwy, Mountain View, California, 94043, United States",
    );
    expect(firstItem.position.lat).toBe(37.422);
    expect(firstItem.position.lng).toBe(-122.084);
  });

  it("should handle error when calling searchAddress", async () => {
    fetch.mockRejectedValueOnce(new Error("error"));
    const resp = await searchAddress(
      "1600 Amphitheatre Parkway, Mountain View, CA",
    );
    expect(resp).toStrictEqual({ items: [] });
  });

  it("should look up human address", async () => {
    const geo = new GeoCode(37.4219999, -122.0840575);
    fetch.mockResolvedValue({
      json: async () => ({
        display_name: "Googleplex, Mountain View, CA, USA",
      }),
    });
    const resp = await lookUpHumanAddress(geo);
    expect(resp).toBe("Googleplex, Mountain View, CA, USA");
  });

  it("should handle error when calling lookUpHumanAddress", async () => {
    const geo = new GeoCode(37.4219999, -122.0840575);
    fetch.mockRejectedValueOnce(new Error("error"));
    const resp = await lookUpHumanAddress(geo);
    expect(resp).toBe("");
  });
});
