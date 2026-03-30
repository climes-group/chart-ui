import reducer, { setGeoData, setHumanAddress } from "../geoReducer";

const initialState = { geoData: undefined, humanAddress: undefined };

describe("geoReducer", () => {
  it("returns the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("sets geoData", () => {
    const geoData = { lat: 49.28, lng: -123.12 };
    const state = reducer(initialState, setGeoData(geoData));
    expect(state.geoData).toEqual(geoData);
  });

  it("overwrites existing geoData", () => {
    const first = { lat: 49.28, lng: -123.12 };
    const second = { lat: 43.65, lng: -79.38 };
    const state = reducer(reducer(initialState, setGeoData(first)), setGeoData(second));
    expect(state.geoData).toEqual(second);
  });

  it("clears geoData when set to undefined", () => {
    const withData = reducer(initialState, setGeoData({ lat: 49.28, lng: -123.12 }));
    const cleared = reducer(withData, setGeoData(undefined));
    expect(cleared.geoData).toBeUndefined();
  });

  it("sets humanAddress", () => {
    const state = reducer(initialState, setHumanAddress("123 Main St, Vancouver"));
    expect(state.humanAddress).toBe("123 Main St, Vancouver");
  });

  it("overwrites existing humanAddress", () => {
    const s1 = reducer(initialState, setHumanAddress("First Address"));
    const s2 = reducer(s1, setHumanAddress("Second Address"));
    expect(s2.humanAddress).toBe("Second Address");
  });

  it("does not mutate geoData when setting humanAddress", () => {
    const geoData = { lat: 49.28, lng: -123.12 };
    const s1 = reducer(initialState, setGeoData(geoData));
    const s2 = reducer(s1, setHumanAddress("Some Address"));
    expect(s2.geoData).toEqual(geoData);
  });
});
