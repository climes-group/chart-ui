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
import sessionStorage from "redux-persist/lib/storage/session";
import flowReducer from "./slices/flowReducer";
import geoReducer from "./slices/geoReducer";
import reportReducer from "./slices/reportReducer";
import userReducer from "./slices/userReducer";

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

const userPersistConfig = {
  key: "user",
  storage: sessionStorage,
};

const rootReducer = combineReducers({
  geo: persistReducer(geoPersistConfig, geoReducer),
  flow: persistReducer(flowPersistConfig, flowReducer),
  user: persistReducer(userPersistConfig, userReducer),
  report: persistReducer(reportPersistConfig, reportReducer),
});

const middlewareConfig = {
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
};

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
export type RootState = ReturnType<typeof rootReducer>;
export type PreloadedRootState = DeepPartial<RootState>;

// Use in tests to avoid the async REHYDRATE dispatch that persistStore fires,
// which causes React act() warnings.
export const setupTestStore = (preloadedState?: PreloadedRootState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(middlewareConfig),
  });

export const setupStore = (preloadedState?: PreloadedRootState) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(middlewareConfig),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof setupTestStore>;
export type AppDispatch = AppStore["dispatch"];

import { useDispatch as useReduxDispatch } from "react-redux";
export const useAppDispatch: () => AppDispatch = useReduxDispatch;
