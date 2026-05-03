import {
  useDebugMode,
  useSetDebugMode,
  useTestMode,
} from "@/context/TestModeContext";
import { meetCondition, setTheme } from "@/state/slices/flowReducer";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { addSelectedSystem, setIntakeForm } from "@/state/slices/reportReducer";
import { Bug, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const TEST_INTAKE = {
  building_permit: "BP-2024-TEST-001",
  project_address: "123 Test Street",
  municipality: "Vancouver",
  postal_code: "V6B 1A1",
  pid_legal: "123-456-789",
  unit_model_type: "Single Detached",
  total_primary_units: 1,
  total_secondary_suites: 0,
  building_plan_date: "2024-01-15",
  building_plan_author: "Test Architect",
  building_plan_version: "v1.0",
  modelling_standard: ["EnerGuide"],
  modelling_standard_other: "",
  heated_floor_area: 250,
  number_of_floors: 2,
  electricity_use: 12000,
  fossil_fuel_use: 0,
  meui: 60,
  tedi: 40,
  ghgi: 5,
  ea_name: "Test Energy Advisor",
  ea_number: "EA-12345",
  ea_phone: "555-555-0100",
  ea_business: "Test Energy Consulting Ltd.",
  so_company_name: "Test Builder Corp.",
  builder_name: "Test Builder",
  builder_phone: "555-555-0200",
  ea_signature_date: "2024-01-20",
  builder_signature_date: "2024-01-20",
  ea_signature:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=",
  builder_signature:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=",
};

const TEST_GEO = { lat: 49.2827, lng: -123.1207 };
const TEST_ADDRESS = "123 Test Street, Vancouver, BC V6B 1A1, Canada";

const TEST_SYSTEM = {
  Services: "Mechanical",
  Classification: "Heating",
  "ASTM.Code": "D3010",
  "ASTM.Name": "Tank-style",
  "ASTM.System.Name": "Boiler",
  "ASTM.System.Code": "HW-01",
};

const PANEL_OPEN_KEY = "CHART_TEST_PANEL_OPEN";

export default function TestModePanel() {
  const { isTestMode, intakeFillRef } = useTestMode();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.flow.theme);
  const debugMode = useDebugMode();
  const setDebugMode = useSetDebugMode();
  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(
    () => localStorage.getItem(PANEL_OPEN_KEY) === "true",
  );

  useEffect(() => {
    localStorage.setItem(PANEL_OPEN_KEY, String(isOpen));
  }, [isOpen]);

  if (!isTestMode || pathname === "/") return null;

  const handleAutofill = () => {
    dispatch(setIntakeForm(TEST_INTAKE));
    dispatch(setGeoData(TEST_GEO));
    dispatch(setHumanAddress(TEST_ADDRESS));
    dispatch(addSelectedSystem(TEST_SYSTEM));
    dispatch(meetCondition({ name: "intake", condition: true }));
    dispatch(meetCondition({ name: "selectedSystems", condition: true }));
    intakeFillRef?.current?.(TEST_INTAKE);
  };

  return (
    <div className="fixed top-1/2 left-0 z-50 -translate-y-1/2">
      {/* Collapsed strip */}
      <button
        type="button"
        aria-label="Open test mode panel"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className={[
          "bg-teal-deep text-warm-gold hover:bg-teal-deep/90 hover:translate-x-0.5",
          "flex w-7 flex-col items-center gap-2 rounded-r-md py-3 shadow-md",
          "transition-all duration-200 ease-out",
          isOpen ? "pointer-events-none opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <Wrench className="size-3.5" />
        <span className="rotate-180 text-[10px] font-semibold tracking-widest uppercase [writing-mode:vertical-rl]">
          Test Mode
        </span>
      </button>

      {/* Expanded panel */}
      <div
        className={[
          "border-border absolute top-1/2 left-0 -translate-y-1/2",
          "w-48 overflow-hidden rounded-r-xl border border-l-0 bg-white/95 shadow-xl backdrop-blur",
          "transition-all duration-200 ease-out",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0",
        ].join(" ")}
      >
        <div className="bg-teal-deep text-warm-gold flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Wrench className="size-4" />
            <span className="text-xs font-semibold tracking-wide uppercase">
              Test Mode
            </span>
          </div>
          <button
            type="button"
            aria-label="Close test mode panel"
            onClick={() => setIsOpen(false)}
            className="rounded p-1 transition-colors hover:bg-white/10"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-4 py-3">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted-foreground mr-1 text-xs">Theme:</span>
            {[1].map((t) => (
              <button
                key={t}
                onClick={() => dispatch(setTheme(t))}
                className={[
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  theme === t
                    ? "bg-teal-deep text-white"
                    : "text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={debugMode}
            onClick={() => setDebugMode(!debugMode)}
            className={[
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              debugMode
                ? "bg-coral text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            ].join(" ")}
          >
            <Bug className="size-3.5" />
            Debug mode {debugMode ? "on" : "off"}
          </button>

          <button
            onClick={handleAutofill}
            className="bg-golden-accent/20 text-warm-brown hover:bg-golden-accent/40 rounded-full px-3 py-1.5 text-left text-xs font-medium transition-colors"
          >
            Autofill &amp; Unlock Steps
          </button>
        </div>
      </div>
    </div>
  );
}
