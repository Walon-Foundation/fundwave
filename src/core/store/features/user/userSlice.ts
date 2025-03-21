import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!Cookies.get("accessToken")
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ accessToken: string; userToken: string }>) => {
      Cookies.set("accessToken", action.payload.accessToken);
      Cookies.set("userToken", action.payload.userToken);
      state.isAuthenticated = true;
    },
    logout: (state) => {
      Cookies.remove("accessToken");
      Cookies.remove("userToken");
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
