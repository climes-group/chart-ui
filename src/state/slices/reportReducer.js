import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportData: null,
  reportStatus: "not_generated", // can be 'not_generated', 'generating', 'generated'
  reportGenAt: null,
  reportGenTime: null,
  selectedSystems: [], // Array of selected system identifiers
  intakeForm: {
    // Project Information
    building_permit: "",
    project_address: "",
    municipality: "",
    postal_code: "",
    pid_legal: "",
    unit_model_type: "",
    total_primary_units: "",
    total_secondary_suites: "",
    building_plan_date: "",
    building_plan_author: "",
    building_plan_version: "",
    modelling_standard: [],
    modelling_standard_other: "",
    // Building Information
    heated_floor_area: "",
    number_of_floors: "",
    electricity_use: "",
    fossil_fuel_use: "",
    meui: "",
    tedi: "",
    ghgi: "",
    // Assessor Information
    ea_name: "",
    ea_number: "",
    ea_phone: "",
    ea_business: "",
    so_company_name: "",
    builder_name: "",
    builder_phone: "",
    ea_signature_date: "",
    builder_signature_date: "",
  },
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
    clearSelectedSystems: (state) => {
      state.selectedSystems = [];
    },
    setIntakeField: (state, action) => {
      const { key, value } = action.payload || {};
      if (!key) return;
      state.intakeForm = {
        ...state.intakeForm,
        [key]: value,
      };
    },
    setIntakeForm: (state, action) => {
      state.intakeForm = {
        ...state.intakeForm,
        ...(action.payload || {}),
      };
    },
    clearIntakeForm: (state) => {
      state.intakeForm = initialState.intakeForm;
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
  clearSelectedSystems,
  setIntakeField,
  setIntakeForm,
  clearIntakeForm,
} = reportSlice.actions;

export const selectIntakeForm = (state) => state.report.intakeForm;

export default reportSlice.reducer;
