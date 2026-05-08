import { resetAppState } from "../resetAppState";
import { setSteps } from "../../slices/flowReducer";
import { resetGeoState } from "../../slices/geoReducer";
import { resetReportState } from "../../slices/reportReducer";

describe("resetAppState thunk", () => {
  it("dispatches resetReportState, resetGeoState, then setSteps", () => {
    const dispatch = vi.fn();
    const steps = [{ name: "intake" }, { name: "summary" }];

    resetAppState(steps)(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, resetReportState());
    expect(dispatch).toHaveBeenNthCalledWith(2, resetGeoState());
    expect(dispatch).toHaveBeenNthCalledWith(3, setSteps(steps));
    expect(dispatch).toHaveBeenCalledTimes(3);
  });
});
