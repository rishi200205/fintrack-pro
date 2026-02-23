/**
 * currency.js — Multi-currency support for FinTrack Pro
 *
 * Exchange rates are fixed mock values relative to USD (1 USD = X units).
 * To convert: amount_B = amount_A * RATES[B] / RATES[A]
 */

// ─── Supported Currencies ─────────────────────────────────────────────────

export const CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar',         flag: '🇺🇸' },
  { code: 'EUR', symbol: '€',  name: 'Euro',               flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',  name: 'British Pound',      flag: '🇬🇧' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee',       flag: '🇮🇳' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',       flag: '🇯🇵' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',    flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar',  flag: '🇦🇺' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc',        flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan',       flag: '🇨🇳' },
  { code: 'MXN', symbol: '$',  name: 'Mexican Peso',       flag: '🇲🇽' },
];

// ─── Mock Exchange Rates (units per 1 USD) ────────────────────────────────

export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  JPY: 149.50,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.89,
  CNY: 7.24,
  MXN: 17.15,
};

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Get a currency object by code (fallback to USD). */
export const getCurrency = (code) =>
  CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

/**
 * Convert an amount from one currency to another using mock rates.
 * Formula: amount_B = amount_A * RATES[B] / RATES[A]
 */
export const convertAmount = (amount, fromCode, toCode) => {
  if (fromCode === toCode) return amount;
  const from = EXCHANGE_RATES[fromCode] ?? 1;
  const to   = EXCHANGE_RATES[toCode]   ?? 1;
  return amount * (to / from);
};

/**
 * Format a number as a currency string.
 * Uses Intl.NumberFormat — falls back gracefully for unsupported codes.
 *
 * @param {number} amount
 * @param {string} code   - currency code e.g. 'USD', 'EUR'
 * @param {object} opts   - Intl.NumberFormat options override
 */
export const formatCurrency = (amount, code = 'USD', opts = {}) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style:                 'currency',
      currency:              code,
      maximumFractionDigits: code === 'JPY' ? 0 : 2,
      minimumFractionDigits: code === 'JPY' ? 0 : 2,
      ...opts,
    }).format(amount);
  } catch {
    // Fallback: use symbol from our list
    const cur = getCurrency(code);
    return `${cur.symbol}${amount.toFixed(2)}`;
  }
};

/** Format compactly (no decimals) — used in chart tooltips / stat cards. */
export const formatCurrencyCompact = (amount, code = 'USD') =>
  formatCurrency(amount, code, { maximumFractionDigits: 0, minimumFractionDigits: 0 });
