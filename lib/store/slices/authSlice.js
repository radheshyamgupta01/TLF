import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

// Configure axios with base URL
const axiosInstance = axios.create({
  baseURL:  "/api", 
  withCredentials: true,
});

export const signupUserThunk = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/signup`, userData);

      if (!response?.data?.success) {
        return rejectWithValue(response.data?.message || "Signup failed");
      }

      const { user, token } = response.data.data;

      // Set token in axios default headers
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Also set in localStorage as backup
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong during signup.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);

      if (!response?.data?.success) {
        return rejectWithValue(response.data?.message || "Login failed");
      }

      const { user, token } = response.data.data;

      // Set token in axios default headers
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Also set in localStorage as backup
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Check your credentials.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      // Clear axios headers
      delete axiosInstance.defaults.headers.common["Authorization"];

      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Clear redux-persist
      dispatch(authSlice.actions.clearAuth());

      return true;
    } catch (error) {
      return true; // Always succeed logout
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      if (!auth.token) {
        return rejectWithValue("No token found");
      }

      const response = await axiosInstance.get("/auth/me");

      if (!response?.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to get profile"
        );
      }

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to get user profile";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/auth/profile", profileData);

      if (!response?.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to update profile"
        );
      }

      // Update localStorage as well
      localStorage.setItem("user_data", JSON.stringify(response.data.data));

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update profile";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    role: null,
    error: null,
    success: null,
    token: null,
    accessToken: null,
    isInitialized: false,
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.accessToken = null;
      state.error = null;
      state.success = null;
    },
    // Manual token restoration (backup method)
    restoreAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isInitialized = true;

      // Set axios headers
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    },
    clearError: (state) => {
      state.error = null;
      state.success = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.accessToken = null;
      state.error = null;
      state.success = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(signupUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Login cases
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Get profile cases
    builder
      .addCase(getUserProfileThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Don't clear auth on profile fetch failure
      });

    // Update profile cases
    builder
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });

    // Check auth cases
    // .addCase(checkAuthThunk.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(checkAuthThunk.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.user = action.payload.user || action.payload;
    //   state.isAuthenticated = true;
    //   state.error = null;
    // })
    // .addCase(checkAuthThunk.rejected, (state) => {
    //   state.isLoading = false;
    //   state.isAuthenticated = false;
    //   state.user = null;
    //   state.token = null;
    //   state.accessToken = null;
    // });
  },
});

export const {
  clearAuth,
  clearError,
  setInitialized,
  restoreAuth,
  logout,
  clearSuccess,
  resetAuthState,
} = authSlice.actions;
export default authSlice.reducer;
