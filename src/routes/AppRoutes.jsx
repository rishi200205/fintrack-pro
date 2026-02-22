import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../store/slices/authSlice';
import Layout from '../components/Layout';
import ProtectedRoute from './ProtectedRoute';

import Login       from '../pages/Login';
import Signup      from '../pages/Signup';
import Dashboard   from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import Analytics   from '../pages/Analytics';
import Settings    from '../pages/Settings';

// Redirect already-logged-in users away from auth pages
function GuestRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — redirect to dashboard if already logged in */}
        <Route path="/" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

        {/* Protected app shell */}
        <Route element={<Layout />}>
          <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/analytics"   element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}