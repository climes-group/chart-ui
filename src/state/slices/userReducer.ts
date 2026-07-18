import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserProfile = {
  given_name?: string;
  email?: string;
};

type UserState = {
  profile: UserProfile | undefined;
  token: string | undefined;
  loginModalOpen: boolean;
  authProvider: AuthProvider;
};

type AuthProvider = "google" | "msal" | undefined;

const initialState: UserState = {
  profile: undefined,
  token: undefined,
  loginModalOpen: false,
  authProvider: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | undefined>) => {
      state.profile = action.payload;
    },
    setToken: (state, action: PayloadAction<string | undefined>) => {
      state.token = action.payload;
    },
    setAuthProvider: (state, action: PayloadAction<AuthProvider>) => {
      state.authProvider = action.payload;
    },
    logout: (state) => {
      state.profile = undefined;
      state.token = undefined;
      state.authProvider = undefined;
    },
    setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.loginModalOpen = action.payload;
    },
  },
});

export const {
  setProfile,
  setToken,
  logout,
  setLoginModalOpen,
  setAuthProvider,
} = userSlice.actions;

export default userSlice.reducer;
