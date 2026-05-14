import {
  getSystemCodeFor,
  type FeatureRecord,
  type SystemRecord,
} from "@/state/slices/reportReducer";

export function sanitizeName(name: string | null | undefined): string {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replaceAll('_', ' ');
}

export function dedupeSystems(systems: SystemRecord[]): SystemRecord[] {
  const seen = new Set<string>();
  const unique: SystemRecord[] = [];
  for (const system of systems) {
    const key = getSystemCodeFor(system);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(system);
  }
  return unique;
}

export function dedupeSiteFeatures(
  features: FeatureRecord[],
): FeatureRecord[] {
  const seen = new Set<string>();
  const unique: FeatureRecord[] = [];
  for (const feature of features) {
    const key = feature["ID"];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(feature);
  }
  return unique;
}
