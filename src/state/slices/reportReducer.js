import { createSlice } from "@reduxjs/toolkit";

export function getSystemCodeFor(system) {
  if (!system) return undefined;
  return system["ASTM.System.Code"] || system["ASTM.Code"];
}

export function getFeatureKeyFor(feature) {
  if (!feature) return undefined;
  return feature["ID"];
}

const initialState = {
  reportData: null,
  reportDebugData: null,
  reportStatus: "not_generated", // can be 'not_generated', 'generating', 'generated'
  reportGenAt: null,
  reportGenTime: null,
  selectedSystems: [], // Array of selected system records (raw API shape)
  selectedSiteFeatures: [], // Array of selected site feature records (raw API shape)
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
    ea_signature: "",
    builder_signature: "",
  },
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportData: (state, action) => {
      state.reportData = action.payload;
    },
    setReportDebugData: (state, action) => {
      state.reportDebugData = action.payload;
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
      const system = action.payload;
      const code = getSystemCodeFor(system);
      if (!code) return;
      const exists = state.selectedSystems.some(
        (s) => getSystemCodeFor(s) === code,
      );
      if (!exists) state.selectedSystems.push(system);
    },
    addSelectedFeature: (state, action) => {
      const feature = action.payload;
      const key = getFeatureKeyFor(feature);
      if (!key) return;
      const exists = state.selectedSiteFeatures.some(
        (f) => getFeatureKeyFor(f) === key,
      );
      if (!exists) state.selectedSiteFeatures.push(feature);
    },
    removeSelectedSystem: (state, action) => {
      const code = action.payload;
      state.selectedSystems = state.selectedSystems.filter(
        (s) => getSystemCodeFor(s) !== code,
      );
    },
    removeSelectedFeature: (state, action) => {
      const key = action.payload;
      state.selectedSiteFeatures = state.selectedSiteFeatures.filter(
        (f) => getFeatureKeyFor(f) !== key,
      );
    },
    clearSelectedSystems: (state) => {
      state.selectedSystems = [];
    },
    clearSelectedFeatures: (state) => {
      state.selectedSiteFeatures = [];
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
  setReportDebugData,
  setReportStatus,
  setReportGenAt,
  setReportGenTime,
  addSelectedSystem,
  removeSelectedSystem,
  clearSelectedSystems,
  addSelectedFeature,
  removeSelectedFeature,
  clearSelectedFeatures,
  setIntakeField,
  setIntakeForm,
  clearIntakeForm,
} = reportSlice.actions;

export const selectIntakeForm = (state) => state.report.intakeForm;

export default reportSlice.reducer;
