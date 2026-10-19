import { useRef } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";
import {
  getSystemCodeFor,
  type SystemRecord,
} from "@/state/slices/reportReducer";
import InventoryCategoryTabs from "../InventoryCategoryTabs";
import InventoryItemPill from "../InventoryItemPill";
import { getDescription, sanitizeName } from "../utils";

type SystemsSectionProps = {
  systems: SystemRecord[];
  activeService: string | null;
  onServiceChange: (service: string) => void;
  selectedSystemCodes: Set<string | undefined>;
  onToggle: (system: SystemRecord) => void;
  onClearAll: () => void;
  onClearClassification: (classification: string) => void;
};

export default function SystemsSection({
  systems,
  activeService,
  onServiceChange,
  selectedSystemCodes,
  onToggle,
  onClearAll,
  onClearClassification,
}: Readonly<SystemsSectionProps>) {
  const { locale, t } = useTranslation();
  const listboxRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const serviceNames = [
    ...new Set(systems.map((system) => system.Services as string).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
  const systemsForService = activeService
    ? systems.filter((system) => system.Services === activeService)
    : [];
  const classificationNames = [
    ...new Set(
      systemsForService
        .map((system) => system["ASTM.Name"] as string)
        .filter(Boolean),
    ),
  ];

  return (
    <div>
      <div className="mb-4 flex min-h-[2.25rem] items-center justify-between">
        <em className="text-muted-foreground text-sm">
          {t("inventory.selectOnly")}
        </em>
        {selectedSystemCodes.size > 0 && (
          <Button
            variant="muted"
            size="sm"
            onClick={onClearAll}
            aria-label={t("common.clearAllSelected", {
              count: selectedSystemCodes.size,
            })}
          >
            <X aria-hidden />
            {t("common.clearAll", { count: selectedSystemCodes.size })}
          </Button>
        )}
      </div>

      <InventoryCategoryTabs
        categories={serviceNames}
        activeCategory={activeService}
        onCategoryChange={onServiceChange}
        getSelectedCount={(service) =>
          systems
            .filter((system) => system.Services === service)
            .filter((system) =>
              selectedSystemCodes.has(getSystemCodeFor(system)),
            ).length
        }
      />

      <div className="space-y-5">
        {classificationNames.map((classification) => {
          const systemsInClass = systemsForService.filter(
            (system) => system["ASTM.Name"] === classification,
          );
          const selectedCount = systemsInClass.filter((system) =>
            selectedSystemCodes.has(getSystemCodeFor(system)),
          ).length;

          return (
            <div key={classification}>
              <div className="mb-2 flex min-h-[2.25rem] items-center justify-between">
                <h3 className="text-primary mb-0 text-sm font-semibold tracking-wide uppercase">
                  {sanitizeName(classification)}
                </h3>
                {selectedCount > 0 && (
                  <Button
                    variant="muted"
                    size="sm"
                    onClick={() => {
                      onClearClassification(classification);
                      listboxRefs.current[classification]?.focus();
                    }}
                    aria-label={t("common.clearClassificationSelected", {
                      count: selectedCount,
                      classification: sanitizeName(classification),
                    })}
                  >
                    <X aria-hidden />
                    {t("common.clearCount", { count: selectedCount })}
                  </Button>
                )}
              </div>
              <TooltipProvider>
                <div
                  role="group"
                  aria-label={sanitizeName(classification)}
                  ref={(element) => {
                    listboxRefs.current[classification] = element;
                  }}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {systemsInClass.map((system, index) => {
                    const code = getSystemCodeFor(system);
                    return (
                      <InventoryItemPill
                        key={code}
                        name={sanitizeName(
                          system["ASTM.System.Name"] as string,
                        )}
                        code={
                          (system["ASTM.System.Code"] as string) ??
                          (system["ASTM.Code"] as string)
                        }
                        isSelected={selectedSystemCodes.has(code)}
                        description={getDescription(system, locale as string)}
                        onToggle={() => onToggle(system)}
                        tabIndex={index === 0 ? 0 : -1}
                      />
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
