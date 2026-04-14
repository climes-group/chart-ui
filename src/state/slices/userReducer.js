import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: undefined,
  token: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.profile = undefined;
      state.token = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProfile, setToken, logout } = userSlice.actions;

export default userSlice.reducer;
