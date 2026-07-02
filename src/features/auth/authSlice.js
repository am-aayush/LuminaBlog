import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userData = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state, action) => {
      ((state.userData = null), (state.isLoggedIn = false));
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
