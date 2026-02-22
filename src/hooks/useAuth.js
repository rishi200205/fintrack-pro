import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginUser,
  logoutUser,
  selectUser,
  selectToken,
  selectIsLoggedIn,
  selectAuthStatus,
  selectAuthError,
} from '../store/slices/authSlice';

/**
 * useAuth — convenience wrapper around Redux auth state.
 *
 * Returns:
 *   user        — the authenticated user object or null
 *   token       — JWT token or null
 *   isLoggedIn  — boolean
 *   isLoading   — true while a login/logout request is in-flight
 *   error       — last auth error string or null
 *   login(credentials) — dispatches loginUser thunk, navigates on success
 *   logout()           — dispatches logoutUser thunk, navigates to /
 */
export function useAuth() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const user       = useSelector(selectUser);
  const token      = useSelector(selectToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const status     = useSelector(selectAuthStatus);
  const error      = useSelector(selectAuthError);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
      return { success: true };
    }
    return { success: false, error: result.payload };
  };

  const logout = async () => {
    await dispatch(logoutUser());
    navigate('/', { replace: true });
  };

  return {
    user,
    token,
    isLoggedIn,
    isLoading: status === 'loading',
    error,
    login,
    logout,
  };
}
