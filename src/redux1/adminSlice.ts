import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types and Interfaces
export interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuthResponse {
  data: { accessToken: string };
  statusCode: number;
  success: boolean;
}

export interface ProfileResponse {
  data: Admin;
  statusCode: number;
  success: boolean;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminState {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  profileLoading: boolean;
  profileError: string | null;
}

// Initial State
const initialState: AdminState = {
  admin: null,
  accessToken: localStorage.getItem('adminAccessToken') || null,
  isAuthenticated: !!localStorage.getItem('adminAccessToken'),
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
};

// Base URL
const BASE_URL = "https://api.daadis.in";
const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('adminAccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const apiCall = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers: getHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

// Async Thunks
export const adminSignup = createAsyncThunk<
  AuthResponse,
  SignupCredentials,
  { rejectValue: string }
>('admin/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiCall('/admin/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const adminLogin = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('admin/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchAdminProfile = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>('admin/profile', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/admin/profile');
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminAccessToken');
    },
    clearAdminError: (state) => {
      state.error = null;
      state.profileError = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(adminSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('adminAccessToken', action.payload.data.accessToken);
      })
      .addCase(adminSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      });

    // Login
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.data.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('adminAccessToken', action.payload.data.accessToken);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      });

    // Profile
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.admin = action.payload.data;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload!;
      });
  },
});

export const { logoutAdmin, clearAdminError } = adminSlice.actions;

// Selectors
export const selectAdmin = (state: { admin: AdminState }) => state.admin.admin;
export const selectIsAdminAuthenticated = (state: { admin: AdminState }) => state.admin.isAuthenticated;
export const selectAdminLoading = (state: { admin: AdminState }) => state.admin.loading;
export const selectAdminError = (state: { admin: AdminState }) => state.admin.error;
export const selectAdminProfileLoading = (state: { admin: AdminState }) => state.admin.profileLoading;
export const selectAdminProfileError = (state: { admin: AdminState }) => state.admin.profileError;

export default adminSlice.reducer;
