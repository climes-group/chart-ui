import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type GeoData = { lat: number; lng: number };

type GeoState = {
  geoData: GeoData | undefined;
  humanAddress: string | undefined;
};

const initialState: GeoState = {
  geoData: undefined,
  humanAddress: undefined,
};

export const geoSlice = createSlice({
  name: "geo",
  initialState,
  reducers: {
    setGeoData: (state, action: PayloadAction<GeoData | undefined>) => {
      state.geoData = action.payload;
    },
    setHumanAddress: (state, action: PayloadAction<string | undefined>) => {
      state.humanAddress = action.payload;
    },
    resetGeoState: () => initialState,
  },
});

export const { setGeoData, setHumanAddress, resetGeoState } = geoSlice.actions;

export default geoSlice.reducer;
