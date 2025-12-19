import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types and Interfaces
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  luckyPoints: number;
  isGuest: boolean;
  verified: boolean;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  password?: string;
  authProvider?: string;
}

export interface Address {
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
  _id?: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
  };
  statusCode: number;
  success: boolean;
}

export interface ProfileResponse {
  data: User;
  statusCode: number;
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface GoogleAuthRequest {
  code: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  addresses?: Address[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  profileLoading: boolean;
  profileError: string | null;
}

// Initial State
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
  profileLoading: false,
  profileError: null,
};

// Base URL - you can replace {{local}} with your actual API base URL
const BASE_URL = "https://api.daadis.in"; // e.g., 'http://localhost:5000' or 'https://api.yourdomain.com'

// API Helper function
const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Async Thunks

// Signup
export const signup = createAsyncThunk<
  AuthResponse,
  SignupCredentials,
  { rejectValue: string }
>('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Signup failed');
  }
});

// Login
export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
  }
});

// Google Auth
export const googleAuth = createAsyncThunk<
  AuthResponse,
  GoogleAuthRequest,
  { rejectValue: string }
>('auth/google', async ( googleData: GoogleAuthRequest, { rejectWithValue }) => {
  try {
    const response = await apiCall('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Google authentication failed');
  }
});

// Get Profile
export const getProfile = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/auth/profile');
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch profile');
  }
});

// Update Profile
export const updateProfile = createAsyncThunk<
  ProfileResponse,
  UpdateProfileRequest,
  { rejectValue: string }
>('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await apiCall('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile');
  }
});

// Get User by ID
export const getUserById = createAsyncThunk<
  ProfileResponse,
  string,
  { rejectValue: string }
>('auth/getUserById', async (userId, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/auth/user/${userId}`);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user');
  }
});

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
    },
    
    // Clear Errors
    clearError: (state) => {
      state.error = null;
      state.profileError = null;
    },
    
    // Set Token (useful for token refresh)
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload);
    },
    
    // Reset Auth State
    resetAuthState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.profileLoading = false;
      state.profileError = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('accessToken', action.payload.data.accessToken);
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Signup failed';
        state.isAuthenticated = false;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('accessToken', action.payload.data.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // Google Auth
    builder
      .addCase(googleAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('accessToken', action.payload.data.accessToken);
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Google authentication failed';
        state.isAuthenticated = false;
      });

    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload.data;
        state.profileError = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || 'Failed to fetch profile';
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload.data;
        state.profileError = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || 'Failed to update profile';
      });

    // Get User by ID
    builder
      .addCase(getUserById.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getUserById.fulfilled, (state) => {
        state.profileLoading = false;
        // Note: This doesn't update the current user, just fetches another user's data
        // You might want to handle this differently based on your use case
        state.profileError = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || 'Failed to fetch user';
      });
  },
});

// Export actions
export const { logout, clearError, setToken, resetAuthState } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectProfileLoading = (state: { auth: AuthState }) => state.auth.profileLoading;
export const selectProfileError = (state: { auth: AuthState }) => state.auth.profileError;

// Export reducer
export default authSlice.reducer;