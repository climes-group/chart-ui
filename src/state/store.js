import { configureStore } from "@reduxjs/toolkit";
import flowReducer from "./slices/flowReducer";
import geoReducer from "./slices/geoReducer";
import userReducer from "./slices/userReducer";

export const setupStore = (preloadedState) =>
  configureStore({
    reducer: {
      geo: geoReducer,
      flow: flowReducer,
      user: userReducer,
    },
    preloadedState,
  });
