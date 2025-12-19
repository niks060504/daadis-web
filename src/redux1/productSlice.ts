import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types and Interfaces
export interface Dimensions {
  l: number;
  b: number;
  h: number;
}

export interface Weight {
  number: number;
  unit: string;
}

export interface Rating {
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Product {
  product: any;
  _id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  isActive: boolean;
  tags: string[];
  dimensions: Dimensions;
  stock: number;
  vegetarian: boolean;
  quantitySold: number;
  weight: Weight;
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductResponse {
  data: Product;
  statusCode: number;
  success: boolean;
}

export interface ProductsResponse {
  data: {
    products: Product[];
    total: number;
    page: number;
    pages: number;
  };
  statusCode: number;
  success: boolean;
}

export interface ProductSearchResponse {
  data: {
    products: Product[];
    total: number;
    page: number;
    pages: number;
  };
  statusCode: number;
  success: boolean;
}

export interface CreateProductRequest {
  name: string;
  code: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  isActive?: boolean;
  tags: string[];
  dimensions: Dimensions;
  stock: number;
  vegetarian: boolean;
  weight: Weight;
}

export interface UpdateProductRequest {
  name?: string;
  code?: string;
  category?: string;
  price?: number;
  description?: string;
  images?: string[];
  isActive?: boolean;
  tags?: string[];
  dimensions?: Dimensions;
  stock?: number;
  vegetarian?: boolean;
  weight?: Weight;
}

export interface SearchProductsParams {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  vegetarian?: boolean;
  inStock?: boolean;
}

export interface GetProductsByCategoryParams {
  categoryId: string;
  page?: number;
  limit?: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  searchResults: Product[];
  categoryProducts: Product[];
  isLoading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  searchLoading: boolean;
  searchError: string | null;
  categoryLoading: boolean;
  categoryError: string | null;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  searchTotalProducts: number;
  searchCurrentPage: number;
  searchTotalPages: number;
  categoryTotalProducts: number;
  categoryCurrentPage: number;
  categoryTotalPages: number;
}

// Initial State
const initialState: ProductState = {
  products: [],
  currentProduct: null,
  searchResults: [],
  categoryProducts: [],
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  searchLoading: false,
  searchError: null,
  categoryLoading: false,
  categoryError: null,
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  searchTotalProducts: 0,
  searchCurrentPage: 1,
  searchTotalPages: 1,
  categoryTotalProducts: 0,
  categoryCurrentPage: 1,
  categoryTotalPages: 1,
};

// Base URL - Updated with your provided URL
const BASE_URL = "https://api.daadis.in";

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

// Create Product (Admin only)
export const createProduct = createAsyncThunk<
  ProductResponse,
  CreateProductRequest,
  { rejectValue: string }
>('product/create', async (productData, { rejectWithValue }) => {
  try {
    const response = await apiCall('/product/create', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create product');
  }
});

// Update Product (Admin only)
export const updateProduct = createAsyncThunk<
  ProductResponse,
  { id: string; data: UpdateProductRequest },
  { rejectValue: string }
>('product/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/product/update/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update product');
  }
});

// Get Product by ID
export const getProductById = createAsyncThunk<
  ProductResponse,
  string,
  { rejectValue: string }
>('product/getById', async (productId, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/product/${productId}`);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch product');
  }
});

// Delete Product (Admin only)
export const deleteProduct = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>('product/delete', async (productId, { rejectWithValue }) => {
  try {
    await apiCall(`/product/${productId}`, {
      method: 'DELETE',
    });
    return { id: productId };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete product');
  }
});

// Search Products
export const searchProducts = createAsyncThunk<
  ProductSearchResponse,
  SearchProductsParams,
  { rejectValue: string }
>('product/search', async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.append('q', params.q);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.vegetarian !== undefined) searchParams.append('vegetarian', params.vegetarian.toString());
    if (params.inStock !== undefined) searchParams.append('inStock', params.inStock.toString());
    
    const queryString = searchParams.toString();
    const url = `/product/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall(url);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to search products');
  }
});

// Get All Products
export const getAllProducts = createAsyncThunk<
  ProductsResponse,
  GetProductsParams | void,
  { rejectValue: string }
>('product/getAll', async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    
    // default to page 1
    searchParams.append('page', (params?.page ?? 1).toString());
      // default to a high limit to fetch all
    searchParams.append('limit', (params?.limit ?? 1000).toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    
    const queryString = searchParams.toString();
    const url = `/product/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall(url);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
  }
});

// Get Products by Category
export const getProductsByCategory = createAsyncThunk<
  ProductsResponse,
  GetProductsByCategoryParams,
  { rejectValue: string }
>('product/getByCategory', async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/product/category/${params.categoryId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall(url);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products by category');
  }
});

// Product Slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Clear Errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.searchError = null;
      state.categoryError = null;
    },
    
    // Clear Current Product
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    
    // Clear Search Results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
      state.searchTotalProducts = 0;
      state.searchCurrentPage = 1;
      state.searchTotalPages = 1;
    },
    
    // Clear Category Products
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
      state.categoryError = null;
      state.categoryTotalProducts = 0;
      state.categoryCurrentPage = 1;
      state.categoryTotalPages = 1;
    },
    
    // Set Current Page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    // Set Search Current Page
    setSearchCurrentPage: (state, action: PayloadAction<number>) => {
      state.searchCurrentPage = action.payload;
    },
    
    // Set Category Current Page
    setCategoryCurrentPage: (state, action: PayloadAction<number>) => {
      state.categoryCurrentPage = action.payload;
    },
    
    // Reset Product State
    resetProductState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.createLoading = false;
      state.createError = null;
      state.updateLoading = false;
      state.updateError = null;
      state.deleteLoading = false;
      state.deleteError = null;
      state.searchLoading = false;
      state.searchError = null;
      state.categoryLoading = false;
      state.categoryError = null;
    },
    
    // Update Product Stock (for real-time updates)
    updateProductStock: (state, action: PayloadAction<{ productId: string; newStock: number; quantitySold: number }>) => {
      const { productId, newStock, quantitySold } = action.payload;
      
      // Update in main products array
      const productIndex = state.products.findIndex(product => product._id === productId);
      if (productIndex !== -1) {
        state.products[productIndex].stock = newStock;
        state.products[productIndex].quantitySold = quantitySold;
      }
      
      // Update in search results
      const searchIndex = state.searchResults.findIndex(product => product._id === productId);
      if (searchIndex !== -1) {
        state.searchResults[searchIndex].stock = newStock;
        state.searchResults[searchIndex].quantitySold = quantitySold;
      }
      
      // Update in category products
      const categoryIndex = state.categoryProducts.findIndex(product => product._id === productId);
      if (categoryIndex !== -1) {
        state.categoryProducts[categoryIndex].stock = newStock;
        state.categoryProducts[categoryIndex].quantitySold = quantitySold;
      }
      
      // Update current product if it matches
      if (state.currentProduct?._id === productId) {
        state.currentProduct.stock = newStock;
        state.currentProduct.quantitySold = quantitySold;
      }
    },
  },
  extraReducers: (builder) => {
    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.products.unshift(action.payload.data);
        state.createError = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create product';
      });

    // Update Product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedProduct = action.payload.data;
        
        // Update in main products array
        const index = state.products.findIndex(product => product._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        
        // Update current product if it matches
        if (state.currentProduct?._id === updatedProduct._id) {
          state.currentProduct = updatedProduct;
        }
        
        state.updateError = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Failed to update product';
      });

    // Get Product by ID
    builder
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.data;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch product';
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.products = state.products.filter(product => product._id !== action.payload.id);
        if (state.currentProduct?._id === action.payload.id) {
          state.currentProduct = null;
        }
        state.deleteError = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'Failed to delete product';
      });

    // Search Products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data.products;
        state.searchTotalProducts = action.payload.data.total;
        state.searchCurrentPage = action.payload.data.page;
        state.searchTotalPages = action.payload.data.pages;
        state.searchError = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload || 'Failed to search products';
      });

    // Get All Products
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data.products;
        state.totalProducts = action.payload.data.total;
        state.currentPage = action.payload.data.page;
        state.totalPages = action.payload.data.pages;
        state.error = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch products';
      });

    // Get Products by Category
    builder
      .addCase(getProductsByCategory.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categoryProducts = action.payload.data.products;
        state.categoryTotalProducts = action.payload.data.total;
        state.categoryCurrentPage = action.payload.data.page;
        state.categoryTotalPages = action.payload.data.pages;
        state.categoryError = null;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload || 'Failed to fetch products by category';
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearCurrentProduct,
  clearSearchResults,
  clearCategoryProducts,
  setCurrentPage,
  setSearchCurrentPage,
  setCategoryCurrentPage,
  resetProductState,
  updateProductStock,
} = productSlice.actions;

// Selectors
export const selectProduct = (state: { product: ProductState }) => state.product;
export const selectProducts = (state: { product: ProductState }) => state.product.products;
export const selectCurrentProduct = (state: { product: ProductState }) => state.product.currentProduct;
export const selectSearchResults = (state: { product: ProductState }) => state.product.searchResults;
export const selectCategoryProducts = (state: { product: ProductState }) => state.product.categoryProducts;
export const selectProductLoading = (state: { product: ProductState }) => state.product.isLoading;
export const selectProductError = (state: { product: ProductState }) => state.product.error;
export const selectCreateProductLoading = (state: { product: ProductState }) => state.product.createLoading;
export const selectCreateProductError = (state: { product: ProductState }) => state.product.createError;
export const selectUpdateProductLoading = (state: { product: ProductState }) => state.product.updateLoading;
export const selectUpdateProductError = (state: { product: ProductState }) => state.product.updateError;
export const selectDeleteProductLoading = (state: { product: ProductState }) => state.product.deleteLoading;
export const selectDeleteProductError = (state: { product: ProductState }) => state.product.deleteError;
export const selectSearchProductLoading = (state: { product: ProductState }) => state.product.searchLoading;
export const selectSearchProductError = (state: { product: ProductState }) => state.product.searchError;
export const selectCategoryProductLoading = (state: { product: ProductState }) => state.product.categoryLoading;
export const selectCategoryProductError = (state: { product: ProductState }) => state.product.categoryError;
export const selectTotalProducts = (state: { product: ProductState }) => state.product.totalProducts;
export const selectCurrentPage = (state: { product: ProductState }) => state.product.currentPage;
export const selectTotalPages = (state: { product: ProductState }) => state.product.totalPages;
export const selectSearchTotalProducts = (state: { product: ProductState }) => state.product.searchTotalProducts;
export const selectSearchCurrentPage = (state: { product: ProductState }) => state.product.searchCurrentPage;
export const selectSearchTotalPages = (state: { product: ProductState }) => state.product.searchTotalPages;
export const selectCategoryTotalProducts = (state: { product: ProductState }) => state.product.categoryTotalProducts;
export const selectCategoryCurrentPage = (state: { product: ProductState }) => state.product.categoryCurrentPage;
export const selectCategoryTotalPages = (state: { product: ProductState }) => state.product.categoryTotalPages;

// Export reducer
export default productSlice.reducer;