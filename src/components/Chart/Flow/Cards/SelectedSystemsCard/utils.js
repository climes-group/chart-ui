import { getSystemCodeFor } from "@/state/slices/reportReducer";

export function sanitizeName(name) {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replace(/_/g, " ");
}

export function dedupeSystems(systems) {
  const seen = new Set();
  const unique = [];
  for (const system of systems) {
    const key = getSystemCodeFor(system);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(system);
  }
  return unique;
}

export function dedupeSiteFeatures(features) {
  const seen = new Set();
  const unique = [];
  for (const feature of features) {
    const key = feature["ID"];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(feature);
  }
  return unique;
}
