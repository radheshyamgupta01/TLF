import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import api from "../store/api/api";

const api = process.env.NEXT_PUBLIC_API_URL;

// fetch cp profile
export const fetchCpProfile = createAsyncThunk(
  "cpProfile/fetchCpProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/cp/profile/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch CP profile"
      );
    }
  }
);

// update cp profile
export const updateCpProfile = createAsyncThunk(
  "cpProfile/updateCpProfile",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cp/profile/${userId}`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update CP Profile"
      );
    }
  }
);

const cpProfileSlice = createSlice({
  name: "cpProfile",
  initialState: {
    profile: ["vvvvvvvvvvvvvvv"],
    status: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCpProfile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCpProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = "success";
      })
      .addCase(fetchCpProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCpProfile.pending, (state, action) => {
        state.status = "Loading";
      })
      .addCase(updateCpProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = "success";
      })
      .addCase(updateCpProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cpProfileSlice.reducer;
