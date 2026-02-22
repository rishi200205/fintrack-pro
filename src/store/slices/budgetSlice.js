import { createSlice } from '@reduxjs/toolkit';

// Budgets are stored as { categoryId -> { limit, period } }
// They live only in Redux (persisted to localStorage for UX)

const loadBudgets = () => {
  try {
    const raw = localStorage.getItem('ft_budgets');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveBudgets = (budgets) => {
  localStorage.setItem('ft_budgets', JSON.stringify(budgets));
};

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: {
    items: loadBudgets(), // { [categoryId]: { limit: number, period: 'monthly' } }
  },
  reducers: {
    setBudget(state, action) {
      const { categoryId, limit, period = 'monthly' } = action.payload;
      state.items[categoryId] = { limit, period };
      saveBudgets(state.items);
    },
    removeBudget(state, action) {
      delete state.items[action.payload]; // payload = categoryId
      saveBudgets(state.items);
    },
    clearBudgets(state) {
      state.items = {};
      localStorage.removeItem('ft_budgets');
    },
  },
});

export const { setBudget, removeBudget, clearBudgets } = budgetSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────
export const selectBudgets         = (state) => state.budgets.items;
export const selectBudgetByCategory = (categoryId) => (state) =>
  state.budgets.items[categoryId] ?? null;

export default budgetSlice.reducer;
