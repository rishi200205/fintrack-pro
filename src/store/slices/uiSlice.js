import { createSlice } from '@reduxjs/toolkit';

const loadTheme = () => localStorage.getItem('ft_theme') || 'dark';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme:          loadTheme(),   // 'dark' | 'light'
    sidebarOpen:    false,         // mobile sidebar drawer state
    activeModal:    null,          // string key of the currently open modal
    modalPayload:   null,          // data passed to the modal
    isGlobalLoading: false,
    toasts:         [],            // { id, type, message }
  },
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('ft_theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    toggleTheme(state) {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = next;
      localStorage.setItem('ft_theme', next);
      document.documentElement.setAttribute('data-theme', next);
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal(state, action) {
      state.activeModal  = action.payload.modal;
      state.modalPayload = action.payload.payload ?? null;
    },
    closeModal(state) {
      state.activeModal  = null;
      state.modalPayload = null;
    },
    setGlobalLoading(state, action) {
      state.isGlobalLoading = action.payload;
    },
    addToast(state, action) {
      state.toasts.push({
        id:      Date.now(),
        type:    action.payload.type || 'info',  // 'info'|'success'|'error'|'warning'
        message: action.payload.message,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  openModal,
  closeModal,
  setGlobalLoading,
  addToast,
  removeToast,
} = uiSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────
export const selectTheme         = (state) => state.ui.theme;
export const selectSidebarOpen   = (state) => state.ui.sidebarOpen;
export const selectActiveModal   = (state) => state.ui.activeModal;
export const selectModalPayload  = (state) => state.ui.modalPayload;
export const selectGlobalLoading = (state) => state.ui.isGlobalLoading;
export const selectToasts        = (state) => state.ui.toasts;

export default uiSlice.reducer;
