import { cn } from "@/lib/utils";
import { getSystemCodeFor } from "@/state/slices/reportReducer";
import { X } from "lucide-react";
import SelectionPill from "./SelectionPill";
import { sanitizeName } from "./utils";

export default function SystemsSection({
  systems,
  activeService,
  onServiceChange,
  selectedSystemCodes,
  onToggle,
  onClearAll,
  onClearClassification,
}) {
  const serviceNames = [...new Set(systems.map((s) => s.Services))].sort();
  const systemsForService = activeService
    ? systems.filter((s) => s.Services === activeService)
    : [];
  const classificationNames = [
    ...new Set(systemsForService.map((s) => s["ASTM.Name"])),
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="heading-card">Systems</h2>
        {selectedSystemCodes.size > 0 && (
          <button
            onClick={onClearAll}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs transition-colors"
          >
            <X className="size-3" />
            Clear all ({selectedSystemCodes.size})
          </button>
        )}
      </div>

      <div className="border-golden-accent/30 mb-5 flex flex-wrap gap-2 border-b pb-2">
        {serviceNames.map((service) => {
          const selectedCount = systems
            .filter((s) => s.Services === service)
            .filter((s) => selectedSystemCodes.has(getSystemCodeFor(s))).length;

          return (
            <button
              key={service}
              onClick={() => onServiceChange(service)}
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

      <div className="space-y-5">
        {classificationNames.map((classification) => {
          const systemsInClass = systemsForService.filter(
            (s) => s["ASTM.Name"] === classification,
          );
          const selectedCount = systemsInClass.filter((s) =>
            selectedSystemCodes.has(getSystemCodeFor(s)),
          ).length;

          return (
            <div key={classification}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-teal-deep text-xs font-semibold tracking-wide uppercase">
                  {sanitizeName(classification)}
                </h3>
                {selectedCount > 0 && (
                  <button
                    onClick={onClearClassification(classification)}
                    className="text-muted-foreground hover:text-destructive text-xs transition-colors"
                  >
                    Clear {selectedCount}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {systemsInClass.map((system) => {
                  const code = getSystemCodeFor(system);
                  return (
                    <SelectionPill
                      key={code}
                      name={sanitizeName(system["ASTM.System.Name"])}
                      code={system["ASTM.System.Code"] ?? system["ASTM.Code"]}
                      isSelected={selectedSystemCodes.has(code)}
                      onToggle={() => onToggle(system)}
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
