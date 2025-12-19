import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types and Interfaces
export interface WishlistItem {
  _id: string;
  product: string;
  addedAt: string;
  priceWhenAdded: number;
}

export interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
  isPublic: boolean;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WishlistResponse {
  data: Wishlist;
  statusCode: number;
  success: boolean;
}

export interface WishlistCheckResponse {
  data: {
    exists: boolean;
  };
  statusCode: number;
  success: boolean;
}

export interface WishlistCountResponse {
  data: {
    count: number;
  };
  statusCode: number;
  success: boolean;
}

export interface WishlistToggleResponse {
  data: {
    action: 'added' | 'removed';
    message: string;
  };
  statusCode: number;
  success: boolean;
}

export interface WishlistMoveToCartResponse {
  data: {
    message: string;
    wishlist: Wishlist;
  };
  statusCode: number;
  success: boolean;
}

export interface CreateWishlistRequest {
  name: string;
  isPublic: boolean;
}

export interface AddToWishlistRequest {
  productId: string;
  priceWhenAdded: number;
}

export interface ToggleWishlistRequest {
  productId: string;
  priceWhenAdded: number;
}

export interface WishlistState {
  wishlist: Wishlist | null;
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  addLoading: boolean;
  addError: string | null;
  removeLoading: boolean;
  removeError: string | null;
  toggleLoading: boolean;
  toggleError: string | null;
  checkLoading: boolean;
  checkError: string | null;
  countLoading: boolean;
  countError: string | null;
  moveToCartLoading: boolean;
  moveToCartError: string | null;
  itemCount: number;
  checkedItems: { [productId: string]: boolean };
}

// Initial State
const initialState: WishlistState = {
  wishlist: null,
  items: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  addLoading: false,
  addError: null,
  removeLoading: false,
  removeError: null,
  toggleLoading: false,
  toggleError: null,
  checkLoading: false,
  checkError: null,
  countLoading: false,
  countError: null,
  moveToCartLoading: false,
  moveToCartError: null,
  itemCount: 0,
  checkedItems: {},
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

// Create Wishlist
export const createWishlist = createAsyncThunk<
  WishlistResponse,
  CreateWishlistRequest,
  { rejectValue: string }
>('wishlist/create', async (wishlistData, { rejectWithValue }) => {
  try {
    const response = await apiCall('/wishlist/create', {
      method: 'POST',
      body: JSON.stringify(wishlistData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create wishlist');
  }
});

// Get Wishlist
export const fetchWishlist = createAsyncThunk<
  WishlistResponse,
  void,
  { rejectValue: string }
>('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/wishlist');
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch wishlist');
  }
});

// Add to Wishlist
export const addToWishlist = createAsyncThunk<
  WishlistResponse,
  AddToWishlistRequest,
  { rejectValue: string }
>('wishlist/add', async (item, { rejectWithValue }) => {
  try {
    const response = await apiCall('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to add item to wishlist');
  }
});

// Check if Product is in Wishlist
export const checkWishlistItem = createAsyncThunk<
  WishlistCheckResponse & { productId: string },
  string,
  { rejectValue: string }
>('wishlist/check', async (productId, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/wishlist/check/${productId}`);
    return { ...response, productId };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to check wishlist item');
  }
});

// Toggle Wishlist Item
export const toggleWishlistItem = createAsyncThunk<
  WishlistToggleResponse,
  ToggleWishlistRequest,
  { rejectValue: string }
>('wishlist/toggle', async (item, { rejectWithValue }) => {
  try {
    const response = await apiCall('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle wishlist item');
  }
});

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk<
  { productId: string },
  string,
  { rejectValue: string }
>('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    await apiCall(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
    return { productId };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove item from wishlist');
  }
});

// Get Wishlist Count
export const fetchWishlistCount = createAsyncThunk<
  WishlistCountResponse,
  void,
  { rejectValue: string }
>('wishlist/count', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/wishlist/count');
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch wishlist count');
  }
});

// Move to Cart
export const moveToCart = createAsyncThunk<
  WishlistMoveToCartResponse,
  string,
  { rejectValue: string }
>('wishlist/moveToCart', async (productId, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/wishlist/move-to-cart/${productId}`, {
      method: 'POST',
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to move item to cart');
  }
});

// Wishlist Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Clear Errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.addError = null;
      state.removeError = null;
      state.toggleError = null;
      state.checkError = null;
      state.countError = null;
      state.moveToCartError = null;
    },

    // Clear Wishlist State
    clearWishlistState: (state) => {
      state.wishlist = null;
      state.items = [];
      state.itemCount = 0;
      state.checkedItems = {};
    },

    // Set Wishlist Items
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.length;
    },

    // Update Checked Items (for product existence tracking)
    updateCheckedItems: (state, action: PayloadAction<{ productId: string; exists: boolean }>) => {
      const { productId, exists } = action.payload;
      state.checkedItems[productId] = exists;
    },

    // Remove Item Locally (for optimistic updates)
    removeItemLocally: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product !== productId);
      state.itemCount = state.items.length;
      state.checkedItems[productId] = false;
    },

    // Add Item Locally (for optimistic updates)
    addItemLocally: (state, action: PayloadAction<WishlistItem>) => {
      const existingIndex = state.items.findIndex(item => item.product === action.payload.product);
      if (existingIndex === -1) {
        state.items.push(action.payload);
        state.itemCount = state.items.length;
        state.checkedItems[action.payload.product] = true;
      }
    },

    // Reset Wishlist State
    resetWishlistState: (state) => {
      state.loading = false;
      state.error = null;
      state.createLoading = false;
      state.createError = null;
      state.addLoading = false;
      state.addError = null;
      state.removeLoading = false;
      state.removeError = null;
      state.toggleLoading = false;
      state.toggleError = null;
      state.checkLoading = false;
      state.checkError = null;
      state.countLoading = false;
      state.countError = null;
      state.moveToCartLoading = false;
      state.moveToCartError = null;
    },
  },
  extraReducers: (builder) => {
    // Helper functions for common state updates
    const setLoading = (state: WishlistState) => {
      state.loading = true;
      state.error = null;
    };

    const setFailed = (state: WishlistState, action: any) => {
      state.loading = false;
      state.error = action.payload;
    };

    // Create Wishlist
    builder
      .addCase(createWishlist.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.createLoading = false;
        state.wishlist = action.payload.data;
        state.items = action.payload.data.items || [];
        state.itemCount = action.payload.data.items?.length || 0;
        state.createError = null;
      })
      .addCase(createWishlist.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create wishlist';
      });

    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, setLoading)
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.data;
        state.items = action.payload.data.items || [];
        state.itemCount = action.payload.data.items?.length || 0;
        
        // Update checked items for existing products
        state.items.forEach(item => {
          state.checkedItems[item.product] = true;
        });
        
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, setFailed);

    // Add to Wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.addLoading = false;
        state.wishlist = action.payload.data;
        state.items = action.payload.data.items || [];
        state.itemCount = action.payload.data.items?.length || 0;
        
        // Update checked items
        state.items.forEach(item => {
          state.checkedItems[item.product] = true;
        });
        
        state.addError = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload || 'Failed to add item to wishlist';
      });

    // Check Wishlist Item
    builder
      .addCase(checkWishlistItem.pending, (state) => {
        state.checkLoading = true;
        state.checkError = null;
      })
      .addCase(checkWishlistItem.fulfilled, (state, action) => {
        state.checkLoading = false;
        state.checkedItems[action.payload.productId] = action.payload.data.exists;
        state.checkError = null;
      })
      .addCase(checkWishlistItem.rejected, (state, action) => {
        state.checkLoading = false;
        state.checkError = action.payload || 'Failed to check wishlist item';
      });

    // Toggle Wishlist Item
    builder
      .addCase(toggleWishlistItem.pending, (state) => {
        state.toggleLoading = true;
        state.toggleError = null;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.toggleLoading = false;
        // The toggle response doesn't return the updated wishlist, so we need to refetch
        // or handle the action based on the response
        state.toggleError = null;
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.toggleLoading = false;
        state.toggleError = action.payload || 'Failed to toggle wishlist item';
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.removeLoading = true;
        state.removeError = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.removeLoading = false;
        const productId = action.payload.productId;
        state.items = state.items.filter(item => item.product !== productId);
        state.itemCount = state.items.length;
        state.checkedItems[productId] = false;
        state.removeError = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.removeLoading = false;
        state.removeError = action.payload || 'Failed to remove item from wishlist';
      });

    // Fetch Wishlist Count
    builder
      .addCase(fetchWishlistCount.pending, (state) => {
        state.countLoading = true;
        state.countError = null;
      })
      .addCase(fetchWishlistCount.fulfilled, (state, action) => {
        state.countLoading = false;
        state.itemCount = action.payload.data.count;
        state.countError = null;
      })
      .addCase(fetchWishlistCount.rejected, (state, action) => {
        state.countLoading = false;
        state.countError = action.payload || 'Failed to fetch wishlist count';
      });

    // Move to Cart
    builder
      .addCase(moveToCart.pending, (state) => {
        state.moveToCartLoading = true;
        state.moveToCartError = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.moveToCartLoading = false;
        state.wishlist = action.payload.data.wishlist;
        state.items = action.payload.data.wishlist.items || [];
        state.itemCount = action.payload.data.wishlist.items?.length || 0;
        
        // Update checked items
        state.items.forEach(item => {
          state.checkedItems[item.product] = true;
        });
        
        state.moveToCartError = null;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.moveToCartLoading = false;
        state.moveToCartError = action.payload || 'Failed to move item to cart';
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearWishlistState,
  setWishlistItems,
  updateCheckedItems,
  removeItemLocally,
  addItemLocally,
  resetWishlistState,
} = wishlistSlice.actions;

// Selectors
export const selectWishlist = (state: { wishlist: WishlistState }) => state.wishlist;
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.loading;
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error;
export const selectWishlistItemCount = (state: { wishlist: WishlistState }) => state.wishlist.itemCount;
export const selectCheckedItems = (state: { wishlist: WishlistState }) => state.wishlist.checkedItems;
export const selectCreateWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.createLoading;
export const selectCreateWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.createError;
export const selectAddToWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.addLoading;
export const selectAddToWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.addError;
export const selectRemoveFromWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.removeLoading;
export const selectRemoveFromWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.removeError;
export const selectToggleWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.toggleLoading;
export const selectToggleWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.toggleError;
export const selectCheckWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.checkLoading;
export const selectCheckWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.checkError;
export const selectWishlistCountLoading = (state: { wishlist: WishlistState }) => state.wishlist.countLoading;
export const selectWishlistCountError = (state: { wishlist: WishlistState }) => state.wishlist.countError;
export const selectMoveToCartLoading = (state: { wishlist: WishlistState }) => state.wishlist.moveToCartLoading;
export const selectMoveToCartError = (state: { wishlist: WishlistState }) => state.wishlist.moveToCartError;

// Computed selectors
export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) => 
  state.wishlist.checkedItems[productId] || false;

export const selectWishlistItemByProductId = (productId: string) => (state: { wishlist: WishlistState }) => 
  state.wishlist.items.find(item => item.product === productId);

export const selectWishlistTotalValue = (state: { wishlist: WishlistState }) => 
  state.wishlist.items.reduce((total, item) => total + item.priceWhenAdded, 0);

// Export reducer
export default wishlistSlice.reducer;