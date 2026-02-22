import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategories as apiFetchCategories } from '../../api/services/categoryService';

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchCategories();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items:  [],
    status: 'idle',
    error:  null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items  = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error  = action.payload;
      });
  },
});

// ─── Selectors ─────────────────────────────────────────────────────────────
export const selectCategories       = (state) => state.categories.items;
export const selectCategoryById     = (id)    => (state) =>
  state.categories.items.find((c) => c.id === id);
export const selectCategoriesStatus = (state) => state.categories.status;

export default categorySlice.reducer;
