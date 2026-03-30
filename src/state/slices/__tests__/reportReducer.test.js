import reducer, {
  addSelectedSystem,
  clearIntakeForm,
  clearSelectedSystems,
  removeSelectedSystem,
  selectIntakeForm,
  setIntakeField,
  setIntakeForm,
  setReportData,
  setReportGenAt,
  setReportGenTime,
  setReportStatus,
} from "../reportReducer";

const initialState = reducer(undefined, { type: "@@INIT" });

describe("reportReducer", () => {
  it("returns the initial state", () => {
    expect(initialState.reportData).toBeNull();
    expect(initialState.reportStatus).toBe("not_generated");
    expect(initialState.selectedSystems).toEqual([]);
  });

  describe("setReportStatus", () => {
    it.each(["not_generated", "generating", "generated", "error"])(
      "sets status to %s",
      (status) => {
        const state = reducer(initialState, setReportStatus(status));
        expect(state.reportStatus).toBe(status);
      },
    );
  });

  describe("setReportData", () => {
    it("stores report data", () => {
      const state = reducer(initialState, setReportData("base64data=="));
      expect(state.reportData).toBe("base64data==");
    });

    it("clears report data when set to null", () => {
      const s1 = reducer(initialState, setReportData("base64data=="));
      const s2 = reducer(s1, setReportData(null));
      expect(s2.reportData).toBeNull();
    });
  });

  describe("setReportGenAt / setReportGenTime", () => {
    it("sets generation timestamp", () => {
      const state = reducer(initialState, setReportGenAt("12:00:00 PM"));
      expect(state.reportGenAt).toBe("12:00:00 PM");
    });

    it("sets generation duration", () => {
      const state = reducer(initialState, setReportGenTime(3200));
      expect(state.reportGenTime).toBe(3200);
    });
  });

  describe("selectedSystems", () => {
    it("adds a system", () => {
      const state = reducer(initialState, addSelectedSystem("sys-1"));
      expect(state.selectedSystems).toContain("sys-1");
    });

    it("does not add duplicate systems", () => {
      const s1 = reducer(initialState, addSelectedSystem("sys-1"));
      const s2 = reducer(s1, addSelectedSystem("sys-1"));
      expect(s2.selectedSystems.filter((s) => s === "sys-1")).toHaveLength(1);
    });

    it("removes a system", () => {
      const s1 = reducer(initialState, addSelectedSystem("sys-1"));
      const s2 = reducer(s1, removeSelectedSystem("sys-1"));
      expect(s2.selectedSystems).not.toContain("sys-1");
    });

    it("removing a non-existent system is a no-op", () => {
      const state = reducer(initialState, removeSelectedSystem("does-not-exist"));
      expect(state.selectedSystems).toEqual([]);
    });

    it("clears all selected systems", () => {
      const s1 = reducer(initialState, addSelectedSystem("sys-1"));
      const s2 = reducer(s1, addSelectedSystem("sys-2"));
      const s3 = reducer(s2, clearSelectedSystems());
      expect(s3.selectedSystems).toEqual([]);
    });
  });

  describe("intakeForm", () => {
    it("sets a single field", () => {
      const state = reducer(initialState, setIntakeField({ key: "building_permit", value: "BP-123" }));
      expect(state.intakeForm.building_permit).toBe("BP-123");
    });

    it("does not touch other fields when setting one field", () => {
      const state = reducer(initialState, setIntakeField({ key: "building_permit", value: "BP-123" }));
      expect(state.intakeForm.project_address).toBe("");
    });

    it("ignores setIntakeField when key is missing", () => {
      const state = reducer(initialState, setIntakeField({ value: "orphan" }));
      expect(state.intakeForm).toEqual(initialState.intakeForm);
    });

    it("ignores setIntakeField when payload is nullish", () => {
      const state = reducer(initialState, setIntakeField(null));
      expect(state.intakeForm).toEqual(initialState.intakeForm);
    });

    it("merges multiple fields with setIntakeForm", () => {
      const patch = { building_permit: "BP-999", project_address: "99 Oak Ave" };
      const state = reducer(initialState, setIntakeForm(patch));
      expect(state.intakeForm.building_permit).toBe("BP-999");
      expect(state.intakeForm.project_address).toBe("99 Oak Ave");
    });

    it("handles nullish payload in setIntakeForm gracefully", () => {
      const state = reducer(initialState, setIntakeForm(null));
      expect(state.intakeForm).toEqual(initialState.intakeForm);
    });

    it("resets the intake form with clearIntakeForm", () => {
      const s1 = reducer(initialState, setIntakeField({ key: "building_permit", value: "BP-123" }));
      const s2 = reducer(s1, clearIntakeForm());
      expect(s2.intakeForm.building_permit).toBe("");
    });
  });

  describe("selectIntakeForm selector", () => {
    it("returns the intake form from state", () => {
      const fakeState = { report: { intakeForm: initialState.intakeForm } };
      expect(selectIntakeForm(fakeState)).toEqual(initialState.intakeForm);
    });
  });
});
