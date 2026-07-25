import {
  getSystemCodeFor,
  type FeatureRecord,
  type SystemRecord,
} from "@/state/slices/reportReducer";
import type { KeyboardEvent } from "react";

export function sanitizeName(name: string | null | undefined): string {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replaceAll("_", " ");
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

export function handleListboxKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const options = Array.from(
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'),
  );
  const currentIndex = options.indexOf(
    document.activeElement as HTMLButtonElement,
  );
  if (currentIndex === -1) return;

  let nextIndex: number;
  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
      nextIndex = (currentIndex + 1) % options.length;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      nextIndex = (currentIndex - 1 + options.length) % options.length;
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = options.length - 1;
      break;
    default:
      return;
  }
  e.preventDefault();
  options[currentIndex].tabIndex = -1;
  options[nextIndex].tabIndex = 0;
  options[nextIndex].focus();
}
