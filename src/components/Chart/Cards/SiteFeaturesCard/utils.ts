import { type FeatureRecord } from "@/state/slices/reportReducer";

export function sanitizeName(name: string | null | undefined): string {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replaceAll("_", " ");
}

export function dedupeSiteFeatures(features: FeatureRecord[]): FeatureRecord[] {
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
