import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types and Interfaces
export interface Discount {
  _id: string;
  code: string;
  type: 'coupon' | 'voucher';
  discountType: 'percentage' | 'fixed' | 'buyXgetY';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  buyX?: number;
  getY?: number;
  applicableCategories: string[];
  excludedProducts: string[];
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DiscountResponse {
  data: Discount;
  statusCode: number;
  success: boolean;
}

export interface DiscountsResponse {
  data: {
    discounts: Discount[];
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  statusCode: number;
  success: boolean;
}

export interface ActiveDiscountsResponse {
  data: Discount[];
  statusCode: number;
  success: boolean;
}

export interface CreateDiscountRequest {
  code: string;
  type: 'coupon' | 'voucher';
  discountType: 'percentage' | 'fixed' | 'buyXgetY';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  buyX?: number;
  getY?: number;
  applicableCategories?: string[];
  excludedProducts?: string[];
  validUntil: string;
  usageLimit?: number;
  isActive?: boolean;
}

export interface UpdateDiscountRequest {
  code?: string;
  type?: 'coupon' | 'voucher';
  discountType?: 'percentage' | 'fixed' | 'buyXgetY';
  value?: number;
  minPurchase?: number;
  maxDiscount?: number;
  buyX?: number;
  getY?: number;
  applicableCategories?: string[];
  excludedProducts?: string[];
  validUntil?: string;
  usageLimit?: number;
  isActive?: boolean;
}

export interface GetAllDiscountsParams {
  page?: number;
  limit?: number;
  type?: 'coupon' | 'voucher';
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApplyDiscountRequest {
  code: string;
  cartTotal: number;
  cartItems?: any[];
  userId?: string;
}

export interface ApplyDiscountResponse {
  data: {
    discount: Discount;
    discountAmount: number;
    finalTotal: number;
    message: string;
  };
  statusCode: number;
  success: boolean;
}

export interface DiscountState {
  discounts: Discount[];
  activeDiscounts: Discount[];
  expiredDiscounts: Discount[];
  currentDiscount: Discount | null;
  appliedDiscount: Discount | null;
  isLoading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  applyLoading: boolean;
  applyError: string | null;
  activeLoading: boolean;
  activeError: string | null;
  expiredLoading: boolean;
  expiredError: string | null;
  totalDiscounts: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  discountAmount: number;
  finalTotal: number;
}

// Initial State
const initialState: DiscountState = {
  discounts: [],
  activeDiscounts: [],
  expiredDiscounts: [],
  currentDiscount: null,
  appliedDiscount: null,
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  applyLoading: false,
  applyError: null,
  activeLoading: false,
  activeError: null,
  expiredLoading: false,
  expiredError: null,
  totalDiscounts: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  discountAmount: 0,
  finalTotal: 0,
};

// Base URL - Updated with your provided URL
const BASE_URL = "https://api.daadis.in";

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper function to get headers
const getHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Helper function
const apiCall = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getHeaders(),
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

// Create Discount (Admin only)
export const createDiscount = createAsyncThunk<
  DiscountResponse,
  CreateDiscountRequest,
  { rejectValue: string }
>('discount/create', async (discountData, { rejectWithValue }) => {
  try {
    const response = await apiCall('/discount', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create discount');
  }
});

// Update Discount (Admin only)
export const updateDiscount = createAsyncThunk<
  DiscountResponse,
  { id: string; data: UpdateDiscountRequest },
  { rejectValue: string }
>('discount/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/discount/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update discount');
  }
});

// Get Discount by Code
export const getDiscountByCode = createAsyncThunk<
  DiscountResponse,
  string,
  { rejectValue: string }
>('discount/getByCode', async (code, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/discount/code/${code}`);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch discount');
  }
});

// Get All Discounts (Admin)
export const getAllDiscounts = createAsyncThunk<
  DiscountsResponse,
  GetAllDiscountsParams | void,
  { rejectValue: string }
>('discount/getAll', async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    
    const queryString = searchParams.toString();
    const url = `/discount/all${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall(url);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch discounts');
  }
});

// Delete Discount (Admin only)
export const deleteDiscount = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>('discount/delete', async (discountId, { rejectWithValue }) => {
  try {
    await apiCall(`/discount/${discountId}`, {
      method: 'DELETE',
    });
    return { id: discountId };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete discount');
  }
});

// Get Expired Discounts
export const getExpiredDiscounts = createAsyncThunk<
  ActiveDiscountsResponse,
  void,
  { rejectValue: string }
>('discount/getExpired', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/discount/expired');
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch expired discounts');
  }
});

// Apply Discount
export const applyDiscount = createAsyncThunk<
  ApplyDiscountResponse,
  ApplyDiscountRequest,
  { rejectValue: string }
>('discount/apply', async (discountData, { rejectWithValue }) => {
  try {
    const response = await apiCall('/discount/apply', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to apply discount');
  }
});

// Get Active Discounts
export const getActiveDiscounts = createAsyncThunk<
  ActiveDiscountsResponse,
  void,
  { rejectValue: string }
>('discount/getActive', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/discount/active');
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch active discounts');
  }
});

// Discount Slice
const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    // Clear Errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.applyError = null;
      state.activeError = null;
      state.expiredError = null;
    },

    // Clear Current Discount
    clearCurrentDiscount: (state) => {
      state.currentDiscount = null;
    },

    // Clear Applied Discount
    clearAppliedDiscount: (state) => {
      state.appliedDiscount = null;
      state.discountAmount = 0;
      state.finalTotal = 0;
    },

    // Set Current Page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Set Applied Discount (for manual setting)
    setAppliedDiscount: (state, action: PayloadAction<{ discount: Discount; discountAmount: number; finalTotal: number }>) => {
      const { discount, discountAmount, finalTotal } = action.payload;
      state.appliedDiscount = discount;
      state.discountAmount = discountAmount;
      state.finalTotal = finalTotal;
    },

    // Reset Discount State
    resetDiscountState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.createLoading = false;
      state.createError = null;
      state.updateLoading = false;
      state.updateError = null;
      state.deleteLoading = false;
      state.deleteError = null;
      state.applyLoading = false;
      state.applyError = null;
      state.activeLoading = false;
      state.activeError = null;
      state.expiredLoading = false;
      state.expiredError = null;
    },

    // Filter Discounts by Type
    filterDiscountsByType: (state, action: PayloadAction<'coupon' | 'voucher' | 'all'>) => {
      // This is a local filter, you might want to implement server-side filtering instead
      const filterType = action.payload;
      if (filterType === 'all') {
        // Reset to all discounts - you might need to refetch here
        return;
      }
      // Apply local filtering if needed
    },
  },
  extraReducers: (builder) => {
    // Helper functions for common state updates
    const setLoading = (state: DiscountState) => {
      state.isLoading = true;
      state.error = null;
    };

    const setFailed = (state: DiscountState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    // Create Discount
    builder
      .addCase(createDiscount.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.createLoading = false;
        state.discounts.unshift(action.payload.data);
        state.totalDiscounts += 1;
        state.createError = null;
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create discount';
      });

    // Update Discount
    builder
      .addCase(updateDiscount.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedDiscount = action.payload.data;
        
        // Update in discounts array
        const index = state.discounts.findIndex(discount => discount._id === updatedDiscount._id);
        if (index !== -1) {
          state.discounts[index] = updatedDiscount;
        }
        
        // Update current discount if it matches
        if (state.currentDiscount?._id === updatedDiscount._id) {
          state.currentDiscount = updatedDiscount;
        }
        
        state.updateError = null;
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Failed to update discount';
      });

    // Get Discount by Code
    builder
      .addCase(getDiscountByCode.pending, setLoading)
      .addCase(getDiscountByCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDiscount = action.payload.data;
        state.error = null;
      })
      .addCase(getDiscountByCode.rejected, setFailed);

    // Get All Discounts
    builder
      .addCase(getAllDiscounts.pending, setLoading)
      .addCase(getAllDiscounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discounts = action.payload.data.discounts;
        state.totalDiscounts = action.payload.data.total;
        state.currentPage = action.payload.data.currentPage;
        state.totalPages = action.payload.data.totalPages;
        state.limit = action.payload.data.limit;
        state.error = null;
      })
      .addCase(getAllDiscounts.rejected, setFailed);

    // Delete Discount
    builder
      .addCase(deleteDiscount.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.discounts = state.discounts.filter(discount => discount._id !== action.payload.id);
        state.totalDiscounts = Math.max(0, state.totalDiscounts - 1);
        
        // Clear current discount if it was deleted
        if (state.currentDiscount?._id === action.payload.id) {
          state.currentDiscount = null;
        }
        
        state.deleteError = null;
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'Failed to delete discount';
      });

    // Get Expired Discounts
    builder
      .addCase(getExpiredDiscounts.pending, (state) => {
        state.expiredLoading = true;
        state.expiredError = null;
      })
      .addCase(getExpiredDiscounts.fulfilled, (state, action) => {
        state.expiredLoading = false;
        state.expiredDiscounts = action.payload.data;
        state.expiredError = null;
      })
      .addCase(getExpiredDiscounts.rejected, (state, action) => {
        state.expiredLoading = false;
        state.expiredError = action.payload || 'Failed to fetch expired discounts';
      });

    // Apply Discount
    builder
      .addCase(applyDiscount.pending, (state) => {
        state.applyLoading = true;
        state.applyError = null;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.applyLoading = false;
        state.appliedDiscount = action.payload.data.discount;
        state.discountAmount = action.payload.data.discountAmount;
        state.finalTotal = action.payload.data.finalTotal;
        state.applyError = null;
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.applyLoading = false;
        state.applyError = action.payload || 'Failed to apply discount';
      });

    // Get Active Discounts
    builder
      .addCase(getActiveDiscounts.pending, (state) => {
        state.activeLoading = true;
        state.activeError = null;
      })
      .addCase(getActiveDiscounts.fulfilled, (state, action) => {
        state.activeLoading = false;
        state.activeDiscounts = action.payload.data;
        state.activeError = null;
      })
      .addCase(getActiveDiscounts.rejected, (state, action) => {
        state.activeLoading = false;
        state.activeError = action.payload || 'Failed to fetch active discounts';
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearCurrentDiscount,
  clearAppliedDiscount,
  setCurrentPage,
  setAppliedDiscount,
  resetDiscountState,
  filterDiscountsByType,
} = discountSlice.actions;

// Selectors
export const selectDiscount = (state: { discount: DiscountState }) => state.discount;
export const selectDiscounts = (state: { discount: DiscountState }) => state.discount.discounts;
export const selectActiveDiscounts = (state: { discount: DiscountState }) => state.discount.activeDiscounts;
export const selectExpiredDiscounts = (state: { discount: DiscountState }) => state.discount.expiredDiscounts;
export const selectCurrentDiscount = (state: { discount: DiscountState }) => state.discount.currentDiscount;
export const selectAppliedDiscount = (state: { discount: DiscountState }) => state.discount.appliedDiscount;
export const selectDiscountLoading = (state: { discount: DiscountState }) => state.discount.isLoading;
export const selectDiscountError = (state: { discount: DiscountState }) => state.discount.error;
export const selectCreateDiscountLoading = (state: { discount: DiscountState }) => state.discount.createLoading;
export const selectCreateDiscountError = (state: { discount: DiscountState }) => state.discount.createError;
export const selectUpdateDiscountLoading = (state: { discount: DiscountState }) => state.discount.updateLoading;
export const selectUpdateDiscountError = (state: { discount: DiscountState }) => state.discount.updateError;
export const selectDeleteDiscountLoading = (state: { discount: DiscountState }) => state.discount.deleteLoading;
export const selectDeleteDiscountError = (state: { discount: DiscountState }) => state.discount.deleteError;
export const selectApplyDiscountLoading = (state: { discount: DiscountState }) => state.discount.applyLoading;
export const selectApplyDiscountError = (state: { discount: DiscountState }) => state.discount.applyError;
export const selectActiveDiscountLoading = (state: { discount: DiscountState }) => state.discount.activeLoading;
export const selectActiveDiscountError = (state: { discount: DiscountState }) => state.discount.activeError;
export const selectExpiredDiscountLoading = (state: { discount: DiscountState }) => state.discount.expiredLoading;
export const selectExpiredDiscountError = (state: { discount: DiscountState }) => state.discount.expiredError;
export const selectDiscountAmount = (state: { discount: DiscountState }) => state.discount.discountAmount;
export const selectFinalTotal = (state: { discount: DiscountState }) => state.discount.finalTotal;
export const selectTotalDiscounts = (state: { discount: DiscountState }) => state.discount.totalDiscounts;
export const selectCurrentPage = (state: { discount: DiscountState }) => state.discount.currentPage;
export const selectTotalPages = (state: { discount: DiscountState }) => state.discount.totalPages;

// Computed selectors
export const selectDiscountsByType = (type: 'coupon' | 'voucher') => (state: { discount: DiscountState }) =>
  state.discount.discounts.filter(discount => discount.type === type);

export const selectValidDiscounts = (state: { discount: DiscountState }) =>
  state.discount.discounts.filter(discount => 
    discount.isActive && new Date(discount.validUntil) > new Date()
  );

export const selectDiscountUsageRate = (discountId: string) => (state: { discount: DiscountState }) => {
  const discount = state.discount.discounts.find(d => d._id === discountId);
  if (!discount || !discount.usageLimit) return null;
  return (discount.usedCount / discount.usageLimit) * 100;
};

// Export reducer
export default discountSlice.reducer;