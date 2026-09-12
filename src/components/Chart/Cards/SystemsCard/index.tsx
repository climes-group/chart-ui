import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
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
import { getCachedJson } from "@/utils/prefetchRefData";
import { useDispatch, useSelector } from "react-redux";
import type { StepCardProps } from "../../StepRenderer";
import SystemsSection from "../SelectedSystemsCard/SystemsSection";
import { dedupeSystems } from "../SelectedSystemsCard/utils";

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
