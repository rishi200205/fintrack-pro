import { useRef } from 'react';
import './TransactionFilters.css';

const SORT_OPTIONS = [
  { value: 'date_desc',     label: 'Newest first' },
  { value: 'date_asc',      label: 'Oldest first' },
  { value: 'amount_desc',   label: 'Highest amount' },
  { value: 'amount_asc',    label: 'Lowest amount' },
  { value: 'category_asc',  label: 'Category A–Z' },
];

/**
 * TransactionFilters — search, type tabs, category, date range, sort, reset.
 * All state lives in Redux (via useTransactions); this component is purely
 * presentational — it receives filters + handlers as props.
 */
export default function TransactionFilters({
  filters,
  categories,
  activeFilters,
  onUpdateFilter,
  onClearFilters,
}) {
  const searchRef = useRef(null);

  const sortValue = `${filters.sortBy}_${filters.sortOrder}`;

  const handleSortChange = (val) => {
    const [by, order] = val.split('_');
    onUpdateFilter('sortBy', by);
    onUpdateFilter('sortOrder', order);
  };

  return (
    <div className="txn-filters">
      {/* ── Row 1: search + type tabs ── */}
      <div className="txn-filters__row txn-filters__row--main">
        {/* Search */}
        <div className="txn-filters__search">
          <span className="txn-filters__search-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            ref={searchRef}
            type="text"
            className="txn-filters__search-input"
            placeholder="Search transactions…"
            value={filters.search}
            onChange={(e) => onUpdateFilter('search', e.target.value)}
          />
          {filters.search && (
            <button
              className="txn-filters__search-clear"
              onClick={() => { onUpdateFilter('search', ''); searchRef.current?.focus(); }}
              aria-label="Clear search"
            >×</button>
          )}
        </div>

        {/* Type tabs */}
        <div className="txn-filters__type-tabs" role="group" aria-label="Transaction type">
          {['all', 'income', 'expense'].map((t) => (
            <button
              key={t}
              className={`txn-filters__type-btn ${filters.type === t ? 'txn-filters__type-btn--active' : ''} txn-filters__type-btn--${t}`}
              onClick={() => onUpdateFilter('type', t)}
            >
              {t === 'all' ? 'All' : t === 'income' ? '↑ Income' : '↓ Expenses'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 2: category + dates + sort + reset ── */}
      <div className="txn-filters__row txn-filters__row--secondary">
        {/* Category */}
        <div className="txn-filters__field">
          <label className="txn-filters__label">Category</label>
          <select
            className="txn-filters__select"
            value={filters.category}
            onChange={(e) => onUpdateFilter('category', e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div className="txn-filters__field">
          <label className="txn-filters__label">From</label>
          <input
            type="date"
            className="txn-filters__input"
            value={filters.dateFrom ?? ''}
            onChange={(e) => onUpdateFilter('dateFrom', e.target.value || null)}
          />
        </div>

        {/* Date to */}
        <div className="txn-filters__field">
          <label className="txn-filters__label">To</label>
          <input
            type="date"
            className="txn-filters__input"
            value={filters.dateTo ?? ''}
            onChange={(e) => onUpdateFilter('dateTo', e.target.value || null)}
          />
        </div>

        {/* Sort */}
        <div className="txn-filters__field">
          <label className="txn-filters__label">Sort by</label>
          <select
            className="txn-filters__select"
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {activeFilters > 0 && (
          <button className="txn-filters__reset" onClick={onClearFilters}>
            Reset
            <span className="txn-filters__reset-badge">{activeFilters}</span>
          </button>
        )}
      </div>
    </div>
  );
}
