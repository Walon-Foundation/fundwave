import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { axiosInstance } from "@/core/api/axiosInstance";

// Define the AuthState interface
interface AuthState {
  isAuthenticated: boolean;
}

// Initial state checks if sessionToken exists
const initialState: AuthState = {
  isAuthenticated: !!Cookies.get("sessionToken"),
};

export const logout = createAsyncThunk('user/logout', async(_,{rejectWithValue}) => {
  try{
    const response = await axiosInstance.post('/auth/logout')
    return response.data
  }catch(error){
    console.error(error)
    return rejectWithValue("Failed to logout");
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ sessionToken: string; userToken: string }>) => {
      Cookies.set("sessionToken", action.payload.sessionToken, { expires: 1 });
      Cookies.set("userToken", action.payload.userToken, { expires: 1 });
      state.isAuthenticated = true;
    },
    kycUpdate: (state, action: PayloadAction<{ userToken: string }>) => {
      Cookies.remove("userToken");
      Cookies.set("userToken", action.payload.userToken, { expires: 1 });
    },
  },
  // Handle the async thunk (if using createAsyncThunk)
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      // Remove client-side cookies here as well if using thunk
      Cookies.remove("sessionToken");
      Cookies.remove("userToken");
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      console.error("Logout failed:", action.error.message);
    });
  },
});

export const { login, kycUpdate } = authSlice.actions;
export default authSlice.reducer;