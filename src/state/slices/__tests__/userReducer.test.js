import reducer, { logout, setProfile } from "../userReducer";

const initialState = { profile: undefined };

const mockProfile = { given_name: "Jane", email: "jane@example.com" };

describe("userReducer", () => {
  it("returns the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("sets a profile", () => {
    const state = reducer(initialState, setProfile(mockProfile));
    expect(state.profile).toEqual(mockProfile);
  });

  it("overwrites an existing profile", () => {
    const s1 = reducer(initialState, setProfile(mockProfile));
    const newProfile = { given_name: "John", email: "john@example.com" };
    const s2 = reducer(s1, setProfile(newProfile));
    expect(s2.profile).toEqual(newProfile);
  });

  it("clears the profile on logout", () => {
    const withProfile = reducer(initialState, setProfile(mockProfile));
    const state = reducer(withProfile, logout());
    expect(state.profile).toBeUndefined();
  });

  it("logout on already-logged-out state is a no-op", () => {
    const state = reducer(initialState, logout());
    expect(state.profile).toBeUndefined();
  });
});
