import { useEffect, useEffectEvent, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { meetCondition } from "@/state/slices/flowReducer";
import {
  addSelectedSystem,
  clearSelectedSystems,
  removeSelectedSystem,
  selectedSystemCode,
} from "@/state/slices/reportReducer";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SystemPill from "./SystemItemCard";

function sanitizeName(name) {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replace(/_/g, " ");
}

function dedupeSystems(systems) {
  const seen = new Set();
  const unique = [];
  for (const system of systems) {
    const key = selectedSystemCode(system);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(system);
  }
  return unique;
}

export default function SelectedSystemsCard({ activeStep }) {
  const [availableSystems, setAvailableSystems] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const selectedSystems = useSelector((state) => state.report.selectedSystems);

  const selectedCodes = new Set(selectedSystems.map(selectedSystemCode));

  const toggleSystem = (system) => {
    const code = selectedSystemCode(system);
    if (selectedCodes.has(code)) {
      dispatch(removeSelectedSystem(code));
    } else {
      dispatch(addSelectedSystem(system));
    }
  };

  const clearAllSelections = () => {
    dispatch(clearSelectedSystems());
  };

  const clearForClassification = (classification) => () => {
    if (!availableSystems) return;
    availableSystems
      .filter((s) => s.Classification === classification)
      .map(selectedSystemCode)
      .filter((code) => selectedCodes.has(code))
      .forEach((code) => dispatch(removeSelectedSystem(code)));
  };

  const fetchSystems = useEffectEvent(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/codes/building_services/ref`,
      );
      if (!response.ok) throw new Error("Failed to fetch systems");
      const data = await response.json();
      const unique = dedupeSystems(data);
      setAvailableSystems(unique);
      setActiveService(unique[0]?.Services ?? null);
    } catch (err) {
      setError(err.message);
    }
  });

  useEffect(() => {
    fetchSystems();
  }, []);

  useEffect(() => {
    if (!activeStep?.name) return;
    dispatch(
      meetCondition({
        name: activeStep.name,
        condition: selectedSystems.length > 0,
      }),
    );
  }, [selectedSystems.length, activeStep?.name]);

  if (error)
    return (
      <div>
        <h2 className="heading-card mb-2">Selected Systems</h2>
        <p className="text-destructive text-sm">
          Error loading systems: {error}
        </p>
      </div>
    );

  if (!availableSystems)
    return (
      <div className="flex flex-col gap-5">
        {/* Heading */}
        <Skeleton className="h-6 w-44 rounded" />

        {/* Service tabs */}
        <div className="border-border flex flex-wrap gap-2 border-b pb-3">
          {[88, 112, 80].map((w) => (
            <Skeleton
              key={w}
              className="h-9 rounded-full"
              style={{ width: w }}
            />
          ))}
        </div>

        {/* Classification group 1 — ~6 pills */}
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-20 rounded" />
          <div className="flex flex-wrap gap-2">
            {[96, 124, 80, 144, 100, 116].map((w, i) => (
              <Skeleton
                key={i}
                className="h-8 rounded-md"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>

        {/* Classification group 2 — ~4 pills */}
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-28 rounded" />
          <div className="flex flex-wrap gap-2">
            {[108, 76, 130, 92].map((w, i) => (
              <Skeleton
                key={i}
                className="h-8 rounded-md"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>
    );

  const uniqueServices = [
    ...new Set(availableSystems.map((s) => s.Services)),
  ].sort();

  const systemsForService = activeService
    ? availableSystems.filter((s) => s.Services === activeService)
    : [];

  const classificationsForService = [
    ...new Set(systemsForService.map((s) => s["ASTM.Name"])),
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="heading-card">Selected Systems</h2>
        {selectedSystems.length > 0 && (
          <button
            onClick={clearAllSelections}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs transition-colors"
          >
            <X className="size-3" />
            Clear all ({selectedSystems.length})
          </button>
        )}
      </div>

      {/* Service tabs */}
      <div className="border-golden-accent/30 mb-5 flex flex-wrap gap-2 border-b pb-2">
        {uniqueServices.map((service) => {
          const selectedCount = availableSystems
            .filter((s) => s.Services === service)
            .filter((s) => selectedCodes.has(selectedSystemCode(s))).length;

          return (
            <button
              key={service}
              onClick={() => setActiveService(service)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                activeService === service
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground border-border hover:text-foreground hover:border-golden-accent/60 bg-transparent",
              )}
            >
              {sanitizeName(service)}
              {selectedCount > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-semibold",
                    activeService === service
                      ? "bg-background text-primary"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {selectedCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Systems grouped by Classification */}
      <div className="space-y-5">
        {classificationsForService.map((astmName) => {
          const systemsInClass = systemsForService.filter(
            (s) => s["ASTM.Name"] === astmName,
          );
          const selectedCount = systemsInClass.filter((s) =>
            selectedCodes.has(selectedSystemCode(s)),
          ).length;

          return (
            <div key={astmName}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-teal-deep text-xs font-semibold tracking-wide uppercase">
                  {sanitizeName(astmName)}
                </h3>
                {selectedCount > 0 && (
                  <button
                    onClick={clearForClassification(astmName)}
                    className="text-muted-foreground hover:text-destructive text-xs transition-colors"
                  >
                    Clear {selectedCount}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {systemsInClass.map((system) => {
                  const code = selectedSystemCode(system);
                  return (
                    <SystemPill
                      key={code}
                      system={system}
                      isSelected={selectedCodes.has(code)}
                      onToggle={() => toggleSystem(system)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
