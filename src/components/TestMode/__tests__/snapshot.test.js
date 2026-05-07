import {
  SNAPSHOT_KEY,
  clearSnapshot,
  loadSnapshot,
  saveSnapshot,
} from "../snapshot";

describe("snapshot util", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips data with version + savedAt metadata", () => {
    const saved = saveSnapshot({ intakeForm: { ea_name: "Test" } });
    expect(saved.version).toBe(1);
    expect(saved.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    const loaded = loadSnapshot();
    expect(loaded.intakeForm.ea_name).toBe("Test");
    expect(loaded.version).toBe(1);
  });

  it("returns null when nothing is stored", () => {
    expect(loadSnapshot()).toBeNull();
  });

  it("returns null on malformed JSON", () => {
    localStorage.setItem(SNAPSHOT_KEY, "{not-json");
    expect(loadSnapshot()).toBeNull();
  });

  it("returns null when the version is unrecognized", () => {
    localStorage.setItem(
      SNAPSHOT_KEY,
      JSON.stringify({ version: 999, intakeForm: {} }),
    );
    expect(loadSnapshot()).toBeNull();
  });

  it("clearSnapshot removes the entry", () => {
    saveSnapshot({ intakeForm: {} });
    expect(loadSnapshot()).not.toBeNull();
    clearSnapshot();
    expect(loadSnapshot()).toBeNull();
  });
});
