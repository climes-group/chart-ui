import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";
import {
  getSystemCodeFor,
  type SystemRecord,
} from "@/state/slices/reportReducer";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import { useRef } from "react";
import SelectionPill from "./SelectionPill";
import { handleListboxKeyDown, sanitizeName } from "./utils";

type Props = {
  systems: SystemRecord[];
  activeService: string | null;
  onServiceChange: (s: string) => void;
  selectedSystemCodes: Set<string | undefined>;
  onToggle: (system: SystemRecord) => void;
  onClearAll: () => void;
  onClearClassification: (classification: string) => () => void;
};

export default function SystemsSection({
  systems,
  activeService,
  onServiceChange,
  selectedSystemCodes,
  onToggle,
  onClearAll,
  onClearClassification,
}: Readonly<Props>) {
  const { locale, t } = useTranslation();
  const headingRef = useRef<HTMLHeadingElement>(null);
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
        <h2 className="heading-card" ref={headingRef} tabIndex={-1}>
          {t("inventory.systems.heading")}
        </h2>
        {selectedSystemCodes.size > 0 && (
          <button
            type="button"
            onClick={() => {
              onClearAll();
              headingRef.current?.focus();
            }}
            aria-label={t("common.clearAllSelected", {
              count: selectedSystemCodes.size,
            })}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs transition-colors"
          >
            <X className="size-3" aria-hidden />
            {t("common.clearAll", { count: selectedSystemCodes.size })}
          </button>
        )}
      </div>
      <p>
        <em className="text-muted-foreground text-sm">
          {t("inventory.selectOnly")}
        </em>
      </p>
      <div className="border-golden-accent/30 mb-5 flex flex-wrap gap-2 border-b pb-2">
        {serviceNames.map((service) => {
          const selectedCount = systems
            .filter((s) => s.Services === service)
            .filter((s) => selectedSystemCodes.has(getSystemCodeFor(s))).length;

          return (
            <button
              type="button"
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
                    type="button"
                    onClick={() => {
                      onClearClassification(classification)();
                      listboxRefs.current[classification]?.focus();
                    }}
                    aria-label={t("common.clearClassificationSelected", {
                      count: selectedCount,
                      classification: sanitizeName(classification),
                    })}
                    className="text-muted-foreground hover:text-destructive text-xs transition-colors"
                  >
                    {t("common.clearCount", { count: selectedCount })}
                  </button>
                )}
              </div>
              <TooltipProvider>
                <div
                  role="listbox"
                  aria-multiselectable="true"
                  aria-label={sanitizeName(classification)}
                  onKeyDown={handleListboxKeyDown}
                  tabIndex={-1}
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
