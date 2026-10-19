import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";
import { getFeatureKeyFor, type FeatureRecord } from "@/state/slices/reportReducer";
import { getDescription, sanitizeName } from "../utils";
import InventoryCategoryTabs from "../InventoryCategoryTabs";
import InventoryItemPill from "../InventoryItemPill";
import { X } from "lucide-react";

type SiteFeaturesSectionProps = {
  features: FeatureRecord[];
  activeCategory: string | null;
  onCategoryChange: (category: string) => void;
  selectedFeatureCodes: Set<string | undefined>;
  onToggle: (feature: FeatureRecord) => void;
  onClearAll: () => void;
};

export default function SiteFeaturesSection({
  features,
  activeCategory,
  onCategoryChange,
  selectedFeatureCodes,
  onToggle,
  onClearAll,
}: Readonly<SiteFeaturesSectionProps>) {
  const categoryNames = [
    ...new Set(features.map((feature) => feature.Category as string).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
  const featuresForCategory = activeCategory
    ? features.filter((feature) => feature.Category === activeCategory)
    : [];

  const { locale, t } = useTranslation();

  return (
    <div>
      <div className="mb-4 flex min-h-[2.25rem] items-center justify-between">
        <em className="text-muted-foreground text-sm">
          {t("inventory.selectOnly")}
        </em>
        {selectedFeatureCodes.size > 0 && (
          <Button
            variant="muted"
            size="sm"
            onClick={onClearAll}
          >
            <X aria-hidden />
            {t("common.clearAll", { count: selectedFeatureCodes.size })}
          </Button>
        )}
      </div>

      <InventoryCategoryTabs
        categories={categoryNames}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        getSelectedCount={(category) =>
          features
            .filter((feature) => feature.Category === category)
            .filter((feature) =>
              selectedFeatureCodes.has(getFeatureKeyFor(feature)),
            ).length
        }
      />

      <TooltipProvider>
        <div
          role="group"
          aria-label={sanitizeName(activeCategory)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuresForCategory.map((feature) => {
            const code = getFeatureKeyFor(feature);
            return (
              <InventoryItemPill
                key={code}
                name={sanitizeName(feature["Site.Feature.Name"] as string)}
                code={feature["ID"]}
                isSelected={selectedFeatureCodes.has(code)}
                description={getDescription(feature, locale as string)}
                onToggle={() => onToggle(feature)}
              />
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
