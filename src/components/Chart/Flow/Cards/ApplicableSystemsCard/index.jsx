import { useEffect, useEffectEvent, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  addSelectedSystem,
  clearSelectedSystems,
  removeSelectedSystem,
} from "@/state/slices/reportReducer";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SystemPill from "./SystemItemCard";

function sanitizeName(name) {
  if (!name) return "N/A";
  return name.replace(/_/g, " ");
}

function getItemKey(element) {
  return `${element["Services"]}-${element["Classification"]}-${element["ASTMName"]}-${element["ASTMSystemName"]}`;
}

function cleanAvailableSystems(systems) {
  const uniqueKeys = new Set();
  const cleanedSystems = [];

  for (const system of systems) {
    const key = getItemKey(system);
    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      cleanedSystems.push({
        Services: system["Services"],
        Classification: system["Classification"],
        ASTMName: system["ASTM.Name"],
        ASTMSystemName: system["ASTM.System.Name"],
        ASTMSystemCode: system["ASTM.System.Code"],
      });
    }
  }

  return cleanedSystems;
}

export default function ApplicableSystemsCard() {
  const [availableSystems, setAvailableSystems] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const selectedSystems = useSelector((state) => state.report.selectedSystems);

  const toggleSystem = (id) => {
    if (selectedSystems.includes(id)) {
      dispatch(removeSelectedSystem(id));
    } else {
      dispatch(addSelectedSystem(id));
    }
  };

  const clearAllSelections = () => {
    dispatch(clearSelectedSystems());
  };

  const clearForClassification = (classification) => () => {
    if (!availableSystems) return;
    availableSystems
      .filter((s) => s.Classification === classification)
      .map((s) => getItemKey(s))
      .filter((key) => selectedSystems.includes(key))
      .forEach((key) => dispatch(removeSelectedSystem(key)));
  };

  const fetchSystems = useEffectEvent(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/codes/building_services/ref`,
      );
      if (!response.ok) throw new Error("Failed to fetch systems");
      const data = await response.json();
      const cleaned = cleanAvailableSystems(data);
      setAvailableSystems(cleaned);
      setActiveService(cleaned[0]?.Services ?? null);
    } catch (err) {
      setError(err.message);
    }
  });

  useEffect(() => {
    fetchSystems();
  }, []);

  if (error)
    return (
      <div>
        <h2 className="heading-card mb-2">Applicable Systems</h2>
        <p className="text-sm text-destructive">Error loading systems: {error}</p>
      </div>
    );

  if (!availableSystems)
    return (
      <div className="flex flex-col gap-5">
        {/* Heading */}
        <Skeleton className="h-6 w-44 rounded" />

        {/* Service tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-border">
          {[88, 112, 80].map((w) => (
            <Skeleton key={w} className="h-9 rounded-full" style={{ width: w }} />
          ))}
        </div>

        {/* Classification group 1 — ~6 pills */}
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-20 rounded" />
          <div className="flex flex-wrap gap-2">
            {[96, 124, 80, 144, 100, 116].map((w, i) => (
              <Skeleton key={i} className="h-8 rounded-md" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Classification group 2 — ~4 pills */}
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-28 rounded" />
          <div className="flex flex-wrap gap-2">
            {[108, 76, 130, 92].map((w, i) => (
              <Skeleton key={i} className="h-8 rounded-md" style={{ width: w }} />
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
    ...new Set(systemsForService.map((s) => s.Classification)),
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-card">Applicable Systems</h2>
        {selectedSystems.length > 0 && (
          <button
            onClick={clearAllSelections}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="size-3" />
            Clear all ({selectedSystems.length})
          </button>
        )}
      </div>

      {/* Service tabs */}
      <div className="flex flex-wrap gap-2 pb-2 mb-5 border-b border-golden-accent/30">
        {uniqueServices.map((service) => {
          const selectedCount = availableSystems
            .filter((s) => s.Services === service)
            .filter((s) => selectedSystems.includes(getItemKey(s))).length;

          return (
            <button
              key={service}
              onClick={() => setActiveService(service)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
                activeService === service
                  ? "bg-moss-primary text-white border-moss-primary"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-golden-accent/60",
              )}
            >
              {sanitizeName(service)}
              {selectedCount > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-semibold",
                    activeService === service
                      ? "bg-white text-moss-primary"
                      : "bg-moss-primary/10 text-moss-primary",
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
        {classificationsForService.map((classification) => {
          const systemsInClass = systemsForService.filter(
            (s) => s.Classification === classification,
          );
          const selectedCount = systemsInClass.filter((s) =>
            selectedSystems.includes(getItemKey(s)),
          ).length;

          return (
            <div key={classification}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-teal-deep/60 uppercase tracking-wide">
                  {sanitizeName(classification)}
                </h3>
                {selectedCount > 0 && (
                  <button
                    onClick={clearForClassification(classification)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear {selectedCount}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {systemsInClass.map((system) => {
                  const key = getItemKey(system);
                  return (
                    <SystemPill
                      key={key}
                      system={system}
                      isSelected={selectedSystems.includes(key)}
                      onToggle={() => toggleSystem(key)}
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
