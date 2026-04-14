import { useTestMode } from "@/context/TestModeContext";
import { meetCondition, setTheme } from "@/state/slices/flowReducer";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { setIntakeForm } from "@/state/slices/reportReducer";
import { useDispatch, useSelector } from "react-redux";

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
  const { isTestMode, intakeFillRef, variantIdx, setVariantIdx } =
    useTestMode();
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
    <div className="border-border fixed left-4 bottom-4 z-50 flex min-w-[170px] flex-col gap-2 rounded-xl border bg-white/90 px-4 py-3 shadow-md backdrop-blur">
      <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        Test Mode
      </span>

      <div className="flex items-center gap-1">
        <span className="text-muted-foreground mr-1 text-xs">Theme:</span>
        {[1, 2].map((t) => (
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
        onClick={handleAutofill}
        className="bg-golden-accent/20 text-warm-brown hover:bg-golden-accent/40 rounded-full px-3 py-1.5 text-left text-xs font-medium transition-colors"
      >
        Autofill All Data
      </button>
    </div>
  );
}
