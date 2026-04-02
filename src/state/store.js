import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import flowReducer from "./slices/flowReducer";
import geoReducer from "./slices/geoReducer";
import reportReducer from "./slices/reportReducer";
import userReducer from "./slices/userReducer";
import sessionStorage from "redux-persist/lib/storage/session";

const geoPersistConfig = {
  key: "geo",
  storage: sessionStorage,
};

const flowPersistConfig = {
  key: "flow",
  storage: sessionStorage,
  blacklist: ["error"],
};

const reportPersistConfig = {
  key: "report",
  storage: sessionStorage,
  whitelist: ["intakeForm", "selectedSystems"],
};

const rootReducer = combineReducers({
  geo: persistReducer(geoPersistConfig, geoReducer),
  flow: persistReducer(flowPersistConfig, flowReducer),
  user: userReducer,
  report: persistReducer(reportPersistConfig, reportReducer),
});

// Use in tests to avoid the async REHYDRATE dispatch that persistStore fires,
// which causes React act() warnings.
export const setupTestStore = (preloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const setupStore = (preloadedState) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};
