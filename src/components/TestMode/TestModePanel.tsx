import {
  useDebugMode,
  useOfflineMode,
  useSetDebugMode,
  useSetOfflineMode,
  useTestMode,
} from "@/components/TestMode/TestModeContext";
import { Button } from "@/components/ui/button";
import { meetCondition, setTheme } from "@/state/slices/flowReducer";
import { setGeoData, setHumanAddress } from "@/state/slices/geoReducer";
import { setIntakeForm, type IntakeForm } from "@/state/slices/reportReducer";
import type { RootState } from "@/state/store";
import { useTheme } from "@/theme/ThemeProvider";
import { Bug, Moon, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const TEST_GEO = { lat: 43.6532, lng: -79.3832 }; // Toronto City Hall
const TEST_ADDRESS = "100 Queen St W, Toronto, ON M5H 2N2, Canada";

const PANEL_OPEN_KEY = "CHART_TEST_PANEL_OPEN";

export default function TestModePanel() {
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

  useEffect(() => {
    localStorage.setItem(PANEL_OPEN_KEY, String(isOpen));
  }, [isOpen]);

  const [snapshot, setSnapshot] = useState<Snapshot | null>(loadSnapshot);
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
    <div className="fixed bottom-4 left-4 z-50">
      {/* Collapsed strip */}
      <Button
        variant="default"
        size="icon"
        aria-label="Open test mode panel"
        title="Test mode"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className={[
          "text-primary-foreground rounded-md shadow-md",
          "transition-all duration-200 ease-out",
          isOpen ? "pointer-events-none opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <Wrench />
      </Button>

      {/* Expanded panel */}
      <div
        className={[
          "border-border absolute bottom-0 left-0",
          "bg-surface w-48 overflow-hidden rounded-xl border shadow-xl backdrop-blur",
          "transition-all duration-200 ease-out",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0",
        ].join(" ")}
      >
        <div className="bg-primary text-primary-foreground flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Wrench className="size-4" />
            <span className="text-xs font-semibold tracking-wide uppercase">
              Test Mode
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close test mode panel"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-4 px-4 py-3">
          <Button
            variant={mode === "dark" ? "secondary" : "ghost"}
            size="sm"
            role="switch"
            aria-checked={mode === "dark"}
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            className="justify-start rounded-full"
          >
            <Moon className="size-3.5" />
            Dark mode {mode === "dark" ? "on" : "off"} (WIP)
          </Button>

          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted-foreground mr-1 text-xs">Theme:</span>
            {[1].map((t) => (
              <Button
                variant={theme === t ? "default" : "ghost"}
                size="sm"
                key={t}
                onClick={() => dispatch(setTheme(t))}
                className="rounded-full"
              >
                {t}
              </Button>
            ))}
          </div>

          <Button
            variant={debugMode ? "destructive" : "ghost"}
            size="sm"
            role="switch"
            aria-checked={debugMode}
            onClick={() => setDebugMode(!debugMode)}
            className="justify-start rounded-full"
          >
            <Bug className="size-3.5" />
            Debug mode {debugMode ? "on" : "off"}
          </Button>

          <Button
            variant={offlineMode ? "destructive" : "ghost"}
            size="sm"
            role="switch"
            aria-checked={offlineMode}
            onClick={() => setOfflineMode(!offlineMode)}
            className="justify-start rounded-full"
          >
            <Bug className="size-3.5" />
            Offline mode {offlineMode ? "on" : "off"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAutofill}
            className="justify-start rounded-full"
          >
            {snapshot ? "Autofill from snapshot" : "Autofill (defaults)"}
          </Button>
        </div>
      </div>
    </div>
  );
}
