import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  selectAuthStatus,
  selectAuthError,
  selectIsLoggedIn,
} from '../store/slices/authSlice';
import Button from '../components/common/Button';
import './Auth.css';

/* ---- Icons ---- */
const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEye = ({ off }) => off ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ---- Validation ---- */
const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
};

export default function Login() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const status      = useSelector(selectAuthStatus);
  const serverError = useSelector(selectAuthError);
  const isLoggedIn  = useSelector(selectIsLoggedIn);

  const [fields, setFields]     = useState(() => {
    const saved = localStorage.getItem('ft_remember_email');
    return { email: saved ?? '', password: '' };
  });
  const [errors, setErrors]     = useState({});
  const [showPwd, setShowPwd]   = useState(false);
  const [remember, setRemember] = useState(() => !!localStorage.getItem('ft_remember_email'));
  const [touched, setTouched]   = useState({});

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      setErrors((err) => ({ ...err, [name]: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const fe = validate(fields);
    setErrors((err) => ({ ...err, [name]: fe[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const fe = validate(fields);
    if (Object.keys(fe).length > 0) { setErrors(fe); return; }

    if (remember) {
      localStorage.setItem('ft_remember_email', fields.email);
    } else {
      localStorage.removeItem('ft_remember_email');
    }

    const result = await dispatch(loginUser({ email: fields.email, password: fields.password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__icon">
            <svg viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="12" fill="var(--color-primary-600)" />
              <path d="M10 28l7-8 5 5 7-11" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="auth-logo__text">
            <span className="auth-logo__name">FinTrack</span>
            <span className="auth-logo__tag">Pro</span>
          </div>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your account to continue</p>

        {serverError && status === 'failed' && (
          <div className="auth-error-banner" role="alert">
            <IconAlert />
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="login-email">Email</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><IconEmail /></span>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="alex@fintrack.pro"
                value={fields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-field__input${errors.email ? ' auth-field__input--error' : ''}`}
                aria-describedby={errors.email ? 'login-email-err' : undefined}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <span id="login-email-err" className="auth-field__error" role="alert">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="login-password">Password</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><IconLock /></span>
              <input
                id="login-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={fields.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-field__input auth-field__input--has-toggle${errors.password ? ' auth-field__input--error' : ''}`}
                aria-describedby={errors.password ? 'login-pwd-err' : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="auth-field__toggle"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                <IconEye off={showPwd} />
              </button>
            </div>
            {errors.password && (
              <span id="login-pwd-err" className="auth-field__error" role="alert">{errors.password}</span>
            )}
          </div>

          {/* Remember me / Forgot */}
          <div className="auth-row">
            <label className="auth-checkbox">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <span className="auth-forgot">Forgot password?</span>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} className="auth-submit">
            Sign In
          </Button>
        </form>

        <div className="auth-demo">
          <strong>Demo credentials</strong><br />
          Email: <strong>alex@fintrack.pro</strong> · Password: <strong>demo1234</strong>
        </div>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}