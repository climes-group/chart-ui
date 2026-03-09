import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportData: null,
  selectedSystems: new Set(),
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportData: (state, action) => {
      state.reportData = action.payload;
    },
    addSelectedSystem: (state, action) => {
      console.log("Adding system to selectedSystems:", action.payload);
      state.selectedSystems = new Set([
        ...state.selectedSystems,
        action.payload,
      ]);
    },
    removeSelectedSystem: (state, action) => {
      const newSet = new Set(state.selectedSystems);
      newSet.delete(action.payload);
      state.selectedSystems = newSet;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setReportData, addSelectedSystem, removeSelectedSystem } =
  reportSlice.actions;

export default reportSlice.reducer;
