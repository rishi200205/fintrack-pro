import { configureStore } from '@reduxjs/toolkit';
import authReducer        from './slices/authSlice';
import transactionReducer from './slices/transactionSlice';
import categoryReducer    from './slices/categorySlice';
import budgetReducer      from './slices/budgetSlice';
import uiReducer          from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth:         authReducer,
    transactions: transactionReducer,
    categories:   categoryReducer,
    budgets:      budgetReducer,
    ui:           uiReducer,
  },
});

export default store;
