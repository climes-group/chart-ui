export const SNAPSHOT_KEY = "CHART_FORM_SNAPSHOT";
export const SNAPSHOT_VERSION = 1;
export const SNAPSHOT_EVENT = "chart:snapshot-changed";

function emitChange() {
  window.dispatchEvent(new CustomEvent(SNAPSHOT_EVENT));
}

export function saveSnapshot(data) {
  const payload = {
    version: SNAPSHOT_VERSION,
    savedAt: new Date().toISOString(),
    ...data,
  };
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(payload));
  emitChange();
  return payload;
}

export function loadSnapshot() {
  const raw = localStorage.getItem(SNAPSHOT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== SNAPSHOT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSnapshot() {
  localStorage.removeItem(SNAPSHOT_KEY);
  emitChange();
}
