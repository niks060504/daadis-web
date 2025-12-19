import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Types and Interfaces
export interface PaymentInitiateRequest {
  orderId: string;
  method: string;
}

export interface RazorpayPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentResponse {
  data: any;
  statusCode: number;
  success: boolean;
}

export interface PaymentState {
  paymentDetails: any;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: PaymentState = {
  paymentDetails: null,
  loading: false,
  error: null,
};

// Base URL
const BASE_URL = "https://api.daadis.in";
const getToken = () => localStorage.getItem('accessToken');

// Headers
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// API Helper
const apiCall = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers: getHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

// Thunks
export const initiatePayment = createAsyncThunk<PaymentResponse, PaymentInitiateRequest, { rejectValue: string }>(
  'payment/initiate',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCall('/payments/initiate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const handlePaymentSuccess = createAsyncThunk<PaymentResponse, RazorpayPaymentData, { rejectValue: string }>(
  'payment/success',
  async (razorpayData, { rejectWithValue }) => {
    try {
      const response = await apiCall('/payments/success', {
        method: 'POST',
        body: JSON.stringify(razorpayData),
      });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Initiate Payment
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload.data;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      })

      // Handle Payment Success
      .addCase(handlePaymentSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handlePaymentSuccess.fulfilled, (state) => {
        state.loading = false;
        state.paymentDetails = null;
      })
      .addCase(handlePaymentSuccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      });
  },
});

export default paymentSlice.reducer;