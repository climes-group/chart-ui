import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    logout: (state) => {
      state.profile = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProfile, logout } = userSlice.actions;

export default userSlice.reducer;
