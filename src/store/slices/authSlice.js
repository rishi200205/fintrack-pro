import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest, logoutRequest } from '../../api/services/authService';

// ─── Thunks ────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginRequest(credentials);
      // Persist token to localStorage for session restore
      localStorage.setItem('ft_token', data.token);
      localStorage.setItem('ft_user',  JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutRequest();
      localStorage.removeItem('ft_token');
      localStorage.removeItem('ft_user');
    } catch (err) {
      // Still clear local state on error
      localStorage.removeItem('ft_token');
      localStorage.removeItem('ft_user');
      return rejectWithValue(err.message);
    }
  }
);

// ─── Helpers for session restore ───────────────────────────────────────────

const storedUser  = localStorage.getItem('ft_user');
const storedToken = localStorage.getItem('ft_token');

// ─── Slice ─────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    storedUser  ? JSON.parse(storedUser)  : null,
    token:   storedToken ? storedToken              : null,
    status:  'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error:   null,
  },
  reducers: {
    // Allows external code to clear auth (e.g. 401 interceptor)
    clearAuth(state) {
      state.user  = null;
      state.token = null;
      state.error = null;
      state.status = 'idle';
      localStorage.removeItem('ft_token');
      localStorage.removeItem('ft_user');
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user   = action.payload.user;
        state.token  = action.payload.token;
        state.error  = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error  = action.payload;
      })

      // ── Logout ─────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user   = null;
        state.token  = null;
        state.status = 'idle';
        state.error  = null;
      });
  },
});

export const { clearAuth } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────
export const selectUser       = (state) => state.auth.user;
export const selectToken      = (state) => state.auth.token;
export const selectIsLoggedIn = (state) => Boolean(state.auth.token);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError  = (state) => state.auth.error;

export default authSlice.reducer;
