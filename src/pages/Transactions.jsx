import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, selectTransactionStatus } from '../store/slices/transactionSlice';
import { fetchCategories, selectCategoriesStatus } from '../store/slices/categorySlice';
import { selectCurrency } from '../store/slices/uiSlice';
import { formatCurrencyCompact, convertAmount } from '../utils/currency';
import { useTransactions } from '../hooks/useTransactions';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionItem    from '../components/transactions/TransactionItem';
import TransactionForm    from '../components/transactions/TransactionForm';
import Loader from '../components/common/Loader';
import './Transactions.css';

const fmtGroupDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  const today    = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  if (d.getTime() === today.getTime())     return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

export default function Transactions() {
  const dispatch   = useDispatch();
  const txnStatus  = useSelector(selectTransactionStatus);
  const catStatus  = useSelector(selectCategoriesStatus);
  const displayCurrency = useSelector(selectCurrency);

  // Fetch on mount
  useEffect(() => {
    if (txnStatus === 'idle') dispatch(fetchTransactions());
  }, [dispatch, txnStatus]);

  useEffect(() => {
    if (catStatus === 'idle') dispatch(fetchCategories());
  }, [dispatch, catStatus]);

  const {
    transactions, categories, filters, status,
    stats, activeFilters, updateFilter, clearFilters,
    create, update, remove,
  } = useTransactions();

  // ── Modal state ────────────────────────────────────────────────────────
  const [formOpen,   setFormOpen]   = useState(false);
  const [editing,    setEditing]    = useState(null);   // transaction | null
  const [deletingId, setDeletingId] = useState(null);

  const openAdd  = () => { setEditing(null);  setFormOpen(true);  };
  const openEdit = useCallback((txn) => { setEditing(txn); setFormOpen(true); }, []);
  const closeForm = useCallback(() => { setFormOpen(false); setEditing(null); }, []);

  const handleDelete = useCallback(async (id) => {
    setDeletingId(id);
    try {
      await remove(id);
    } finally {
      setDeletingId(null);
    }
  }, [remove]);

  // ── Group by date ──────────────────────────────────────────────────────
  const groups = useMemo(() => {
    const map = new Map();
    for (const t of transactions) {
      if (!map.has(t.date)) map.set(t.date, []);
      map.get(t.date).push(t);
    }
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
  }, [transactions]);

  const isLoading = status === 'idle' || status === 'loading';

  return (
    <div className="txn-page fade-in">

      {/* ── Header ── */}
      <div className="txn-page__header">
        <div>
          <h1 className="txn-page__title">Transactions</h1>
          <p className="txn-page__subtitle">
            {isLoading ? 'Loading…' : `${stats.count} transaction${stats.count !== 1 ? 's' : ''}${activeFilters > 0 ? ' matching filters' : ''}`}
          </p>
        </div>
        <button className="txn-page__add-btn" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Transaction
        </button>
      </div>

      {/* ── Summary stats ── */}
      <div className="txn-page__stats">
        <div className="txn-page__stat txn-page__stat--income">
          <span className="txn-page__stat-label">↑ Income</span>
          <span className="txn-page__stat-value">{isLoading ? '—' : formatCurrencyCompact(stats.income, displayCurrency)}</span>
        </div>
        <div className="txn-page__stat-divider" />
        <div className="txn-page__stat txn-page__stat--expense">
          <span className="txn-page__stat-label">↓ Expenses</span>
          <span className="txn-page__stat-value">{isLoading ? '—' : formatCurrencyCompact(stats.expense, displayCurrency)}</span>
        </div>
        <div className="txn-page__stat-divider" />
        <div className={`txn-page__stat txn-page__stat--net ${stats.net >= 0 ? 'txn-page__stat--net-pos' : 'txn-page__stat--net-neg'}`}>
          <span className="txn-page__stat-label">Net Balance</span>
          <span className="txn-page__stat-value">
            {isLoading ? '—' : `${stats.net >= 0 ? '+' : ''}${formatCurrencyCompact(stats.net, displayCurrency)}`}
          </span>
        </div>
      </div>

      {/* ── Filters ── */}
      <TransactionFilters
        filters={filters}
        categories={categories}
        activeFilters={activeFilters}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
      />

      {/* ── List ── */}
      {isLoading ? (
        <div className="txn-page__loader">
          <Loader size="lg" />
        </div>
      ) : groups.length === 0 ? (
        <div className="txn-page__empty">
          <span className="txn-page__empty-icon">🔍</span>
          <p className="txn-page__empty-title">
            {activeFilters > 0 ? 'No transactions match your filters' : 'No transactions yet'}
          </p>
          <p className="txn-page__empty-sub">
            {activeFilters > 0
              ? <button className="txn-page__empty-reset" onClick={clearFilters}>Clear filters</button>
              : <button className="txn-page__add-btn" onClick={openAdd}>Add your first transaction</button>}
          </p>
        </div>
      ) : (
        <div className="txn-page__list">
          {groups.map(({ date, items }) => (
            <div key={date} className="txn-page__group">
              {/* Date header */}
              <div className="txn-page__group-header">
                <span className="txn-page__group-date">{fmtGroupDate(date)}</span>
                <span className="txn-page__group-line" />
                <span className="txn-page__group-summary">
                  {items.filter(t => t.type === 'income').reduce((s, t) => s + convertAmount(t.amount, t.currency ?? 'USD', displayCurrency), 0) > 0 && (
                    <span className="txn-page__group-income">
                      +{formatCurrencyCompact(items.filter(t => t.type === 'income').reduce((s, t) => s + convertAmount(t.amount, t.currency ?? 'USD', displayCurrency), 0), displayCurrency)}
                    </span>
                  )}
                  {items.filter(t => t.type === 'expense').reduce((s, t) => s + convertAmount(t.amount, t.currency ?? 'USD', displayCurrency), 0) > 0 && (
                    <span className="txn-page__group-expense">
                      −{formatCurrencyCompact(items.filter(t => t.type === 'expense').reduce((s, t) => s + convertAmount(t.amount, t.currency ?? 'USD', displayCurrency), 0), displayCurrency)}
                    </span>
                  )}
                </span>
              </div>

              {/* Transactions for this date */}
              <ul className="txn-page__group-list">
                {items.map((txn) => (
                  <TransactionItem
                    key={txn.id}
                    transaction={txn}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    deleting={deletingId === txn.id}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit modal ── */}
      <TransactionForm
        isOpen={formOpen}
        onClose={closeForm}
        initial={editing}
        categories={categories}
        onCreate={(data) => create(data)}
        onUpdate={(id, data) => update(id, data)}
      />
    </div>
  );
}