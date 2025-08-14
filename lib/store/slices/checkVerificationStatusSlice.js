// features/verification/verificationSlice.js
import { createSlice } from "@reduxjs/toolkit";
// import api from "../store/api/api";

const api = process.env.NEXT_PUBLIC_API_URL;
import { createAsyncThunk } from "@reduxjs/toolkit";
export const checkVerificationStatusThunk = createAsyncThunk(
  "verification/verifyUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/verify/check-status",
        { userId },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  status: "idle",
  verificationMessage: "",
  redirect: "",
  userType: "",
  error: "",
};

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    resetVerificationState: (state) => {
      state.status = "idle";
      state.verificationMessage = "";
      state.redirect = "";
      state.userType = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkVerificationStatusThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkVerificationStatusThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.verificationMessage = action.payload.message;
        state.redirect = action.payload.redirect;
        state.userType = action.payload.userType || ""; // if backend returns it
      })
      .addCase(checkVerificationStatusThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetVerificationState } = verificationSlice.actions;

export default verificationSlice.reducer;
