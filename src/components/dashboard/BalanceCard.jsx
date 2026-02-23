import { formatCurrency } from '../../utils/currency';
import './BalanceCard.css';

const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconTrendDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
const IconWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1 0-4h14v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12a2 2 0 0 0-2 2 2 2 0 0 0 2 2h4v-4h-4z" />
  </svg>
);
const IconArrowUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);
const IconArrowDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);
/**
 * BalanceCard — displays one metric (balance / income / expense / savings)
 *
 * @param {'balance'|'income'|'expense'|'savings'} type
 * @param {number}  value
 * @param {number}  [change]      - month-over-month delta
 * @param {string}  [label]       - override default label
 * @param {string}  [currency]    - ISO 4217 currency code (default 'USD')
 * @param {boolean} [loading]
 */
export default function BalanceCard({ type = 'balance', value = 0, change, label, currency = 'USD', loading = false }) {
  const config = {
    balance:  { label: 'Net Balance',      accent: 'primary', Icon: IconWallet,    sign: null          },
    income:   { label: 'Total Income',     accent: 'success', Icon: IconArrowUp,   sign: 'positive'    },
    expense:  { label: 'Total Expenses',   accent: 'danger',  Icon: IconArrowDown, sign: 'negative'    },
    savings:  { label: 'Savings Rate',     accent: 'warning', Icon: IconTrendUp,   sign: 'percentage'  },
  }[type] ?? { label: 'Balance', accent: 'primary', Icon: IconWallet, sign: null };

  const displayLabel = label ?? config.label;
  const { accent, Icon, sign } = config;

  const displayValue = sign === 'percentage'
    ? `${value}%`
    : formatCurrency(value, currency);

  const isPositiveChange = change !== undefined && change >= 0;
  const changeAbs = change !== undefined ? Math.abs(change) : 0;

  return (
    <div className={`balance-card balance-card--${accent} ${loading ? 'balance-card--loading' : 'fade-in'}`}>
      <div className="balance-card__header">
        <span className="balance-card__label">{displayLabel}</span>
        <div className={`balance-card__icon-wrap balance-card__icon-wrap--${accent}`}>
          <Icon />
        </div>
      </div>

      <div className="balance-card__value">
        {loading ? <div className="skeleton" style={{ height: 36, width: '60%' }} /> : displayValue}
      </div>

      {change !== undefined && !loading && (
        <div className={`balance-card__change balance-card__change--${isPositiveChange ? 'up' : 'down'}`}>
          {isPositiveChange ? <IconTrendUp /> : <IconTrendDown />}
          <span>{isPositiveChange ? '+' : '-'}{formatCurrency(changeAbs, currency)} this month</span>
        </div>
      )}

      {change === undefined && !loading && (
        <div className="balance-card__sub">All time</div>
      )}
    </div>
  );
}
