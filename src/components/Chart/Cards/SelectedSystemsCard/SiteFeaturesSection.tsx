import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";
import { cn } from "@/utils/cn";
import {
  getFeatureKeyFor,
  type FeatureRecord,
} from "@/state/slices/reportReducer";
import { X } from "lucide-react";
import SelectionPill from "./SelectionPill";
import { sanitizeName } from "./utils";

type Props = {
  features: FeatureRecord[];
  activeCategory: string | null;
  onCategoryChange: (c: string) => void;
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
}: Props) {
  const categoryNames = [
    ...new Set(features.map((f) => f.Category as string).filter(Boolean)),
  ].sort();
  const featuresForCategory = activeCategory
    ? features.filter((f) => f.Category === activeCategory)
    : [];

  const { locale, t } = useTranslation();

  return (
    <div>
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="heading-card">{t("inventory.siteFeatures.heading")}</h2>
        {selectedFeatureCodes.size > 0 && (
          <button
            onClick={onClearAll}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs transition-colors"
          >
            <X className="size-3" />
            {t("common.clearAll", { count: selectedFeatureCodes.size })}
          </button>
        )}
      </div>

      <div className="border-golden-accent/30 mb-5 flex flex-wrap gap-2 border-b pb-2">
        {categoryNames.map((category) => {
          const selectedCount = features
            .filter((f) => f.Category === category)
            .filter((f) => selectedFeatureCodes.has(getFeatureKeyFor(f))).length;

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground border-border hover:text-foreground hover:border-golden-accent/60 bg-transparent",
              )}
            >
              {sanitizeName(category)}
              {selectedCount > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-semibold",
                    activeCategory === category
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

      <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {featuresForCategory.map((feature) => {
            const code = getFeatureKeyFor(feature);
            const description =
              (((locale as string) === "fr-CA"
                ? (feature["DescriptionFr"] as string)
                : (feature["Description"] as string)) ||
                (feature["Description"] as string)) ?? "";

            if (!description) {
              return (
                <SelectionPill
                  key={code}
                  name={sanitizeName(feature["Site.Feature.Name"] as string)}
                  code={feature["ID"]}
                  isSelected={selectedFeatureCodes.has(code)}
                  onToggle={() => onToggle(feature)}
                />
              );
            }

            return (
              <Tooltip key={code}>
                <TooltipTrigger asChild>
                  <SelectionPill
                    name={sanitizeName(feature["Site.Feature.Name"] as string)}
                    code={feature["ID"]}
                    isSelected={selectedFeatureCodes.has(code)}
                    onToggle={() => onToggle(feature)}
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
}
