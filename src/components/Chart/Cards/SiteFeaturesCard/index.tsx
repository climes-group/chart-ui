import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
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
import { getCachedJson } from "@/utils/prefetchRefData";
import { useDispatch, useSelector } from "react-redux";
import type { StepCardProps } from "../../StepRenderer";
import SiteFeaturesSection from "../SelectedSystemsCard/SiteFeaturesSection";
import { dedupeSiteFeatures } from "../SelectedSystemsCard/utils";

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
