import {
  getSystemCodeFor,
  type SystemRecord,
} from "@/state/slices/reportReducer";

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
