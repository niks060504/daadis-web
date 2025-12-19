import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types and Interfaces
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CategoryResponse {
  data: Category;
  statusCode: number;
  success: boolean;
}

export interface CategoriesResponse {
  data: Category[];
  statusCode: number;
  success: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  image: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface SearchCategoriesParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  searchResults: Category[];
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
  totalCategories: number;
  currentPage: number;
  totalPages: number;
}

// Initial State
const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  searchResults: [],
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
  totalCategories: 0,
  currentPage: 1,
  totalPages: 1,
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

// Create Category (Admin only)
export const createCategory = createAsyncThunk<
  CategoryResponse,
  CreateCategoryRequest,
  { rejectValue: string }
>('category/create', async (categoryData, { rejectWithValue }) => {
  try {
    const response = await apiCall('/category/create', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create category');
  }
});

// Update Category (Admin only)
export const updateCategory = createAsyncThunk<
  CategoryResponse,
  { id: string; data: UpdateCategoryRequest },
  { rejectValue: string }
>('category/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update category');
  }
});

// Get Category by ID
export const getCategoryById = createAsyncThunk<
  CategoryResponse,
  string,
  { rejectValue: string }
>('category/getById', async (categoryId, { rejectWithValue }) => {
  try {
    const response = await apiCall(`/category/${categoryId}`);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch category');
  }
});

// Delete Category (Admin only)
export const deleteCategory = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>('category/delete', async (categoryId, { rejectWithValue }) => {
  try {
    await apiCall(`/category/${categoryId}`, {
      method: 'DELETE',
    });
    return { id: categoryId };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete category');
  }
});

// Search Categories
export const searchCategories = createAsyncThunk<
  CategoriesResponse,
  SearchCategoriesParams,
  { rejectValue: string }
>('category/search', async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.append('q', params.q);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/category/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall(url);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to search categories');
  }
});

// Get All Categories
export const getAllCategories = createAsyncThunk<
  CategoriesResponse,
  void,
  { rejectValue: string }
>('category/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiCall('/category');
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
  }
});

// Get Categories with Pagination
export const getCategoriesWithPagination = createAsyncThunk<
  CategoriesResponse,
  { page?: number; limit?: number },
  { rejectValue: string }
>('category/getAllWithPagination', async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/category${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall(url);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
  }
});

// Category Slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Clear Errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.searchError = null;
    },
    
    // Clear Current Category
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    
    // Clear Search Results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    
    // Set Current Page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    // Reset Category State
    resetCategoryState: (state) => {
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
    },
  },
  extraReducers: (builder) => {
    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.categories.unshift(action.payload.data);
        state.createError = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create category';
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedCategory = action.payload.data;
        const index = state.categories.findIndex(cat => cat._id === updatedCategory._id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
        if (state.currentCategory?._id === updatedCategory._id) {
          state.currentCategory = updatedCategory;
        }
        state.updateError = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Failed to update category';
      });

    // Get Category by ID
    builder
      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload.data;
        state.error = null;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch category';
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.categories = state.categories.filter(cat => cat._id !== action.payload.id);
        if (state.currentCategory?._id === action.payload.id) {
          state.currentCategory = null;
        }
        state.deleteError = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'Failed to delete category';
      });

    // Search Categories
    builder
      .addCase(searchCategories.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data;
        state.searchError = null;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload || 'Failed to search categories';
      });

    // Get All Categories
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        state.totalCategories = action.payload.data.length;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });

    // Get Categories with Pagination
    builder
      .addCase(getCategoriesWithPagination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoriesWithPagination.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        state.totalCategories = action.payload.data.length;
        state.error = null;
      })
      .addCase(getCategoriesWithPagination.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearCurrentCategory,
  clearSearchResults,
  setCurrentPage,
  resetCategoryState,
} = categorySlice.actions;

// Selectors
export const selectCategory = (state: { category: CategoryState }) => state.category;
export const selectCategories = (state: { category: CategoryState }) => state.category.categories;
export const selectCurrentCategory = (state: { category: CategoryState }) => state.category.currentCategory;
export const selectSearchResults = (state: { category: CategoryState }) => state.category.searchResults;
export const selectCategoryLoading = (state: { category: CategoryState }) => state.category.isLoading;
export const selectCategoryError = (state: { category: CategoryState }) => state.category.error;
export const selectCreateCategoryLoading = (state: { category: CategoryState }) => state.category.createLoading;
export const selectCreateCategoryError = (state: { category: CategoryState }) => state.category.createError;
export const selectUpdateCategoryLoading = (state: { category: CategoryState }) => state.category.updateLoading;
export const selectUpdateCategoryError = (state: { category: CategoryState }) => state.category.updateError;
export const selectDeleteCategoryLoading = (state: { category: CategoryState }) => state.category.deleteLoading;
export const selectDeleteCategoryError = (state: { category: CategoryState }) => state.category.deleteError;
export const selectSearchCategoryLoading = (state: { category: CategoryState }) => state.category.searchLoading;
export const selectSearchCategoryError = (state: { category: CategoryState }) => state.category.searchError;
export const selectTotalCategories = (state: { category: CategoryState }) => state.category.totalCategories;
export const selectCurrentPage = (state: { category: CategoryState }) => state.category.currentPage;
export const selectTotalPages = (state: { category: CategoryState }) => state.category.totalPages;

// Export reducer
export default categorySlice.reducer;