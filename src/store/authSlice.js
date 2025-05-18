import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface User {
  email: string;
  name: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'api/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {

      const response = await api.post('/api/login', credentials)
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue('Invalid email or password');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.clear();
  return true;
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;

        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('email', action.payload.user.email);
        localStorage.setItem('username', action.payload.user.username);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;