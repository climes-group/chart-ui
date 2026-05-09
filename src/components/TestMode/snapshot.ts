export const SNAPSHOT_KEY = "CHART_FORM_SNAPSHOT";
export const SNAPSHOT_VERSION = 1;
export const SNAPSHOT_EVENT = "chart:snapshot-changed";

function emitChange() {
  globalThis.dispatchEvent(new CustomEvent(SNAPSHOT_EVENT));
}

export type SnapshotData = Record<string, unknown>;
export type Snapshot = SnapshotData & {
  version: number;
  savedAt: string;
};

export function saveSnapshot(data: SnapshotData): Snapshot {
  const payload: Snapshot = {
    version: SNAPSHOT_VERSION,
    savedAt: new Date().toISOString(),
    ...data,
  };
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(payload));
  emitChange();
  return payload;
}

export function loadSnapshot(): Snapshot | null {
  const raw = localStorage.getItem(SNAPSHOT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Snapshot | null;
    if (parsed?.version !== SNAPSHOT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSnapshot(): void {
  localStorage.removeItem(SNAPSHOT_KEY);
  emitChange();
}
