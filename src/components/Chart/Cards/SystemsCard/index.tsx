import { useEffect, useRef, useState } from "react";

import SelectionPill from "@/components/ui/SelectionPill";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";
import { meetCondition } from "@/state/slices/flowReducer";
import {
  addSelectedSystem,
  clearSelectedSystems,
  getSystemCodeFor,
  removeSelectedSystem,
  type SystemRecord,
} from "@/state/slices/reportReducer";
import type { RootState } from "@/state/store";
import { cn } from "@/utils/cn";
import { getCachedJson } from "@/utils/prefetchRefData";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { StepCardProps } from "../../StepRenderer";
import { dedupeSystems, sanitizeName } from "./utils";

function SystemsSection({
  systems,
  activeService,
  onServiceChange,
  selectedSystemCodes,
  onToggle,
  onClearAll,
  onClearClassification,
}: Readonly<{
  systems: SystemRecord[];
  activeService: string | null;
  onServiceChange: (s: string) => void;
  selectedSystemCodes: Set<string | undefined>;
  onToggle: (system: SystemRecord) => void;
  onClearAll: () => void;
  onClearClassification: (classification: string) => () => void;
}>) {
  const { locale, t } = useTranslation();
  const listboxRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const serviceNames = [
    ...new Set(systems.map((s) => s.Services as string).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
  const systemsForService = activeService
    ? systems.filter((s) => s.Services === activeService)
    : [];
  const classificationNames = [
    ...new Set(
      systemsForService.map((s) => s["ASTM.Name"] as string).filter(Boolean),
    ),
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <em className="text-muted-foreground text-sm">
          {t("inventory.selectOnly")}
        </em>
        {selectedSystemCodes.size > 0 && (
          <Button
            variant="muted"
            size="sm"
            onClick={() => {
              onClearAll();
            }}
            aria-label={t("common.clearAllSelected", {
              count: selectedSystemCodes.size,
            })}
          >
            <X className="size-3" aria-hidden />
            {t("common.clearAll", { count: selectedSystemCodes.size })}
          </Button>
        )}
      </div>
      <div className="border-secondary/30 mb-5 flex flex-wrap gap-2 border-b pb-2">
        {serviceNames.map((service) => {
          const selectedCount = systems
            .filter((s) => s.Services === service)
            .filter((s) => selectedSystemCodes.has(getSystemCodeFor(s))).length;

          return (
            <Button
              variant={activeService === service ? "default" : "outline-muted"}
              size="pill"
              key={service}
              onClick={() => onServiceChange(service)}
              className="shrink-0 rounded-full whitespace-nowrap"
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
            </Button>
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
                <h3 className="text-primary text-xs font-semibold tracking-wide uppercase">
                  {sanitizeName(classification)}
                </h3>
                {selectedCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClearClassification(classification)();
                      listboxRefs.current[classification]?.focus();
                    }}
                    aria-label={t("common.clearClassificationSelected", {
                      count: selectedCount,
                      classification: sanitizeName(classification),
                    })}
                    className="h-auto px-0 text-xs text-muted-foreground hover:text-destructive"
                  >
                    {t("common.clearCount", { count: selectedCount })}
                  </Button>
                )}
              </div>
              <TooltipProvider>
                <div
                  role="group"
                  aria-label={sanitizeName(classification)}
                  ref={(el) => {
                    listboxRefs.current[classification] = el;
                  }}
                  className="flex flex-wrap gap-2"
                >
                  {systemsInClass.map((system, i) => {
                    const code = getSystemCodeFor(system);
                    const description =
                      (((locale as string) === "fr-CA"
                        ? (system["DescriptionFr"] as string)
                        : (system["Description"] as string)) ||
                        (system["Description"] as string)) ??
                      "";

                    if (!description) {
                      return (
                        <SelectionPill
                          key={code}
                          name={sanitizeName(
                            system["ASTM.System.Name"] as string,
                          )}
                          code={
                            (system["ASTM.System.Code"] as string) ??
                            (system["ASTM.Code"] as string)
                          }
                          isSelected={selectedSystemCodes.has(code)}
                          onToggle={() => onToggle(system)}
                          tabIndex={i === 0 ? 0 : -1}
                        />
                      );
                    }

                    return (
                      <Tooltip key={code}>
                        <TooltipTrigger asChild>
                          <SelectionPill
                            key={code}
                            name={sanitizeName(
                              system["ASTM.System.Name"] as string,
                            )}
                            code={
                              (system["ASTM.System.Code"] as string) ??
                              (system["ASTM.Code"] as string)
                            }
                            isSelected={selectedSystemCodes.has(code)}
                            showInfoIcon
                            onToggle={() => onToggle(system)}
                            tabIndex={i === 0 ? 0 : -1}
                          />
                        </TooltipTrigger>
                        <TooltipContent>{description}</TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SystemsCard({ step }: Readonly<StepCardProps>) {
  const [availableSystems, setAvailableSystems] = useState<
    SystemRecord[] | null
  >(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedSystems = useSelector(
    (state: RootState) => state.report.selectedSystems,
  );

  const selectedSystemCodes = new Set(selectedSystems.map(getSystemCodeFor));

  const toggleSystem = (system: SystemRecord) => {
    const code = getSystemCodeFor(system);
    if (!code) return;
    if (selectedSystemCodes.has(code)) {
      dispatch(removeSelectedSystem(code));
    } else {
      dispatch(addSelectedSystem(system));
    }
  };

  const clearForClassification = (classification: string) => () => {
    if (!availableSystems) return;
    availableSystems
      .filter((s) => s["ASTM.Name"] === classification)
      .map(getSystemCodeFor)
      .filter((code): code is string => !!code && selectedSystemCodes.has(code))
      .forEach((code) => dispatch(removeSelectedSystem(code)));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCachedJson<SystemRecord[]>(
          `${import.meta.env.VITE_API_HOST}/codes/building_services/ref`,
        );
        if (cancelled) return;
        const unique = dedupeSystems(data);
        setAvailableSystems(unique);

        const services = Array.from(
          new Set(unique.map((s) => s.Services as string).filter(Boolean)),
        ).sort((a, b) => a.localeCompare(b));

        setActiveService(services[0] ?? null);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!step?.name) return;
    dispatch(
      meetCondition({
        name: step.name,
        condition: selectedSystems.length > 0,
      }),
    );
  }, [selectedSystems.length, step?.name, dispatch]);

  if (error)
    return (
      <div>
        <p className="text-destructive text-sm">
          {t("inventory.systems.loadError", { message: error })}
        </p>
      </div>
    );

  if (!availableSystems)
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-6 w-44 rounded" />
        <div className="border-border flex flex-wrap gap-2 border-b pb-3">
          {[88, 112, 80].map((w) => (
            <Skeleton
              key={w}
              className="h-9 rounded-full"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-20 rounded" />
          <div className="flex flex-wrap gap-2">
            {[96, 124, 80, 144, 100, 116].map((w, i) => (
              <Skeleton
                key={`${w}-${i}`}
                className="h-8 rounded-md"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <SystemsSection
        systems={availableSystems}
        activeService={activeService}
        onServiceChange={setActiveService}
        selectedSystemCodes={selectedSystemCodes}
        onToggle={toggleSystem}
        onClearAll={() => dispatch(clearSelectedSystems())}
        onClearClassification={clearForClassification}
      />
    </div>
  );
}
