import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasAcceptedTerms: undefined,
  geoData: undefined,
  humanAddress: undefined,
};

export const geoSlice = createSlice({
  name: "geo",
  initialState,
  reducers: {
    acceptTerms: (state) => {
      state.hasAcceptedTerms = true;
    },
    setGeoData: (state, action) => {
      state.geoData = action.payload;
    },
    setHumanAddress: (state, action) => {
      state.humanAddress = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { acceptTerms, setGeoData, setHumanAddress } = geoSlice.actions;

export default geoSlice.reducer;
