import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTransactions as apiFetchTransactions,
  createTransaction as apiCreateTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
} from '../../api/services/transactionService';

// ─── Thunks ────────────────────────────────────────────────────────────────

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchTransactions();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transactionData, { rejectWithValue }) => {
    try {
      return await apiCreateTransaction(transactionData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiUpdateTransaction(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/remove',
  async (id, { rejectWithValue }) => {
    try {
      await apiDeleteTransaction(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Initial filter state ──────────────────────────────────────────────────

const initialFilters = {
  search:    '',
  type:      'all',       // 'all' | 'income' | 'expense'
  category:  'all',
  dateFrom:  null,
  dateTo:    null,
  sortBy:    'date',      // 'date' | 'amount' | 'category'
  sortOrder: 'desc',      // 'asc' | 'desc'
};

// ─── Slice ─────────────────────────────────────────────────────────────────

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    items:   [],
    status:  'idle',
    error:   null,
    filters: initialFilters,
  },
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    resetFilters(state) {
      state.filters = initialFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch all ──────────────────────────────────────────────────────
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items  = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error  = action.payload;
      })

      // ── Add ────────────────────────────────────────────────────────────
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // ── Edit ───────────────────────────────────────────────────────────
      .addCase(editTransaction.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // ── Remove ─────────────────────────────────────────────────────────
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setFilter, resetFilters } = transactionSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────
export const selectAllTransactions   = (state) => state.transactions.items;
export const selectTransactionStatus = (state) => state.transactions.status;
export const selectTransactionError  = (state) => state.transactions.error;
export const selectFilters           = (state) => state.transactions.filters;

export default transactionSlice.reducer;
