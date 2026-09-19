import { useEffect, useState } from "react";

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
  addSelectedFeature,
  clearSelectedFeatures,
  getFeatureKeyFor,
  removeSelectedFeature,
  type FeatureRecord,
} from "@/state/slices/reportReducer";
import type { RootState } from "@/state/store";
import { cn } from "@/utils/cn";
import { getCachedJson } from "@/utils/prefetchRefData";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { StepCardProps } from "../../StepRenderer";
import {
  dedupeSiteFeatures,
  handleListboxKeyDown,
  sanitizeName,
} from "./utils";

function SiteFeaturesSection({
  features,
  activeCategory,
  onCategoryChange,
  selectedFeatureCodes,
  onToggle,
  onClearAll,
}: Readonly<{
  features: FeatureRecord[];
  activeCategory: string | null;
  onCategoryChange: (c: string) => void;
  selectedFeatureCodes: Set<string | undefined>;
  onToggle: (feature: FeatureRecord) => void;
  onClearAll: () => void;
}>) {
  const categoryNames = [
    ...new Set(features.map((f) => f.Category as string).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
  const featuresForCategory = activeCategory
    ? features.filter((f) => f.Category === activeCategory)
    : [];

  const { locale, t } = useTranslation();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <em className="text-muted-foreground text-sm">
          {t("inventory.selectOnly")}
        </em>
        {selectedFeatureCodes.size > 0 && (
          <Button
            variant="muted"
            size="sm"
            onClick={() => {
              onClearAll();
            }}
          >
            <X className="size-3" />
            {t("common.clearAll", { count: selectedFeatureCodes.size })}
          </Button>
        )}
      </div>

      <div className="border-secondary/30 mb-5 flex flex-wrap gap-2 border-b pb-2">
        {categoryNames.map((category) => {
          const selectedCount = features
            .filter((f) => f.Category === category)
            .filter((f) =>
              selectedFeatureCodes.has(getFeatureKeyFor(f)),
            ).length;

          return (
            <Button
              variant={activeCategory === category ? "default" : "outline-muted"}
              size="pill"
              key={category}
              onClick={() => onCategoryChange(category)}
              className="shrink-0 rounded-full whitespace-nowrap"
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
            </Button>
          );
        })}
      </div>

      <TooltipProvider>
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label={sanitizeName(activeCategory)}
          onKeyDown={handleListboxKeyDown}
          tabIndex={-1}
          className="flex flex-wrap gap-2"
        >
          {featuresForCategory.map((feature) => {
            const code = getFeatureKeyFor(feature);
            const description =
              (((locale as string) === "fr-CA"
                ? (feature["DescriptionFr"] as string)
                : (feature["Description"] as string)) ||
                (feature["Description"] as string)) ??
              "";

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
                    showInfoIcon
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

export default function SiteFeaturesCard({ step }: Readonly<StepCardProps>) {
  const [availableFeatures, setAvailableFeatures] = useState<
    FeatureRecord[] | null
  >(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedSiteFeatures = useSelector(
    (state: RootState) => state.report.selectedSiteFeatures,
  );

  const selectedFeatureCodes = new Set(
    selectedSiteFeatures.map(getFeatureKeyFor),
  );

  const toggleFeature = (feature: FeatureRecord) => {
    const code = getFeatureKeyFor(feature);
    if (!code) return;
    if (selectedFeatureCodes.has(code)) {
      dispatch(removeSelectedFeature(code));
    } else {
      dispatch(addSelectedFeature(feature));
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCachedJson<FeatureRecord[]>(
          `${import.meta.env.VITE_API_HOST}/codes/site_features/ref`,
        );
        if (cancelled) return;
        const unique = dedupeSiteFeatures(data);
        setAvailableFeatures(unique);

        const categories = Array.from(
          new Set(unique.map((f) => f.Category as string).filter(Boolean)),
        ).sort((a, b) => a.localeCompare(b));

        setActiveCategory(categories[0] ?? null);
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
        condition: selectedSiteFeatures.length >= 0,
      }),
    );
  }, [selectedSiteFeatures.length, step?.name, dispatch]);

  if (error)
    return (
      <div>
        <p className="text-destructive text-sm">
          {t("inventory.systems.loadError", { message: error })}
        </p>
      </div>
    );

  if (!availableFeatures)
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
      <SiteFeaturesSection
        features={availableFeatures}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        selectedFeatureCodes={selectedFeatureCodes}
        onToggle={toggleFeature}
        onClearAll={() => dispatch(clearSelectedFeatures())}
      />
    </div>
  );
}
