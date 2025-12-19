// redux1/blogsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface BlogContent {
  design: any; // You can define this more specifically if needed
  markup: string; // This contains the HTML content
}

export interface Blog {
  _id: string;
  title: string;
  blogName?: string;
  content?: string; // Keep this for backwards compatibility or other content
  blogContent?: BlogContent; // Add this for the new structure
  blogImgUrl?: {
    url: string;
    publicId?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface BlogsResponse {
  data: Blog[];
  statusCode: number;
  success: boolean;
}

export interface BlogResponse {
  data: Blog;
  statusCode: number;
  success: boolean;
}

export interface BlogsState {
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogsState = {
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
};

const BASE_URL = "https://api.daadis.in";

const apiCall = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Async thunk to get all blogs
export const getAllBlogs = createAsyncThunk<Blog[], void, { rejectValue: string }>(
  'blogs/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response: BlogsResponse = await apiCall('/blog');
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch blogs');
    }
  }
);

// Async thunk to get blog by ID
export const getBlogById = createAsyncThunk<Blog, string, { rejectValue: string }>(
  'blogs/getById',
  async (blogId, { rejectWithValue }) => {
    try {
      const response: BlogResponse = await apiCall(`/blog/${blogId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch blog');
    }
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllBlogs
      .addCase(getAllBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.isLoading = false;
        state.blogs = action.payload;
        state.error = null;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch blogs';
      })
      
      // getBlogById
      .addCase(getBlogById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
        state.error = null;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch blog';
      });
  }
});

export const { clearCurrentBlog, clearError } = blogsSlice.actions;

export const selectBlogs = (state: { blogs: BlogsState }) => state.blogs.blogs;
export const selectCurrentBlog = (state: { blogs: BlogsState }) => state.blogs.currentBlog;
export const selectBlogsLoading = (state: { blogs: BlogsState }) => state.blogs.isLoading;
export const selectBlogsError = (state: { blogs: BlogsState }) => state.blogs.error;

export default blogsSlice.reducer;