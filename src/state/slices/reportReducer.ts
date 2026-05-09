import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SystemRecord = {
  "ASTM.System.Code"?: string;
  "ASTM.Code"?: string;
  [key: string]: unknown;
};

export type FeatureRecord = {
  ID?: string;
  [key: string]: unknown;
};

export function getSystemCodeFor(
  system: SystemRecord | null | undefined,
): string | undefined {
  if (!system) return undefined;
  return system["ASTM.System.Code"] || system["ASTM.Code"];
}

export function getFeatureKeyFor(
  feature: FeatureRecord | null | undefined,
): string | undefined {
  if (!feature) return undefined;
  return feature["ID"];
}

export type IntakeForm = {
  building_permit: string;
  project_address: string;
  municipality: string;
  postal_code: string;
  pid_legal: string;
  unit_model_type: string;
  total_primary_units: string;
  total_secondary_suites: string;
  building_plan_date: string;
  building_plan_author: string;
  building_plan_version: string;
  modelling_standard: string[];
  modelling_standard_other: string;
  heated_floor_area: string;
  number_of_floors: string;
  electricity_use: string;
  fossil_fuel_use: string;
  meui: string;
  tedi: string;
  ghgi: string;
  ea_name: string;
  ea_number: string;
  ea_phone: string;
  ea_business: string;
  so_company_name: string;
  builder_name: string;
  builder_phone: string;
  ea_signature_date: string;
  builder_signature_date: string;
  ea_signature: string;
  builder_signature: string;
};

export type ReportStatus =
  | "not_generated"
  | "generating"
  | "generated"
  | "error";

type ReportState = {
  reportData: unknown;
  reportDebugData: unknown;
  reportStatus: ReportStatus;
  reportGenAt: string | null;
  reportGenTime: number | null;
  selectedSystems: SystemRecord[];
  selectedSiteFeatures: FeatureRecord[];
  intakeForm: IntakeForm;
};

const initialState: ReportState = {
  reportData: null,
  reportDebugData: null,
  reportStatus: "not_generated",
  reportGenAt: null,
  reportGenTime: null,
  selectedSystems: [],
  selectedSiteFeatures: [],
  intakeForm: {
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
    heated_floor_area: "",
    number_of_floors: "",
    electricity_use: "",
    fossil_fuel_use: "",
    meui: "",
    tedi: "",
    ghgi: "",
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
    setReportData: (state, action: PayloadAction<unknown>) => {
      state.reportData = action.payload;
    },
    setReportDebugData: (state, action: PayloadAction<unknown>) => {
      state.reportDebugData = action.payload;
    },
    setReportStatus: (state, action: PayloadAction<ReportStatus>) => {
      state.reportStatus = action.payload;
    },
    setReportGenAt: (state, action: PayloadAction<string | null>) => {
      state.reportGenAt = action.payload;
    },
    setReportGenTime: (state, action: PayloadAction<number | null>) => {
      state.reportGenTime = action.payload;
    },
    addSelectedSystem: (state, action: PayloadAction<SystemRecord>) => {
      const system = action.payload;
      const code = getSystemCodeFor(system);
      if (!code) return;
      const exists = state.selectedSystems.some(
        (s) => getSystemCodeFor(s) === code,
      );
      if (!exists) state.selectedSystems.push(system);
    },
    addSelectedFeature: (state, action: PayloadAction<FeatureRecord>) => {
      const feature = action.payload;
      const key = getFeatureKeyFor(feature);
      if (!key) return;
      const exists = state.selectedSiteFeatures.some(
        (f) => getFeatureKeyFor(f) === key,
      );
      if (!exists) state.selectedSiteFeatures.push(feature);
    },
    removeSelectedSystem: (state, action: PayloadAction<string>) => {
      const code = action.payload;
      state.selectedSystems = state.selectedSystems.filter(
        (s) => getSystemCodeFor(s) !== code,
      );
    },
    removeSelectedFeature: (state, action: PayloadAction<string>) => {
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
    setSelectedSystems: (state, action: PayloadAction<unknown>) => {
      state.selectedSystems = Array.isArray(action.payload)
        ? (action.payload as SystemRecord[])
        : [];
    },
    setSelectedFeatures: (state, action: PayloadAction<unknown>) => {
      state.selectedSiteFeatures = Array.isArray(action.payload)
        ? (action.payload as FeatureRecord[])
        : [];
    },
    setIntakeField: (
      state,
      action: PayloadAction<
        { key?: string; value?: unknown } | null | undefined
      >,
    ) => {
      const { key, value } = action.payload || {};
      if (!key) return;
      state.intakeForm = {
        ...state.intakeForm,
        [key]: value,
      };
    },
    setIntakeForm: (
      state,
      action: PayloadAction<Partial<IntakeForm> | null | undefined>,
    ) => {
      state.intakeForm = {
        ...state.intakeForm,
        ...(action.payload ?? {}),
      };
    },
    clearIntakeForm: (state) => {
      state.intakeForm = initialState.intakeForm;
    },
    resetReport: (state) => {
      state.reportData = null;
      state.reportDebugData = null;
      state.reportStatus = "not_generated";
      state.reportGenAt = null;
      state.reportGenTime = null;
    },
    resetReportState: () => initialState,
  },
});

export const {
  setReportData,
  setReportDebugData,
  setReportStatus,
  setReportGenAt,
  setReportGenTime,
  addSelectedSystem,
  removeSelectedSystem,
  clearSelectedSystems,
  setSelectedSystems,
  addSelectedFeature,
  removeSelectedFeature,
  clearSelectedFeatures,
  setSelectedFeatures,
  setIntakeField,
  setIntakeForm,
  clearIntakeForm,
  resetReport,
  resetReportState,
} = reportSlice.actions;

export const selectIntakeForm = (state: {
  report: { intakeForm: IntakeForm };
}) => state.report.intakeForm;

export default reportSlice.reducer;
