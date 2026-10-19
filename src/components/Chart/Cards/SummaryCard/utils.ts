import type { TranslateFn } from "@/i18n";
import type { IntakeForm } from "@/state/slices/reportReducer";

function formatLatLong(lat: number, long: number): string {
  const latAbs = Math.abs(lat);
  const longAbs = Math.abs(long);

  const latDeg = Math.floor(latAbs);
  const latMin = Math.floor((latAbs - latDeg) * 60);
  const latSec = (latAbs - latDeg - latMin / 60) * 3600;

  const longDeg = Math.floor(longAbs);
  const longMin = Math.floor((longAbs - longDeg) * 60);
  const longSec = (longAbs - longDeg - longMin / 60) * 3600;

  const roundedLatSec = Math.round(latSec * 100) / 100;
  const roundedLongSec = Math.round(longSec * 100) / 100;

  return `${latDeg}°${latMin}'${roundedLatSec}"${
    lat >= 0 ? "N" : "S"
  } ${longDeg}°${longMin}'${roundedLongSec}"${long >= 0 ? "E" : "W"}`;
}

function groupByKey<T>(
  items: T[],
  getKey: (item: T) => string,
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = getKey(item) || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function formatHeadline(intake: IntakeForm, t: TranslateFn): string | null {
  const type = intake.unit_model_type;
  const primary = Number(intake.total_primary_units);
  const secondary = Number(intake.total_secondary_suites);

  const counts: string[] = [];
  if (Number.isFinite(primary) && primary > 0) {
    const key =
      primary === 1 ? "summary.primaryUnits.one" : "summary.primaryUnits.other";
    counts.push(t(key, { count: primary }));
  }
  if (Number.isFinite(secondary) && secondary > 0) {
    const key =
      secondary === 1
        ? "summary.secondarySuites.one"
        : "summary.secondarySuites.other";
    counts.push(t(key, { count: secondary }));
  }

  if (!type) return counts.join(" + ") || null;
  if (counts.length === 0) return type;
  return `${type} — ${counts.join(" + ")}`;
}

function formatStandards(intake: IntakeForm): string[] {
  const list = intake.modelling_standard || [];
  const other = intake.modelling_standard_other;
  return list.map((standard) =>
    standard === "Other" && other ? other : standard,
  );
}

function formatPlanLine(intake: IntakeForm, t: TranslateFn): string | null {
  const parts: string[] = [];
  if (intake.building_plan_version) parts.push(intake.building_plan_version);
  if (intake.building_plan_date) parts.push(intake.building_plan_date);
  if (intake.building_plan_author) parts.push(intake.building_plan_author);
  if (parts.length === 0) return null;
  return t("summary.plan", { value: parts.join(" · ") });
}

export {
  formatHeadline,
  formatLatLong,
  formatPlanLine,
  formatStandards,
  groupByKey,
};
