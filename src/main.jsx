import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/index';
import { injectStore } from './api/apiClient';
import './api/mockAdapter';   // boots mock API
import './index.css';
import App from './App.jsx';

// Give axios interceptors access to the store
injectStore(store);

// Apply persisted theme before first render
const savedTheme = localStorage.getItem('ft_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
