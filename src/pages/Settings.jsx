import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, logoutUser }             from '../store/slices/authSlice';
import { selectTheme, toggleTheme, addToast, setCurrency, selectCurrency } from '../store/slices/uiSlice';
import { selectAllTransactions }              from '../store/slices/transactionSlice';
import { selectCategories }                   from '../store/slices/categorySlice';
import { exportTransactionsCsv }              from '../utils/exportCsv';
import { CURRENCIES, getCurrency }            from '../utils/currency';
import './Settings.css';

/* ─── Helpers ─────────────────────────────────────────────────── */

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function SectionHeader({ title, description }) {
  return (
    <div className="settings__section-header">
      <h2 className="settings__section-title">{title}</h2>
      {description && <p className="settings__section-desc">{description}</p>}
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */

function ProfileCard({ user }) {
  const initials = getInitials(user?.name);
  return (
    <div className="settings__card">
      <SectionHeader title="Profile" description="Your account details." />
      <div className="settings__profile">
        <div className="settings__avatar" aria-hidden="true">
          {initials || '?'}
        </div>
        <div className="settings__profile-info">
          <p className="settings__profile-name">{user?.name ?? '—'}</p>
          <p className="settings__profile-email">{user?.email ?? '—'}</p>
          <span className="settings__badge settings__badge--demo">Demo account</span>
        </div>
      </div>
    </div>
  );
}

function AppearanceCard({ theme, onToggle }) {
  return (
    <div className="settings__card">
      <SectionHeader
        title="Appearance"
        description="Choose the color theme that works best for you."
      />
      <div className="settings__theme-row">
        <button
          className={`settings__theme-btn${theme === 'dark' ? ' settings__theme-btn--active' : ''}`}
          onClick={() => theme !== 'dark' && onToggle()}
          aria-pressed={theme === 'dark'}
        >
          <span className="settings__theme-preview settings__theme-preview--dark">
            <span className="stp__sidebar" />
            <span className="stp__content">
              <span className="stp__bar" />
              <span className="stp__bar stp__bar--short" />
            </span>
          </span>
          <span className="settings__theme-label">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586z" />
            </svg>
            Dark
          </span>
          {theme === 'dark' && (
            <span className="settings__theme-check" aria-hidden="true">✓</span>
          )}
        </button>

        <button
          className={`settings__theme-btn${theme === 'light' ? ' settings__theme-btn--active' : ''}`}
          onClick={() => theme !== 'light' && onToggle()}
          aria-pressed={theme === 'light'}
        >
          <span className="settings__theme-preview settings__theme-preview--light">
            <span className="stp__sidebar" />
            <span className="stp__content">
              <span className="stp__bar" />
              <span className="stp__bar stp__bar--short" />
            </span>
          </span>
          <span className="settings__theme-label">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm4 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-.464 4.95.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414zm2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2h1zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414l.707.707zm1.414 8.486-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414zM4 11a1 1 0 1 0 0-2H3a1 1 0 1 0 0 2h1z" clipRule="evenodd" />
            </svg>
            Light
          </span>
          {theme === 'light' && (
            <span className="settings__theme-check" aria-hidden="true">✓</span>
          )}
        </button>
      </div>
    </div>
  );
}

function DataCard({ onExport, onReset }) {
  return (
    <div className="settings__card">
      <SectionHeader
        title="Data &amp; Export"
        description="Export your transaction history or reset demo data."
      />
      <div className="settings__data-actions">
        <div className="settings__data-row">
          <div className="settings__data-info">
            <p className="settings__data-title">Export Transactions</p>
            <p className="settings__data-sub">Download all transactions as a CSV file.</p>
          </div>
          <button className="settings__btn settings__btn--primary" onClick={onExport}>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm3.293-7.707a1 1 0 0 1 1.414 0L9 10.586V3a1 1 0 1 1 2 0v7.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
            </svg>
            Export CSV
          </button>
        </div>

        <div className="settings__divider" />

        <div className="settings__data-row">
          <div className="settings__data-info">
            <p className="settings__data-title">Reset Demo Data</p>
            <p className="settings__data-sub">Restore all demo transactions and budgets.</p>
          </div>
          <button className="settings__btn settings__btn--ghost" onClick={onReset}>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4 2a1 1 0 0 1 1 1v2.101a7.002 7.002 0 0 1 11.601 2.566 1 1 0 1 1-1.885.666A5.002 5.002 0 0 0 5.999 7H9a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm.008 9.057a1 1 0 0 1 1.276.61A5.002 5.002 0 0 0 14.001 13H11a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.101a7.002 7.002 0 0 1-11.601-2.566 1 1 0 0 1 .61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrencyCard({ currency, onChange }) {
  const current = getCurrency(currency);
  return (
    <div className="settings__card">
      <SectionHeader
        title="Currency"
        description="Choose your base display currency. All totals and charts convert to this currency using mock rates."
      />
      <div className="settings__currency-current">
        <span className="settings__currency-flag">{current.flag}</span>
        <div>
          <p className="settings__currency-name">{current.name}</p>
          <p className="settings__currency-code">{current.symbol} &middot; {current.code}</p>
        </div>
      </div>
      <div className="settings__currency-grid">
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            className={`settings__currency-btn${currency === c.code ? ' settings__currency-btn--active' : ''}`}
            onClick={() => onChange(c.code)}
            aria-pressed={currency === c.code}
          >
            <span className="settings__currency-btn-flag">{c.flag}</span>
            <span className="settings__currency-btn-code">{c.code}</span>
            <span className="settings__currency-btn-sym">{c.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DangerCard({ onSignOut }) {
  return (
    <div className="settings__card settings__card--danger">
      <SectionHeader
        title="Account"
        description="Sign out of your FinTrack Pro account."
      />
      <div className="settings__data-row">
        <div className="settings__data-info">
          <p className="settings__data-title">Sign Out</p>
          <p className="settings__data-sub">You will be redirected to the login page.</p>
        </div>
        <button className="settings__btn settings__btn--danger" onClick={onSignOut}>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1zm10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L14.586 9H7a1 1 0 1 0 0 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */

export default function Settings() {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const user          = useSelector(selectUser);
  const theme         = useSelector(selectTheme);
  const currency      = useSelector(selectCurrency);
  const transactions  = useSelector(selectAllTransactions);
  const categories    = useSelector(selectCategories);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    const next = theme === 'dark' ? 'light' : 'dark';
    dispatch(addToast({ type: 'success', message: `Switched to ${next} theme.` }));
  };

  const handleCurrencyChange = (code) => {
    if (code === currency) return;
    dispatch(setCurrency(code));
    const cur = getCurrency(code);
    dispatch(addToast({ type: 'success', message: `Display currency changed to ${cur.name} (${cur.code}).` }));
  };

  const handleExport = () => {
    if (!transactions.length) {
      dispatch(addToast({ type: 'warning', message: 'No transactions to export.' }));
      return;
    }
    exportTransactionsCsv(transactions, categories);
    dispatch(addToast({ type: 'success', message: `Exported ${transactions.length} transactions.` }));
  };

  const handleReset = () => {
    dispatch(addToast({ type: 'info', message: 'Demo data is already at its default state.' }));
  };

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    navigate('/', { replace: true });
  };

  return (
    <div className="settings-page fade-in">
      <div className="settings__header">
        <h1 className="settings__title">Settings</h1>
        <p className="settings__subtitle">Manage your account and preferences.</p>
      </div>

      <div className="settings__grid">
        <ProfileCard user={user} />
        <AppearanceCard theme={theme} onToggle={handleToggleTheme} />
        <CurrencyCard currency={currency} onChange={handleCurrencyChange} />
        <DataCard onExport={handleExport} onReset={handleReset} />
        <DangerCard onSignOut={handleSignOut} />
      </div>
    </div>
  );
}