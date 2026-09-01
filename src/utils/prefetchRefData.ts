const cache = new Map<string, Promise<unknown>>();

import buildingServicesJson from "../assets/offline/building_services_ref.json";
import siteFeaturesJson from "../assets/offline/site_features_ref.json";

export function clearRefDataCache(): void {
  cache.clear();
}

const BUILDING_SERVICES_URI = "/codes/building_services/ref";
const SITE_FEATURES_URI = "/codes/site_features/ref";

export function prefetchRefData(isOfflineMode: boolean = false): void {
  const base = import.meta.env.VITE_API_HOST;
  if (isOfflineMode) {
    // with offline mode we're fetching the local JSON ref files
    cache.set(
      base + BUILDING_SERVICES_URI,
      Promise.resolve(buildingServicesJson),
    );
    cache.set(base + SITE_FEATURES_URI, Promise.resolve(siteFeaturesJson));
  } else {
    for (const path of [BUILDING_SERVICES_URI, SITE_FEATURES_URI]) {
      const url = `${base}${path}`;
      if (!cache.has(url)) {
        cache.set(
          url,
          fetch(url).then((r) => {
            if (!r.ok) throw new Error(`Failed to fetch ${path}`);
            return r.json();
          }),
        );
      }
    }
  }
}

export function getCachedJson<T>(url: string): Promise<T> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch ${url}`);
        return r.json();
      }),
    );
  }
  return cache.get(url) as Promise<T>;
}
