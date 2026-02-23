import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectBudgets,
  setBudget,
  removeBudget,
} from '../store/slices/budgetSlice';
import { selectAllTransactions } from '../store/slices/transactionSlice';
import { selectCategories } from '../store/slices/categorySlice';

/**
 * useBudgets — merges budget limits with current-month actual spending.
 *
 * Returns two lists:
 *  - budgeted:   categories that have a limit set → sorted by % used desc
 *  - unbudgeted: expense categories with no limit set
 *
 * Each budgeted item:
 *  { id, name, icon, color, limit, period, spent, remaining, pct, status }
 *  status: 'safe' (< 80%) | 'warning' (80–99%) | 'over' (>= 100%)
 */
export function useBudgets() {
  const dispatch     = useDispatch();
  const budgets      = useSelector(selectBudgets);
  const transactions = useSelector(selectAllTransactions);
  const categories   = useSelector(selectCategories);

  // Spend per category — current calendar month only
  const monthlySpend = useMemo(() => {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth();

    const spend = {};
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      const d = new Date(t.date + 'T00:00:00');
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      spend[t.categoryId] = (spend[t.categoryId] ?? 0) + t.amount;
    }
    return spend;
  }, [transactions]);

  // Income category ids (no budget tracking needed)
  const INCOME_CAT_IDS = new Set(['cat_08', 'cat_09', 'cat_10']);

  const { budgeted, unbudgeted } = useMemo(() => {
    const budgeted   = [];
    const unbudgeted = [];

    for (const cat of categories) {
      if (INCOME_CAT_IDS.has(cat.id)) continue; // skip income cats

      const limit = budgets[cat.id]?.limit ?? null;
      const spent = monthlySpend[cat.id] ?? 0;

      if (limit !== null) {
        const pct  = limit > 0 ? (spent / limit) * 100 : 0;
        const status =
          pct >= 100 ? 'over' :
          pct >= 80  ? 'warning' : 'safe';

        budgeted.push({
          id:        cat.id,
          name:      cat.name,
          icon:      cat.icon,
          color:     cat.color,
          limit,
          period:    budgets[cat.id]?.period ?? 'monthly',
          spent,
          remaining: Math.max(limit - spent, 0),
          overage:   Math.max(spent - limit, 0),
          pct:       Math.min(pct, 100),
          rawPct:    pct,
          status,
        });
      } else {
        unbudgeted.push({ ...cat, spent });
      }
    }

    // Sort budgeted by % used descending (most critical first)
    budgeted.sort((a, b) => b.rawPct - a.rawPct);

    return { budgeted, unbudgeted };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgets, categories, monthlySpend]);

  // Summary totals
  const totals = useMemo(() => {
    let totalLimit = 0, totalSpent = 0;
    for (const b of budgeted) {
      totalLimit += b.limit;
      totalSpent += b.spent;
    }
    const overCount   = budgeted.filter((b) => b.status === 'over').length;
    const warnCount   = budgeted.filter((b) => b.status === 'warning').length;
    return { totalLimit, totalSpent, overCount, warnCount };
  }, [budgeted]);

  // Dispatchers
  const saveBudget = useCallback(
    (categoryId, limit, period = 'monthly') =>
      dispatch(setBudget({ categoryId, limit: parseFloat(limit), period })),
    [dispatch]
  );

  const deleteBudget = useCallback(
    (categoryId) => dispatch(removeBudget(categoryId)),
    [dispatch]
  );

  return {
    budgeted,
    unbudgeted,
    totals,
    saveBudget,
    deleteBudget,
    budgetCount: budgeted.length,
  };
}
