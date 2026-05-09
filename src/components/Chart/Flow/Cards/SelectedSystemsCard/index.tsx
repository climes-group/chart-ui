import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n";
import { meetCondition } from "@/state/slices/flowReducer";
import {
  addSelectedFeature,
  addSelectedSystem,
  clearSelectedFeatures,
  clearSelectedSystems,
  getFeatureKeyFor,
  getSystemCodeFor,
  removeSelectedFeature,
  removeSelectedSystem,
  type FeatureRecord,
  type SystemRecord,
} from "@/state/slices/reportReducer";
import type { RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import type { StepCardProps } from "../../StepRenderer";
import SiteFeaturesSection from "./SiteFeaturesSection";
import SystemsSection from "./SystemsSection";
import { dedupeSiteFeatures, dedupeSystems } from "./utils";

export default function SelectedSystemsCard({ activeStep }: StepCardProps) {
  const [availableSystems, setAvailableSystems] = useState<
    SystemRecord[] | null
  >(null);
  const [availableFeatures, setAvailableFeatures] = useState<
    FeatureRecord[] | null
  >(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedSystems = useSelector(
    (state: RootState) => state.report.selectedSystems,
  );
  const selectedSiteFeatures = useSelector(
    (state: RootState) => state.report.selectedSiteFeatures,
  );

  const selectedSystemCodes = new Set(selectedSystems.map(getSystemCodeFor));
  const selectedFeatureCodes = new Set(
    selectedSiteFeatures.map(getFeatureKeyFor),
  );

  const toggleSystem = (system: SystemRecord) => {
    const code = getSystemCodeFor(system);
    if (!code) return;
    if (selectedSystemCodes.has(code)) {
      dispatch(removeSelectedSystem(code));
    } else {
      dispatch(addSelectedSystem(system));
    }
  };

  const toggleFeature = (feature: FeatureRecord) => {
    const code = getFeatureKeyFor(feature);
    if (!code) return;
    if (selectedFeatureCodes.has(code)) {
      dispatch(removeSelectedFeature(code));
    } else {
      dispatch(addSelectedFeature(feature));
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
        const response = await fetch(
          `${import.meta.env.VITE_API_HOST}/codes/building_services/ref`,
        );
        if (!response.ok) throw new Error("Failed to fetch systems");
        const data = (await response.json()) as SystemRecord[];
        if (cancelled) return;
        const unique = dedupeSystems(data);
        setAvailableSystems(unique);

        const services = Array.from(
          new Set(
            unique.map((s) => s.Services as string).filter(Boolean),
          ),
        ).sort();

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
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_HOST}/codes/site_features/ref`,
        );
        if (!response.ok) throw new Error("Failed to fetch site features");
        const data = (await response.json()) as FeatureRecord[];
        if (cancelled) return;
        const unique = dedupeSiteFeatures(data);
        setAvailableFeatures(unique);

        const categories = Array.from(
          new Set(
            unique.map((f) => f.Category as string).filter(Boolean),
          ),
        ).sort();

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
    if (!activeStep?.name) return;
    dispatch(
      meetCondition({
        name: activeStep.name,
        condition: selectedSystems.length > 0,
      }),
    );
  }, [selectedSystems.length, activeStep?.name, dispatch]);

  if (error)
    return (
      <div>
        <h2 className="heading-card mb-2">{t("inventory.systems.heading")}</h2>
        <p className="text-destructive text-sm">
          {t("inventory.systems.loadError", { message: error })}
        </p>
      </div>
    );

  if (!availableSystems || !availableFeatures)
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
                key={i}
                className="h-8 rounded-md"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
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
