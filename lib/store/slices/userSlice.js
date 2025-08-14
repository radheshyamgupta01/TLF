import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../store/api/api";
const api = process.env.NEXT_PUBLIC_API_URL;

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/profile/${id}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
