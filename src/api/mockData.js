// ─── Categories ────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'cat_01', name: 'Housing',       icon: '🏠', color: '#6366f1' },
  { id: 'cat_02', name: 'Food & Dining', icon: '🍔', color: '#f59e0b' },
  { id: 'cat_03', name: 'Transport',     icon: '🚗', color: '#3b82f6' },
  { id: 'cat_04', name: 'Shopping',      icon: '🛍️', color: '#ec4899' },
  { id: 'cat_05', name: 'Healthcare',    icon: '💊', color: '#10b981' },
  { id: 'cat_06', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { id: 'cat_07', name: 'Utilities',     icon: '⚡', color: '#f97316' },
  { id: 'cat_08', name: 'Salary',        icon: '💼', color: '#22c55e' },
  { id: 'cat_09', name: 'Freelance',     icon: '💻', color: '#14b8a6' },
  { id: 'cat_10', name: 'Investments',   icon: '📈', color: '#06b6d4' },
  { id: 'cat_11', name: 'Education',     icon: '📚', color: '#a855f7' },
  { id: 'cat_12', name: 'Subscriptions', icon: '📱', color: '#64748b' },
];

// ─── Users ─────────────────────────────────────────────────────────────────

export const USERS = [
  {
    id:    'usr_01',
    name:  'Rishi Raj Jaiswal',
    email: 'rishi@fintrack.pro',
    avatar: null,
  },
];

export const CREDENTIALS = {
  email:    'rishi@fintrack.pro',
  password: 'demo1234',
  token:    'mock_jwt_token_abc123xyz',
};

// ─── Helper ────────────────────────────────────────────────────────────────

let _idCounter = 100;
const nextId = () => `txn_${_idCounter++}`;

const d = (daysAgo) => {
  const dt = new Date();
  dt.setDate(dt.getDate() - daysAgo);
  return dt.toISOString().split('T')[0];
};

// ─── Transactions (35 records across ~3 months) ────────────────────────────

export const TRANSACTIONS = [
  // ── Month 0 (this month) ────────────────────────────────────────────────
  { id: nextId(), type: 'income',  amount: 5500,  currency: 'USD', categoryId: 'cat_08', description: 'Monthly salary',          date: d(2)  },
  { id: nextId(), type: 'expense', amount: 1400,  currency: 'USD', categoryId: 'cat_01', description: 'Rent payment',            date: d(3)  },
  { id: nextId(), type: 'expense', amount: 62.50, currency: 'USD', categoryId: 'cat_02', description: 'Grocery run – Whole Foods', date: d(3)  },
  { id: nextId(), type: 'expense', amount: 14.99, currency: 'USD', categoryId: 'cat_12', description: 'Netflix subscription',    date: d(4)  },
  { id: nextId(), type: 'expense', amount: 9.99,  currency: 'USD', categoryId: 'cat_12', description: 'Spotify Premium',         date: d(4)  },
  { id: nextId(), type: 'expense', amount: 48,    currency: 'USD', categoryId: 'cat_02', description: 'Sushi dinner',            date: d(5)  },
  { id: nextId(), type: 'income',  amount: 850,   currency: 'USD', categoryId: 'cat_09', description: 'Freelance logo design',   date: d(6)  },
  { id: nextId(), type: 'expense', amount: 120,   currency: 'USD', categoryId: 'cat_03', description: 'Gas & car wash',          date: d(7)  },
  { id: nextId(), type: 'expense', amount: 89.99, currency: 'USD', categoryId: 'cat_04', description: 'Nike sneakers',           date: d(8)  },
  { id: nextId(), type: 'expense', amount: 35,    currency: 'USD', categoryId: 'cat_05', description: 'Pharmacy – vitamins',     date: d(9)  },
  { id: nextId(), type: 'expense', amount: 110,   currency: 'USD', categoryId: 'cat_07', description: 'Electric bill',           date: d(10) },
  { id: nextId(), type: 'expense', amount: 55,    currency: 'USD', categoryId: 'cat_07', description: 'Internet bill',           date: d(10) },
  { id: nextId(), type: 'expense', amount: 24,    currency: 'USD', categoryId: 'cat_06', description: 'Cinema tickets (x2)',     date: d(11) },

  // ── Month 1 (last month) ─────────────────────────────────────────────────
  { id: nextId(), type: 'income',  amount: 5500,  currency: 'USD', categoryId: 'cat_08', description: 'Monthly salary',          date: d(32) },
  { id: nextId(), type: 'expense', amount: 1400,  currency: 'USD', categoryId: 'cat_01', description: 'Rent payment',            date: d(33) },
  { id: nextId(), type: 'income',  amount: 1200,  currency: 'USD', categoryId: 'cat_09', description: 'Freelance web project',   date: d(34) },
  { id: nextId(), type: 'expense', amount: 210,   currency: 'USD', categoryId: 'cat_04', description: 'Winter jacket',           date: d(35) },
  { id: nextId(), type: 'expense', amount: 74,    currency: 'USD', categoryId: 'cat_02', description: 'Weekly groceries',        date: d(36) },
  { id: nextId(), type: 'expense', amount: 320,   currency: 'USD', categoryId: 'cat_05', description: 'Dental check-up',         date: d(38) },
  { id: nextId(), type: 'expense', amount: 18.99, currency: 'USD', categoryId: 'cat_06', description: 'Steam game purchase',     date: d(39) },
  { id: nextId(), type: 'expense', amount: 95,    currency: 'USD', categoryId: 'cat_03', description: 'Uber rides (monthly)',    date: d(40) },
  { id: nextId(), type: 'income',  amount: 250,   currency: 'USD', categoryId: 'cat_10', description: 'Dividend payout',         date: d(42) },
  { id: nextId(), type: 'expense', amount: 49,    currency: 'USD', categoryId: 'cat_11', description: 'Udemy course bundle',     date: d(44) },
  { id: nextId(), type: 'expense', amount: 14.99, currency: 'USD', categoryId: 'cat_12', description: 'Netflix subscription',    date: d(34) },
  { id: nextId(), type: 'expense', amount: 9.99,  currency: 'USD', categoryId: 'cat_12', description: 'Spotify Premium',         date: d(34) },
  { id: nextId(), type: 'expense', amount: 110,   currency: 'USD', categoryId: 'cat_07', description: 'Electric bill',           date: d(40) },
  { id: nextId(), type: 'expense', amount: 55,    currency: 'USD', categoryId: 'cat_07', description: 'Internet bill',           date: d(40) },

  // ── Month 2 (two months ago) ──────────────────────────────────────────────
  { id: nextId(), type: 'income',  amount: 5500,  currency: 'USD', categoryId: 'cat_08', description: 'Monthly salary',          date: d(62) },
  { id: nextId(), type: 'expense', amount: 1400,  currency: 'USD', categoryId: 'cat_01', description: 'Rent payment',            date: d(63) },
  { id: nextId(), type: 'income',  amount: 600,   currency: 'USD', categoryId: 'cat_09', description: 'Freelance article writing', date: d(65) },
  { id: nextId(), type: 'expense', amount: 142,   currency: 'USD', categoryId: 'cat_02', description: 'Monthly groceries bulk',  date: d(66) },
  { id: nextId(), type: 'expense', amount: 299,   currency: 'USD', categoryId: 'cat_04', description: 'IKEA home furnishings',   date: d(68) },
  { id: nextId(), type: 'expense', amount: 79.99, currency: 'USD', categoryId: 'cat_11', description: 'AWS certification course', date: d(70) },
  { id: nextId(), type: 'expense', amount: 38,    currency: 'USD', categoryId: 'cat_06', description: 'Concert ticket',          date: d(72) },
  { id: nextId(), type: 'income',  amount: 180,   currency: 'USD', categoryId: 'cat_10', description: 'Stock dividend',          date: d(74) },
  { id: nextId(), type: 'expense', amount: 14.99, currency: 'USD', categoryId: 'cat_12', description: 'Netflix subscription',    date: d(64) },
  { id: nextId(), type: 'expense', amount: 9.99,  currency: 'USD', categoryId: 'cat_12', description: 'Spotify Premium',         date: d(64) },
];
