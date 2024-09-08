import { configureStore } from "@reduxjs/toolkit";
import flowReducer from "./slices/flowReducer";
import geoReducer from "./slices/geoReducer";

export const store = configureStore({
  reducer: {
    geo: geoReducer,
    flow: flowReducer,
  },
});
