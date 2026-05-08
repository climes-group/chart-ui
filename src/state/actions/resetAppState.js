import { setSteps } from "../slices/flowReducer";
import { resetGeoState } from "../slices/geoReducer";
import { resetReportState } from "../slices/reportReducer";

export const resetAppState = (steps) => (dispatch) => {
  dispatch(resetReportState());
  dispatch(resetGeoState());
  dispatch(setSteps(steps));
};
