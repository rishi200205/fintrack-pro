import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTransactions } from '../store/slices/transactionSlice';
import { selectCategories }       from '../store/slices/categorySlice';
import { selectCurrency }         from '../store/slices/uiSlice';
import { convertAmount }          from '../utils/currency';

/**
 * useAnalyticsPage
 *
 * Period-aware analytics hook. Slices all transactions to the last `period`
 * calendar months and returns monthly trend data, category breakdowns, and
 * summary insights.
 *
 * @param {number} period — number of months to include (1 | 3 | 6 | 12)
 */
export function useAnalyticsPage(period = 6) {
  const transactions    = useSelector(selectAllTransactions);
  const categories      = useSelector(selectCategories);
  const displayCurrency = useSelector(selectCurrency);

  return useMemo(() => {
    // Helper: convert a transaction's amount to the display currency
    const toDisplay = (t) => convertAmount(t.amount, t.currency ?? 'USD', displayCurrency);

    const now    = new Date();
    // Start of the earliest month included in the period
    const cutoff = new Date(now.getFullYear(), now.getMonth() - (period - 1), 1);

    const periodTxns = transactions.filter((t) => new Date(t.date) >= cutoff);

    // ── Period totals ──────────────────────────────────────────────────────
    const totalIncome = periodTxns
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + toDisplay(t), 0);

    const totalExpense = periodTxns
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + toDisplay(t), 0);

    const netSavings  = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0
      ? Math.round((netSavings / totalIncome) * 100)
      : 0;

    // ── Monthly trend ──────────────────────────────────────────────────────
    const monthly = [];
    for (let i = period - 1; i >= 0; i--) {
      const ref   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mm    = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`;
      const label = ref.toLocaleString('default', {
        month: 'short',
        ...(period >= 12 ? { year: '2-digit' } : {}),
      });
      const monthTxns = periodTxns.filter((t) => t.date.startsWith(mm));
      const income    = monthTxns.filter((t) => t.type === 'income') .reduce((s, t) => s + toDisplay(t), 0);
      const expense   = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + toDisplay(t), 0);
      monthly.push({ month: mm, label, income, expense, net: income - expense });
    }

    // ── Average monthly spend ──────────────────────────────────────────────
    const avgMonthlyExpense = period > 0 ? totalExpense / period : 0;

    // ── Best & worst months (by net savings) ──────────────────────────────
    const activeMonths = monthly.filter((m) => m.income + m.expense > 0);
    const bestMonth  = activeMonths.length
      ? activeMonths.reduce((a, b) => (b.net > a.net ? b : a))
      : null;
    const worstMonth = activeMonths.length
      ? activeMonths.reduce((a, b) => (b.net < a.net ? b : a))
      : null;

    // ── Category breakdowns ────────────────────────────────────────────────
    const expByCategory = categories
      .map((cat) => {
        const spent = periodTxns
          .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
          .reduce((s, t) => s + toDisplay(t), 0);
        return { ...cat, value: spent };
      })
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);

    const incByCategory = categories
      .map((cat) => {
        const earned = periodTxns
          .filter((t) => t.type === 'income' && t.categoryId === cat.id)
          .reduce((s, t) => s + toDisplay(t), 0);
        return { ...cat, value: earned };
      })
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);

    const biggestExpCat = expByCategory[0] ?? null;

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      monthly,
      expByCategory,
      incByCategory,
      biggestExpCat,
      bestMonth,
      worstMonth,
      avgMonthlyExpense,
      txnCount: periodTxns.length,
      displayCurrency,
    };
  }, [transactions, categories, period, displayCurrency]);
}
