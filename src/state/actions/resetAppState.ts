import type { Dispatch } from "@reduxjs/toolkit";
import type { Step } from "@/steps";
import { setSteps } from "../slices/flowReducer";
import { resetGeoState } from "../slices/geoReducer";
import { resetReportState } from "../slices/reportReducer";

export const resetAppState =
  (steps: Step[]) =>
  (dispatch: Dispatch) => {
    dispatch(resetReportState());
    dispatch(resetGeoState());
    dispatch(setSteps(steps));
  };
