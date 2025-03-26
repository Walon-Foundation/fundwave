import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!Cookies.get("sessionToken")
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ sessionToken: string; userToken: string }>) => {
      Cookies.set("sessionToken", action.payload.sessionToken, {expires: 1});
      Cookies.set("userToken", action.payload.userToken, {expires: 1});
      state.isAuthenticated = true;
    },
    logout: (state) => {
      Cookies.remove("sessionToken");
      Cookies.remove("userToken");
      state.isAuthenticated = false;
    },
    kycUpdate:(state, action: PayloadAction<{ userToken:string }>) => {
      Cookies.remove("userToken");
      Cookies.set("userToken", action.payload.userToken, {expires: 1});
    }
  },
});

export const { login, logout, kycUpdate } = authSlice.actions;
export default authSlice.reducer;
