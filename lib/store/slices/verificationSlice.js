import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import api from '../store/api/api';

const api = process.env.NEXT_PUBLIC_API_URL;

// Thunk for verification
export const verifyUserThunk = createAsyncThunk(
  "verification/verifyUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("authentication/verification", data, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const verificationSlice = createSlice({
  name: "verification",
  initialState: {
    status: "idle",
    error: null,
    success: false,
  },
  reducers: {
    resetVerificationState: (state) => {
      state.status = "idle";
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyUserThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyUserThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.success = true;
      })
      .addCase(verifyUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { resetVerificationState } = verificationSlice.actions;
export default verificationSlice.reducer;
