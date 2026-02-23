import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllTransactions,
  selectFilters,
  selectTransactionStatus,
  setFilter,
  resetFilters,
  addTransaction,
  editTransaction,
  removeTransaction,
} from '../store/slices/transactionSlice';
import { selectCategories } from '../store/slices/categorySlice';

/**
 * useTransactions — derived, filtered and sorted transaction list with
 * all dispatch helpers wired in. Single import for the Transactions page.
 */
export function useTransactions() {
  const dispatch   = useDispatch();
  const raw        = useSelector(selectAllTransactions);
  const categories = useSelector(selectCategories);
  const filters    = useSelector(selectFilters);
  const status     = useSelector(selectTransactionStatus);

  // ── Enrich with category object ──────────────────────────────────────────
  const enriched = useMemo(() => {
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
    return raw.map((t) => ({ ...t, category: catMap[t.categoryId] ?? null }));
  }, [raw, categories]);

  // ── Apply filters ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let items = enriched;

    if (filters.type !== 'all') {
      items = items.filter((t) => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      items = items.filter((t) => t.categoryId === filters.category);
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.category?.name ?? '').toLowerCase().includes(q)
      );
    }

    if (filters.dateFrom) items = items.filter((t) => t.date >= filters.dateFrom);
    if (filters.dateTo)   items = items.filter((t) => t.date <= filters.dateTo);

    // Sort
    return [...items].sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'date')     cmp = a.date.localeCompare(b.date);
      else if (filters.sortBy === 'amount')   cmp = a.amount - b.amount;
      else if (filters.sortBy === 'category') cmp = (a.category?.name ?? '').localeCompare(b.category?.name ?? '');
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });
  }, [enriched, filters]);

  // ── Summary stats for the active filter view ─────────────────────────────
  const stats = useMemo(() => {
    let income = 0, expense = 0;
    for (const t of filtered) {
      if (t.type === 'income')  income  += t.amount;
      else                       expense += t.amount;
    }
    return { income, expense, net: income - expense, count: filtered.length };
  }, [filtered]);

  // ── Active filter count (for badge) ──────────────────────────────────────
  const activeFilters = useMemo(() => {
    let n = 0;
    if (filters.type !== 'all')   n++;
    if (filters.category !== 'all') n++;
    if (filters.search.trim())    n++;
    if (filters.dateFrom)         n++;
    if (filters.dateTo)           n++;
    return n;
  }, [filters]);

  // ── Dispatchers ──────────────────────────────────────────────────────────
  const updateFilter = useCallback(
    (key, value) => dispatch(setFilter({ key, value })),
    [dispatch]
  );
  const clearFilters = useCallback(() => dispatch(resetFilters()), [dispatch]);
  const create = useCallback((data) => dispatch(addTransaction(data)), [dispatch]);
  const update = useCallback((id, data) => dispatch(editTransaction({ id, data })), [dispatch]);
  const remove = useCallback((id) => dispatch(removeTransaction(id)), [dispatch]);

  return {
    transactions: filtered,
    categories,
    filters,
    status,
    stats,
    activeFilters,
    updateFilter,
    clearFilters,
    create,
    update,
    remove,
  };
}
