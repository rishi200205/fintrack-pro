import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  selectAuthStatus,
  selectIsLoggedIn,
} from '../store/slices/authSlice';
import Button from '../components/common/Button';
import './Auth.css';

/* ---- Icons ---- */
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
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
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ---- Password strength ---- */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: 'Very weak', color: 'var(--color-danger-500)'  },
    { label: 'Weak',      color: 'var(--color-danger-400)'  },
    { label: 'Fair',      color: 'var(--color-warning-400)' },
    { label: 'Good',      color: 'var(--color-success-500)' },
    { label: 'Strong',    color: 'var(--color-success-400)' },
  ];
  return { score, ...map[score] };
};

/* ---- Validation ---- */
const validate = ({ name, email, password, confirm }) => {
  const errors = {};
  if (!name.trim()) {
    errors.name = 'Full name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (!confirm) {
    errors.confirm = 'Please confirm your password';
  } else if (confirm !== password) {
    errors.confirm = 'Passwords do not match';
  }
  return errors;
};

export default function Signup() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const status     = useSelector(selectAuthStatus);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [fields, setFields]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [agreeErr, setAgreeErr] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard', { replace: true });
  }, [isLoggedIn, navigate]);

  const strength = getStrength(fields.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      const fe = validate({ ...fields, [name]: value });
      setErrors((err) => ({ ...err, [name]: fe[name] }));
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
    setTouched({ name: true, email: true, password: true, confirm: true });
    const fe = validate(fields);
    if (Object.keys(fe).length > 0) { setErrors(fe); return; }
    if (!agreed) { setAgreeErr('You must agree to the terms'); return; }
    setAgreeErr('');

    // Signup mocks a successful registration then auto-logs in
    const result = await dispatch(
      loginUser({ email: fields.email, password: fields.password })
    );
    // Mock always succeeds for new users since any credentials will be
    // accepted via the demo login (in a real app this would call /auth/register)
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

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-subheading">Start tracking your finances today — free forever</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full name */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="signup-name">Full name</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><IconUser /></span>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Morgan"
                value={fields.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-field__input${errors.name ? ' auth-field__input--error' : ''}`}
                aria-invalid={!!errors.name}
              />
            </div>
            {errors.name && <span className="auth-field__error" role="alert">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="signup-email">Email</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><IconEmail /></span>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-field__input${errors.email ? ' auth-field__input--error' : ''}`}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && <span className="auth-field__error" role="alert">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="signup-password">Password</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><IconLock /></span>
              <input
                id="signup-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={fields.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-field__input auth-field__input--has-toggle${errors.password ? ' auth-field__input--error' : ''}`}
                aria-invalid={!!errors.password}
              />
              <button type="button" className="auth-field__toggle" onClick={() => setShowPwd((v) => !v)} aria-label={showPwd ? 'Hide' : 'Show'}>
                <IconEye off={showPwd} />
              </button>
            </div>
            {/* Strength bar */}
            {fields.password && (
              <div className="auth-strength">
                <div className="auth-strength__bar">
                  {[0,1,2,3].map((i) => (
                    <div
                      key={i}
                      className="auth-strength__segment"
                      style={{ background: i < strength.score ? strength.color : 'var(--bg-overlay)' }}
                    />
                  ))}
                </div>
                <span className="auth-strength__label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="auth-field__error" role="alert">{errors.password}</span>}
          </div>

          {/* Confirm password */}
          <div className="auth-field">
            <label className="auth-field__label" htmlFor="signup-confirm">Confirm password</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><IconLock /></span>
              <input
                id="signup-confirm"
                name="confirm"
                type={showCfm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={fields.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-field__input auth-field__input--has-toggle${errors.confirm ? ' auth-field__input--error' : (fields.confirm && fields.confirm === fields.password ? ' auth-field__input--valid' : '')}`}
                aria-invalid={!!errors.confirm}
              />
              <button type="button" className="auth-field__toggle" onClick={() => setShowCfm((v) => !v)} aria-label={showCfm ? 'Hide' : 'Show'}>
                {fields.confirm && fields.confirm === fields.password
                  ? <span style={{ color: 'var(--color-success-400)' }}><IconCheck /></span>
                  : <IconEye off={showCfm} />
                }
              </button>
            </div>
            {errors.confirm && <span className="auth-field__error" role="alert">{errors.confirm}</span>}
          </div>

          {/* Terms */}
          <div className="auth-field">
            <label className="auth-checkbox">
              <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setAgreeErr(''); }} />
              I agree to the <span style={{ color: 'var(--color-primary-400)' }}>Terms of Service</span> and <span style={{ color: 'var(--color-primary-400)' }}>Privacy Policy</span>
            </label>
            {agreeErr && <span className="auth-field__error" role="alert">{agreeErr}</span>}
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} className="auth-submit">
            Create Account
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
