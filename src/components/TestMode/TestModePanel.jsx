import { meetCondition, setTheme } from "@/state/slices/flowReducer";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { setIntakeForm } from "@/state/slices/reportReducer";
import { useDispatch, useSelector } from "react-redux";
import { useTestMode } from "@/context/TestModeContext";

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
  ea_phone: "604-555-0100",
  ea_business: "Test Energy Consulting Ltd.",
  so_company_name: "Test Builder Corp.",
  builder_name: "Test Builder",
  builder_phone: "604-555-0200",
  ea_signature_date: "2024-01-20",
  builder_signature_date: "2024-01-20",
};

const TEST_GEO = { lat: 49.2827, lng: -123.1207 };
const TEST_ADDRESS = "123 Test Street, Vancouver, BC V6B 1A1, Canada";

export default function TestModePanel() {
  const { isTestMode, intakeFillRef } = useTestMode();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.flow.theme);

  if (!isTestMode) return null;

  const handleAutofill = () => {
    // Fill Redux state (covers SiteLocation, and IntakeCard if not yet mounted)
    dispatch(setIntakeForm(TEST_INTAKE));
    dispatch(setGeoData(TEST_GEO));
    dispatch(setHumanAddress(TEST_ADDRESS));
    dispatch(meetCondition({ name: "siteLocation" }));
    // If IntakeCard is currently mounted, update the live form too
    intakeFillRef?.current?.(TEST_INTAKE);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-white/90 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-md min-w-[170px]">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Test Mode
      </span>

      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Theme:</span>
        {[1, 2].map((t) => (
          <button
            key={t}
            onClick={() => dispatch(setTheme(t))}
            className={[
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
              theme === t
                ? "bg-moss-primary text-white"
                : "text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      <button
        onClick={handleAutofill}
        className="px-3 py-1.5 rounded-full text-xs font-medium bg-golden-accent/20 text-warm-brown hover:bg-golden-accent/40 transition-colors text-left"
      >
        Autofill All Data
      </button>
    </div>
  );
}
