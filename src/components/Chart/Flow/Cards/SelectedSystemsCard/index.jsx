import { useEffect, useEffectEvent, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
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
} from "@/state/slices/reportReducer";
import { useDispatch, useSelector } from "react-redux";
import SiteFeaturesSection from "./SiteFeaturesSection";
import SystemsSection from "./SystemsSection";
import { dedupeSiteFeatures, dedupeSystems } from "./utils";

export default function SelectedSystemsCard({ activeStep }) {
  const [availableSystems, setAvailableSystems] = useState(null);
  const [availableFeatures, setAvailableFeatures] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const selectedSystems = useSelector((state) => state.report.selectedSystems);
  const selectedSiteFeatures = useSelector(
    (state) => state.report.selectedSiteFeatures,
  );

  const selectedSystemCodes = new Set(selectedSystems.map(getSystemCodeFor));
  const selectedFeatureCodes = new Set(
    selectedSiteFeatures.map(getFeatureKeyFor),
  );

  const toggleSystem = (system) => {
    const code = getSystemCodeFor(system);
    if (selectedSystemCodes.has(code)) {
      dispatch(removeSelectedSystem(code));
    } else {
      dispatch(addSelectedSystem(system));
    }
  };

  const toggleFeature = (feature) => {
    const code = getFeatureKeyFor(feature);
    if (selectedFeatureCodes.has(code)) {
      dispatch(removeSelectedFeature(code));
    } else {
      dispatch(addSelectedFeature(feature));
    }
  };

  const clearForClassification = (classification) => () => {
    if (!availableSystems) return;
    availableSystems
      .filter((s) => s["ASTM.Name"] === classification)
      .map(getSystemCodeFor)
      .filter((code) => selectedSystemCodes.has(code))
      .forEach((code) => dispatch(removeSelectedSystem(code)));
  };

  const fetchSystems = useEffectEvent(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/codes/building_services/ref`,
      );
      if (!response.ok) throw new Error("Failed to fetch systems");
      const data = await response.json();
      const unique = dedupeSystems(data);
      setAvailableSystems(unique);

      // sort and get first service alphabetically
      const services = Array.from(
        new Set(unique.map((s) => s.Services).filter(Boolean)),
      ).sort();

      setActiveService(services[0] ?? null);
    } catch (err) {
      setError(err.message);
    }
  });

  const fetchSiteFeatures = useEffectEvent(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/codes/site_features/ref`,
      );
      if (!response.ok) throw new Error("Failed to fetch site features");
      const data = await response.json();
      const unique = dedupeSiteFeatures(data);
      setAvailableFeatures(unique);

      // sort and get first category alphabetically
      const categories = Array.from(
        new Set(unique.map((f) => f.Category).filter(Boolean)),
      ).sort();

      setActiveCategory(categories[0] ?? null);
    } catch (err) {
      setError(err.message);
    }
  });

  useEffect(() => {
    fetchSystems();
  }, []);

  useEffect(() => {
    fetchSiteFeatures();
  }, []);

  useEffect(() => {
    if (!activeStep?.name) return;
    dispatch(
      meetCondition({
        name: activeStep.name,
        condition: selectedSystems.length > 0,
      }),
    );
  }, [selectedSystems.length, activeStep?.name]);

  if (error)
    return (
      <div>
        <h2 className="heading-card mb-2">Systems</h2>
        <p className="text-destructive text-sm">
          Error loading systems: {error}
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
