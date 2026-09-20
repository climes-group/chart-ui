import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { meetCondition, setTheme } from "@/state/slices/flowReducer";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { setIntakeForm, type IntakeForm } from "@/state/slices/reportReducer";
import type { RootState } from "@/state/store";
import { useTheme } from "@/theme/ThemeProvider";
import { Bug, Moon, Wifi, WifiOff, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useDebugMode,
  useOfflineMode,
  useSetDebugMode,
  useSetOfflineMode,
  useTestMode,
} from "./TestModeContext";
import { SNAPSHOT_EVENT, loadSnapshot, type Snapshot } from "./snapshot";

const TEST_INTAKE: Partial<IntakeForm> & Record<string, unknown> = {
  building_permit: "BP-2024-TEST-001",
  project_address: "123 Test Street",
  municipality: "Vancouver",
  postal_code: "V6B 1A1",
  pid_legal: "123-456-789",
  unit_model_type: "Single Detached",
  total_primary_units: "1",
  total_secondary_suites: "0",
  building_plan_date: "2024-01-15",
  building_plan_author: "Test Architect",
  building_plan_version: "v1.0",
  modelling_standard: ["EnerGuide"],
  modelling_standard_other: "",
  heated_floor_area: "250",
  number_of_floors: "2",
  electricity_use: "12000",
  fossil_fuel_use: "0",
  meui: "60",
  tedi: "40",
  ghgi: "5",
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

const TEST_GEO = { lat: 43.6532, lng: -79.3832 };
const TEST_ADDRESS = "100 Queen St W, Toronto, ON M5H 2N2, Canada";
const PANEL_OPEN_KEY = "CHART_TEST_PANEL_OPEN";

function DebugBanner() {
  const { isTestMode, intakeFillRef } = useTestMode();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.flow.theme);
  const debugMode = useDebugMode();
  const offlineMode = useOfflineMode();
  const setDebugMode = useSetDebugMode();
  const setOfflineMode = useSetOfflineMode();
  const { mode, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(
    () => localStorage.getItem(PANEL_OPEN_KEY) === "true",
  );
  const [snapshot, setSnapshot] = useState<Snapshot | null>(loadSnapshot);

  useEffect(() => {
    localStorage.setItem(PANEL_OPEN_KEY, String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    const onChange = () => setSnapshot(loadSnapshot());
    globalThis.addEventListener(SNAPSHOT_EVENT, onChange);
    return () => globalThis.removeEventListener(SNAPSHOT_EVENT, onChange);
  }, []);

  if (!isTestMode) return null;

  const handleAutofill = () => {
    const snap = loadSnapshot();
    const intake = (snap?.intakeForm as IntakeForm) ?? TEST_INTAKE;
    const geo = snap?.geoData ?? TEST_GEO;
    const address = (snap?.humanAddress as string) ?? TEST_ADDRESS;

    dispatch(setIntakeForm(intake));
    dispatch(setGeoData(geo as { lat: number; lng: number }));
    dispatch(setHumanAddress(address));
    dispatch(meetCondition({ name: "intake", condition: true }));
    intakeFillRef?.current?.(intake);
  };

  return (
    <div className="align-items fixed bottom-4 left-4 z-50 flex justify-between gap-1">
      <Button
        variant="default"
        size="icon"
        aria-label="Toggle debug banner"
        title="Test mode"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "text-primary-foreground relative rounded-md shadow-md",
          "transition-colors duration-200 ease-out",
        ].join(" ")}
      >
        <Wrench
          className={[
            "absolute transition-all duration-200 ease-out",
            isOpen
              ? "scale-75 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100",
          ].join(" ")}
        />
        <X
          className={[
            "absolute transition-all duration-200 ease-out",
            isOpen
              ? "scale-100 rotate-0 opacity-100"
              : "scale-75 -rotate-90 opacity-0",
          ].join(" ")}
        />
      </Button>

      <div
        className={[
          "md:w-max md:max-w-[calc(100vw-5rem)]",
          "h-10 w-max max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-white/25 bg-gray-600/50 text-xs text-white shadow-xl backdrop-blur-sm",
          "transition-all duration-200 ease-out",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-4 opacity-0",
        ].join(" ")}
      >
        <div className="flex h-full items-center gap-4 px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAutofill}
            className="h-7 rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            {snapshot ? "Autofill from snapshot" : "Autofill (defaults)"}
          </Button>
          <div className="flex h-full items-center gap-2 whitespace-nowrap">
            <Moon className="size-4" />
            <Switch
              aria-label={`Dark mode: ${mode === "dark" ? "on" : "off"}`}
              title={`Toggle dark mode (currently ${mode === "dark" ? "on" : "off"})`}
              checked={mode === "dark"}
              onCheckedChange={(checked) => setMode(checked ? "dark" : "light")}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <div className="flex h-full items-center gap-2 whitespace-nowrap">
            {offlineMode ? (
              <Wifi className="size-4" />
            ) : (
              <WifiOff className="size-4" />
            )}
            <Switch
              aria-label={`Offline mode: ${offlineMode ? "on" : "off"}`}
              title={`Toggle offline mode (currently ${offlineMode ? "on" : "off"})`}
              checked={offlineMode}
              onCheckedChange={setOfflineMode}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <div className="flex h-full items-center gap-2 whitespace-nowrap">
            <Bug className="size-4" />
            <Switch
              aria-label={`Debug mode: ${debugMode ? "on" : "off"}`}
              title={`Toggle debug mode (currently ${debugMode ? "on" : "off"})`}
              checked={debugMode}
              onCheckedChange={setDebugMode}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <div className="flex h-full items-center gap-1 whitespace-nowrap">
            <span className="text-white/70">Theme:</span>
            {[1].map((t) => (
              <Button
                variant={theme === t ? "default" : "ghost"}
                size="sm"
                key={t}
                onClick={() => dispatch(setTheme(t))}
                className="h-7 rounded-full px-2 text-white hover:bg-white/10 hover:text-white"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebugBanner;
