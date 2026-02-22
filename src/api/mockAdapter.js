import MockAdapter from 'axios-mock-adapter';
import apiClient from './apiClient';
import { TRANSACTIONS, CATEGORIES, USERS, CREDENTIALS } from './mockData';

// In-memory mutable copies
let transactions = [...TRANSACTIONS];
let categories   = [...CATEGORIES];

const mock = new MockAdapter(apiClient, { delayResponse: 350 });

// ─── Auth ──────────────────────────────────────────────────────────────────

mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data);
  if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
    return [200, { user: USERS[0], token: CREDENTIALS.token }];
  }
  return [401, { message: 'Invalid email or password' }];
});

mock.onPost('/auth/logout').reply(200, { message: 'Logged out' });

// ─── Transactions ──────────────────────────────────────────────────────────

mock.onGet('/transactions').reply(200, [...transactions]);

mock.onPost('/transactions').reply((config) => {
  const body = JSON.parse(config.data);
  const newTxn = {
    ...body,
    id:   `txn_${Date.now()}`,
    date: body.date || new Date().toISOString().split('T')[0],
  };
  transactions.unshift(newTxn);
  return [201, newTxn];
});

mock.onPut(/\/transactions\/.*/).reply((config) => {
  const id   = config.url.split('/').pop();
  const body = JSON.parse(config.data);
  const idx  = transactions.findIndex((t) => t.id === id);
  if (idx === -1) return [404, { message: 'Transaction not found' }];
  transactions[idx] = { ...transactions[idx], ...body, id };
  return [200, transactions[idx]];
});

mock.onDelete(/\/transactions\/.*/).reply((config) => {
  const id = config.url.split('/').pop();
  const prev = transactions.length;
  transactions = transactions.filter((t) => t.id !== id);
  if (transactions.length === prev) return [404, { message: 'Not found' }];
  return [204];
});

// ─── Categories ────────────────────────────────────────────────────────────

mock.onGet('/categories').reply(200, categories);

// ─── Analytics ─────────────────────────────────────────────────────────────

mock.onGet('/analytics/summary').reply(() => {
  const totalIncome  = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  // Spending by category
  const byCategory = categories.map((cat) => {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((s, t) => s + t.amount, 0);
    return { categoryId: cat.id, name: cat.name, color: cat.color, spent };
  }).filter((c) => c.spent > 0);

  // Monthly breakdown (last 6 months)
  const monthly = [];
  for (let i = 5; i >= 0; i--) {
    const ref = new Date();
    ref.setMonth(ref.getMonth() - i);
    const mm = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`;
    const monthTxns = transactions.filter((t) => t.date.startsWith(mm));
    monthly.push({
      month:   mm,
      income:  monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    });
  }

  return [200, {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    savingsRate: totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0,
    byCategory,
    monthly,
  }];
});

// ─── Catch-all (safety net) ────────────────────────────────────────────────
mock.onAny().passThrough();

export default mock;
