import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTransactions } from '../store/slices/transactionSlice';
import { selectCategories } from '../store/slices/categorySlice';

/**
 * useAnalytics — memoized derivations of transaction data.
 * Returns totals, per-category breakdown, monthly trend, and recent transactions.
 */
export function useAnalytics({ months = 6 } = {}) {
  const transactions = useSelector(selectAllTransactions);
  const categories   = useSelector(selectCategories);

  return useMemo(() => {
    // ── Totals ──────────────────────────────────────────────────────────
    const totalIncome  = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    const savingsRate = totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;

    // ── This-month totals ────────────────────────────────────────────────
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const monthIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0);

    const monthExpense = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0);

    // ── Category breakdown ───────────────────────────────────────────────
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

    const byCategory = categories
      .map((cat) => {
        const spent = transactions
          .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
          .reduce((s, t) => s + t.amount, 0);
        return { ...cat, spent };
      })
      .filter((c) => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);

    // ── Monthly trend (last N months) ────────────────────────────────────
    const monthly = [];
    for (let i = months - 1; i >= 0; i--) {
      const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mm  = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`;
      const label = ref.toLocaleString('default', { month: 'short' });
      const monthTxns = transactions.filter((t) => t.date.startsWith(mm));
      monthly.push({
        month:   mm,
        label,
        income:  monthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      });
    }

    // ── Recent transactions (last 8) ─────────────────────────────────────
    const recent = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8)
      .map((t) => ({ ...t, category: catMap[t.categoryId] ?? null }));

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      monthIncome,
      monthExpense,
      byCategory,
      monthly,
      recent,
      transactionCount: transactions.length,
    };
  }, [transactions, categories, months]);
}
