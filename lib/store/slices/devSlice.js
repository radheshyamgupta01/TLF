import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import api  from "../store/api/api";

const api = process.env.NEXT_PUBLIC_API_URL;

// Fetch dev profile
export const fetchDevProfile = createAsyncThunk(
  "dev/fetchDevProfile",
  async (userId, thunkAPI) => {
    try {
      const res = await api.get(`/devProfile/${userId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// Update dev profile
export const updateDevProfile = createAsyncThunk(
  "dev/updateDevProfile",
  async ({ userId, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/devProfile/${userId}`, formData, {
        withCredentials: true,
      });
      return res.data.profile;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const devSlice = createSlice({
  name: "dev",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetProfile(state) {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchDevProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateDevProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateDevProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default devSlice.reducer;
export const { clearError, resetProfile } = devSlice.actions;
