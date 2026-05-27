const cache = new Map<string, Promise<unknown>>();

export function clearRefDataCache(): void {
  cache.clear();
}

export function prefetchRefData(): void {
  const base = import.meta.env.VITE_API_HOST;
  for (const path of [
    "/codes/building_services/ref",
    "/codes/site_features/ref",
  ]) {
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
