import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportData: null,
  reportStatus: "not_generated", // can be 'not_generated', 'generating', 'generated'
  reportGenAt: null,
  reportGenTime: null,
  selectedSystems: [], // Array of selected system identifiers
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportData: (state, action) => {
      state.reportData = action.payload;
    },
    setReportStatus: (state, action) => {
      state.reportStatus = action.payload;
    },
    setReportGenAt: (state, action) => {
      state.reportGenAt = action.payload;
    },
    setReportGenTime: (state, action) => {
      state.reportGenTime = action.payload;
    },
    addSelectedSystem: (state, action) => {
      state.selectedSystems = [
        ...new Set([...state.selectedSystems, action.payload]),
      ];
    },
    removeSelectedSystem: (state, action) => {
      const newSet = new Set(state.selectedSystems);
      newSet.delete(action.payload);
      state.selectedSystems = [...newSet];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setReportData,
  setReportStatus,
  setReportGenAt,
  setReportGenTime,
  addSelectedSystem,
  removeSelectedSystem,
} = reportSlice.actions;

export default reportSlice.reducer;
