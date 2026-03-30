import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  geoData: undefined,
  humanAddress: undefined,
};

export const geoSlice = createSlice({
  name: "geo",
  initialState,
  reducers: {
    setGeoData: (state, action) => {
      state.geoData = action.payload;
    },
    setHumanAddress: (state, action) => {
      state.humanAddress = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGeoData, setHumanAddress } = geoSlice.actions;

export default geoSlice.reducer;
