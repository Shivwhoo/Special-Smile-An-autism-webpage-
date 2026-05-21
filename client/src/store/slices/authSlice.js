import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { toast } from 'sonner';

// Async thunks
export const checkUser = createAsyncThunk(
  'auth/checkUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/profile');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Not authenticated');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      toast.success('Logged in successfully');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      toast.success('Registration successful');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      toast.success('Logged out successfully');
      return null;
    } catch (error) {
      const message = error.response?.data?.message || 'Logout failed';
      toast.error('Logout failed');
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  loading: true, // Initially true while we check if the user is authenticated
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Check User
    builder.addCase(checkUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(checkUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    });

    // Login User
    builder.addCase(loginUser.pending, (state) => {
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.user = null;
      state.error = action.payload;
    });

    // Register User
    builder.addCase(registerUser.pending, (state) => {
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.user = null;
      state.error = action.payload;
    });

    // Logout User
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.error = null;
    });
  },
});

export default authSlice.reducer;
