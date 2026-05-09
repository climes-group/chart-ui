import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserProfile = {
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: unknown;
};

type UserState = {
  profile: UserProfile | undefined;
  token: string | undefined;
};

const initialState: UserState = {
  profile: undefined,
  token: undefined,
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
    logout: (state) => {
      state.profile = undefined;
      state.token = undefined;
    },
  },
});

export const { setProfile, setToken, logout } = userSlice.actions;

export default userSlice.reducer;
