import axios from 'axios';
import { clearAuth } from '../store/slices/authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — attach auth token ───────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ft_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 globally ────────────────────────────
let _store = null;

export const injectStore = (store) => {
  _store = store;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && _store) {
      _store.dispatch(clearAuth());
    }
    return Promise.reject(error);
  }
);

export default apiClient;
