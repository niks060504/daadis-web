import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types and Interfaces
export interface Address {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  _id: string;
  product: string;
  productName: string;
  productCode: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
  itemTotal: number;
}

export interface Order {
  _id: string;
  orderId: string;
  orderNumber: string;
  user?: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  appliedCoupon?: { code: string; discountId: string; discountAmount: number };
  subtotal: number;
  totalDiscountAmount: number;
  shippingCharge: number;
  taxAmount: number;
  total: number;
  itemCount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OrderResponse {
  data: Partial<Order> & { orderId?: string; orderNumber?: string; total?: number; itemCount?: number; status?: string };
  statusCode: number;
  success: boolean;
}

export interface OrdersResponse {
  data: {
    orders: Order[];
    total: number;
    totalPages?: number;
    currentPage?: number;
    limit?: number;
  };
  statusCode: number;
  success: boolean;
}

export interface OrderStats {
  _id: string;
  count: number;
  totalAmount: number;
}

export interface StatsResponse {
  data: OrderStats[];
  statusCode: number;
  success: boolean;
}

export interface CreateOrderRequest {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

export interface SearchOrdersParams {
  q?: string;
  page?: number;
  limit?: number;
}

export type OrderStatusUpdate = { status: string };

export interface OrderState {
  orders: Order[];
  order: Order | null;
  stats: OrderStats[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  searchLoading: boolean;
  searchError: string | null;
  statsLoading: boolean;
  statsError: string | null;
  updateStatusLoading: boolean;
  updateStatusError: string | null;
  cancelLoading: boolean;
  cancelError: string | null;
  returnLoading: boolean;
  returnError: string | null;
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  stats: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  searchLoading: false,
  searchError: null,
  statsLoading: false,
  statsError: null,
  updateStatusLoading: false,
  updateStatusError: null,
  cancelLoading: false,
  cancelError: null,
  returnLoading: false,
  returnError: null,
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem('accessToken');
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const apiCall = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers: { ...getHeaders(), ...options.headers } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

// Async Thunks
export const createOrder = createAsyncThunk<OrderResponse, CreateOrderRequest, { rejectValue: string }>(
  'order/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await apiCall('/order', { method: 'POST', body: JSON.stringify(orderData) });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const searchOrders = createAsyncThunk<OrdersResponse, SearchOrdersParams, { rejectValue: string }>(
  'order/search',
  async (params, { rejectWithValue }) => {
    try {
      const sp = new URLSearchParams();
      if (params.q) sp.append('q', params.q);
      if (params.page) sp.append('page', params.page.toString());
      if (params.limit) sp.append('limit', params.limit.toString());
      const response = await apiCall(`/order/search?${sp.toString()}`);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrderStats = createAsyncThunk<StatsResponse, void, { rejectValue: string }>(
  'order/stats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('/order/stats');
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrders = createAsyncThunk<OrdersResponse, { page?: number; limit?: number }, { rejectValue: string }>(
  'order/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const sp = new URLSearchParams();
      if (params.page) sp.append('page', params.page.toString());
      if (params.limit) sp.append('limit', params.limit.toString());
      const response = await apiCall(`/order/orders?${sp.toString()}`);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk<OrderResponse, { id: string; status: string }, { rejectValue: string }>(
  'order/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiCall(`/order/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const cancelOrder = createAsyncThunk<OrderResponse, string, { rejectValue: string }>(
  'order/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiCall(`/order/${id}/cancel`, { method: 'POST' });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const returnOrder = createAsyncThunk<OrderResponse, string, { rejectValue: string }>(
  'order/return',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiCall(`/order/${id}/return`, { method: 'POST' });
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state: OrderState) => { state.loading = true; state.error = null; };
    const setFailed = (state: OrderState, action: any) => { state.loading = false; state.error = action.payload; };

    // Create Order
    builder.addCase(createOrder.pending, (state) => { state.createLoading = true; state.createError = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.createLoading = false; state.order = action.payload.data as Order; })
      .addCase(createOrder.rejected, (state, action) => { state.createLoading = false; state.createError = action.payload!; });

    // Search Orders
    builder.addCase(searchOrders.pending, (state) => { state.searchLoading = true; state.searchError = null; })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.orders = action.payload.data.orders;
        state.totalOrders = action.payload.data.total;
      })
      .addCase(searchOrders.rejected, (state, action) => { state.searchLoading = false; state.searchError = action.payload!; });

    // Stats
    builder.addCase(fetchOrderStats.pending, (state) => { state.statsLoading = true; state.statsError = null; })
      .addCase(fetchOrderStats.fulfilled, (state, action) => { state.statsLoading = false; state.stats = action.payload.data; })
      .addCase(fetchOrderStats.rejected, (state, action) => { state.statsLoading = false; state.statsError = action.payload!; });

    // Fetch All Orders
    builder.addCase(fetchOrders.pending, setLoading)
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data.orders;
        state.totalOrders = action.payload.data.total;
        state.currentPage = action.payload.data.currentPage!;
        state.totalPages = action.payload.data.totalPages!;
        state.limit = action.payload.data.limit!;
      })
      .addCase(fetchOrders.rejected, setFailed);

    // Update Status
    builder.addCase(updateOrderStatus.pending, (state) => { state.updateStatusLoading = true; state.updateStatusError = null; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => { state.updateStatusLoading = false; state.order = action.payload.data as Order; })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.updateStatusLoading = false; state.updateStatusError = action.payload!; });

    // Cancel
    builder.addCase(cancelOrder.pending, (state) => { state.cancelLoading = true; state.cancelError = null; })
      .addCase(cancelOrder.fulfilled, (state, action) => { state.cancelLoading = false; state.order = action.payload.data as Order; })
      .addCase(cancelOrder.rejected, (state, action) => { state.cancelLoading = false; state.cancelError = action.payload!; });

    // Return
    builder.addCase(returnOrder.pending, (state) => { state.returnLoading = true; state.returnError = null; })
      .addCase(returnOrder.fulfilled, (state, action) => { state.returnLoading = false; state.order = action.payload.data as Order; })
      .addCase(returnOrder.rejected, (state, action) => { state.returnLoading = false; state.returnError = action.payload!; });
  },
});

export default orderSlice.reducer;