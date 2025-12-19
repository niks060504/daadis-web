//cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

// Types and Interfaces
export interface CartItem {
  _id: string;
  product: string | ProductInfo;
  quantity: number;
  addedAt: string;
  itemTotal?: number;
}

export interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export interface AppliedCoupon {
  code: string;
  discountId: string;
  discountAmount: number;
}

export interface AppliedVoucher {
  [key: string]: any; // Define based on your voucher structure
}

export interface Cart {
  totals: any;
  discountType: string;
  value: number;
  maxDiscount: any;
  _id: string;
  user: string;
  items: CartItem[];
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  appliedCoupon?: AppliedCoupon;
  appliedVoucher?: AppliedVoucher;
}

export interface CartTotals {
  subtotal: number;
  discountAmount: number;
  total: number;
  itemCount: number;
}

export interface CartResponse {
  data: Cart;
  statusCode: number;
  success: boolean;
}

export interface CartDetailsResponse {
  data: {
    cart: {
      _id: string;
      user: string;
      appliedCoupon: AppliedCoupon;
      appliedVoucher: AppliedVoucher;
    };
    items: CartItem[];
    totals: CartTotals;
  };
  statusCode: number;
  success: boolean;
}

export interface AddToCartRequest {
  product: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ApplyDiscountRequest {
  code: string;
  type: 'coupon' | 'voucher';
}

export interface CartState {
  cart: Cart | null;
  items: CartItem[];
  totals: CartTotals | null;
  loading: boolean;
  error: string | null;
  appliedCoupon: AppliedCoupon | null;
  appliedVoucher: AppliedVoucher | null;
  addLoading: boolean;
  addError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  removeLoading: boolean;
  removeError: string | null;
  discountLoading: boolean;
  discountError: string | null;
  removeDiscountLoading: boolean;
  removeDiscountError: string | null;
  clearLoading: boolean;
  clearError: string | null;
}

// Initial State
const initialState: CartState = {
  cart: null,
  items: [],
  totals: null,
  loading: false,
  error: null,
  appliedCoupon: null,
  appliedVoucher: null,
  addLoading: false,
  addError: null,
  updateLoading: false,
  updateError: null,
  removeLoading: false,
  removeError: null,
  discountLoading: false,
  discountError: null,
  removeDiscountLoading: false,
  removeDiscountError: null,
  clearLoading: false,
  clearError: null,
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

// Fetch Cart
export const fetchCart = createAsyncThunk<
  CartResponse,
  void,
  { rejectValue: string }
>('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/cart');
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch cart');
  }
});

// Fetch Cart Details (with populated product info and totals)
export const fetchCartDetails = createAsyncThunk<
  CartDetailsResponse,
  void,
  { rejectValue: string }
>('cart/fetchCartDetails', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/cart/details', {
        headers: {
          'Cache-Control': 'no-cache',
        },
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch cart details');
  }
});

export const addToCart = createAsyncThunk<
  CartResponse,
  AddToCartRequest,
  { rejectValue: string }
>(
  'cart/addToCart',
  async (item, thunkAPI) => {
    try {
      const payload = {
        product: item.product,
        quantity: item.quantity ?? 1,
      };

      const response = await apiCall('/cart', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // After successful add, fetch updated cart
      await thunkAPI.dispatch(fetchCartDetails());

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to add item'
      );
    }
  }
);

// Update Cart Item
export const updateCartItem = createAsyncThunk<
  CartResponse,
  { itemId: string; data: UpdateCartItemRequest },
  { rejectValue: string }
>('cart/updateCartItem', async ({ itemId, data }, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update cart item');
  }
});

// Remove Cart Item
export const removeCartItem = createAsyncThunk<
  CartResponse,
  string,
  { rejectValue: string }
>('cart/removeCartItem', async (itemId, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/cart/${itemId}`, {
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove cart item');
  }
});

// Apply Discount
export const applyDiscount = createAsyncThunk<
  CartResponse,
  ApplyDiscountRequest,
  { rejectValue: string }
>('cart/applyDiscount', async (discountData, { rejectWithValue }) => {
  try {
    const response = await apiCall('/cart/apply-discount', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });

    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to apply discount');
  }
});

// Remove Discount
export const removeDiscount = createAsyncThunk<
  CartResponse,
  void,
  { rejectValue: string }
>('cart/removeDiscount', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/cart/remove-discount', {
      method: 'DELETE',
      body: JSON.stringify({ type: 'all' }),
    });

    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove discount');
  }
});

// Clear Cart
export const clearCart = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/cart/clear', {
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to clear cart');
  }
});

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set Cart Items
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // Set Totals
    setTotals: (state, action: PayloadAction<CartTotals>) => {
      state.totals = action.payload;
    },

    // Clear Errors
    clearErrors: (state) => {
      state.error = null;
      state.addError = null;
      state.updateError = null;
      state.removeError = null;
      state.discountError = null;
      state.removeDiscountError = null;
      state.clearError = null;
    },

    // Clear Cart State
    clearCartState: (state) => {
      state.cart = null;
      state.items = [];
      state.totals = null;
      state.appliedCoupon = null;
      state.appliedVoucher = null;
    },

    // Clear Applied Discount (for local state management)
    clearAppliedDiscount: (state) => {
      state.appliedCoupon = null;
      state.appliedVoucher = null;
    },

    // Update Item Quantity Locally (for optimistic updates)
    updateItemQuantityLocally: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item._id === itemId);
      if (item) {
        item.quantity = quantity;
        // Recalculate item total if product info is available
        if (typeof item.product === 'object' && item.product.price) {
          item.itemTotal = item.product.price * quantity;
        }
      }
    },

    // Remove Item Locally (for optimistic updates)
    removeItemLocally: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);
    },

    // Reset Cart State
    resetCartState: (state) => {
      state.loading = false;
      state.error = null;
      state.addLoading = false;
      state.addError = null;
      state.updateLoading = false;
      state.updateError = null;
      state.removeLoading = false;
      state.removeError = null;
      state.discountLoading = false;
      state.discountError = null;
      state.removeDiscountLoading = false;
      state.removeDiscountError = null;
      state.clearLoading = false;
      state.clearError = null;
    },
  },
  extraReducers: (builder) => {
    // Helper functions for common state updates
    const setLoading = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };

    const setFailed = (state: CartState, action: any) => {
      state.loading = false;
      state.error = action.payload;
    };

    // Fetch Cart
    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
        state.items = action.payload.data.items || [];
        state.appliedCoupon = action.payload.data.appliedCoupon || null;
        state.appliedVoucher = action.payload.data.appliedVoucher || null;
        state.error = null;
      })
      .addCase(fetchCart.rejected, setFailed);

    // Fetch Cart Details
    builder
      .addCase(fetchCartDetails.pending, setLoading)
      .addCase(fetchCartDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data.cart as Cart;
        state.items = action.payload.data.items || [];
        state.totals = action.payload.data.totals || null;
        state.appliedCoupon = action.payload.data.cart.appliedCoupon || null;
        state.appliedVoucher = action.payload.data.cart.appliedVoucher || null;
        state.error = null;
      })
      .addCase(fetchCartDetails.rejected, setFailed);

    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addLoading = false;
        state.cart = action.payload.data;
        state.items = action.payload.data.items || [];
        state.addError = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload || 'Failed to add item to cart';
      });

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.cart = action.payload.data;
        state.items = action.payload.data.items || [];
        state.updateError = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Failed to update cart item';
      });

    // Remove Cart Item
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.removeLoading = true;
        state.removeError = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.removeLoading = false;
        state.cart = action.payload.data;
        state.items = action.payload.data.items || [];
        state.removeError = null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.removeLoading = false;
        state.removeError = action.payload || 'Failed to remove cart item';
      });

    // Apply Discount
    builder
      .addCase(applyDiscount.pending, (state) => {
        state.discountLoading = true;
        state.discountError = null;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.discountLoading = false;
        state.cart = action.payload.data;
        state.appliedCoupon = action.payload.data.appliedCoupon || null;
        state.appliedVoucher = action.payload.data.appliedVoucher || null;
        state.discountError = null;
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.discountLoading = false;
        state.discountError = action.payload || 'Failed to apply discount';
      });

    // Remove Discount
    builder
      .addCase(removeDiscount.pending, (state) => {
        state.removeDiscountLoading = true;
        state.removeDiscountError = null;
      })
      .addCase(removeDiscount.fulfilled, (state, action) => {
        state.removeDiscountLoading = false;
        state.cart = action.payload.data;
        state.appliedCoupon = null;
        state.appliedVoucher = null;
        state.removeDiscountError = null;
      })
      .addCase(removeDiscount.rejected, (state, action) => {
        state.removeDiscountLoading = false;
        state.removeDiscountError = action.payload || 'Failed to remove discount';
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.clearLoading = true;
        state.clearError = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.clearLoading = false;
        state.cart = null;
        state.items = [];
        state.totals = null;
        state.appliedCoupon = null;
        state.appliedVoucher = null;
        state.clearError = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.clearLoading = false;
        state.clearError = action.payload || 'Failed to clear cart';
      });
  },
});

// Export actions
export const {
  setCartItems,
  setTotals,
  clearErrors,
  clearCartState,
  clearAppliedDiscount,
  updateItemQuantityLocally,
  removeItemLocally,
  resetCartState,
} = cartSlice.actions;

// Selectors
export const selectCart = (state: { cart: CartState }) => state.cart;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotals = (state: { cart: CartState }) => state.cart.totals;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectAppliedCoupon = (state: { cart: CartState }) => state.cart.appliedCoupon;
export const selectAppliedVoucher = (state: { cart: CartState }) => state.cart.appliedVoucher;
export const selectAddToCartLoading = (state: { cart: CartState }) => state.cart.addLoading;
export const selectAddToCartError = (state: { cart: CartState }) => state.cart.addError;
export const selectUpdateCartLoading = (state: { cart: CartState }) => state.cart.updateLoading;
export const selectUpdateCartError = (state: { cart: CartState }) => state.cart.updateError;
export const selectRemoveCartLoading = (state: { cart: CartState }) => state.cart.removeLoading;
export const selectRemoveCartError = (state: { cart: CartState }) => state.cart.removeError;
export const selectDiscountLoading = (state: { cart: CartState }) => state.cart.discountLoading;
export const selectDiscountError = (state: { cart: CartState }) => state.cart.discountError;
export const selectRemoveDiscountLoading = (state: { cart: CartState }) => state.cart.removeDiscountLoading;
export const selectRemoveDiscountError = (state: { cart: CartState }) => state.cart.removeDiscountError;
export const selectClearCartLoading = (state: { cart: CartState }) => state.cart.clearLoading;
export const selectClearCartError = (state: { cart: CartState }) => state.cart.clearError;

// Computed selectors
export const selectCartItemCount = (state: { cart: CartState }) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartSubtotal = (state: { cart: CartState }) => 
  state.cart.totals?.subtotal || 0;

export const selectCartTotal = (state: { cart: CartState }) => 
  state.cart.totals?.total || 0;

export const selectCartDiscountAmount = (state: { cart: CartState }) => 
  state.cart.totals?.discountAmount || 0;

// Export reducer
export default cartSlice.reducer;

