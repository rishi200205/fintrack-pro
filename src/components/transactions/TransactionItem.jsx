import { formatCurrency } from '../../utils/currency';
import './TransactionItem.css';

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });

/**
 * TransactionItem — single transaction row with edit/delete on hover.
 */
export default function TransactionItem({ transaction: t, onEdit, onDelete, deleting }) {
  const cat       = t.category;
  const isIncome  = t.type === 'income';

  return (
    <li className={`txn-item ${deleting ? 'txn-item--deleting' : ''}`}>
      {/* Category icon bubble */}
      <span
        className="txn-item__icon"
        style={{
          background: cat ? `${cat.color}1a` : 'var(--bg-elevated)',
          border:     cat ? `1px solid ${cat.color}40` : '1px solid var(--border-subtle)',
          color:      cat?.color ?? 'var(--text-muted)',
        }}
        aria-hidden="true"
      >
        {cat?.icon ?? '💳'}
      </span>

      {/* Description + meta */}
      <div className="txn-item__body">
        <span className="txn-item__desc">{t.description}</span>
        <span className="txn-item__meta">
          <span
            className="txn-item__cat-dot"
            style={{ background: cat?.color ?? 'var(--text-muted)' }}
          />
          {cat?.name ?? 'Uncategorized'} · {fmtDate(t.date)}
        </span>
      </div>

      {/* Amount */}
      <span className={`txn-item__amount txn-item__amount--${t.type}`}>
        {isIncome ? '+' : '−'}{formatCurrency(t.amount, t.currency ?? 'USD')}
        {t.currency && t.currency !== 'USD' && (
          <span className="txn-item__currency-badge">{t.currency}</span>
        )}
      </span>

      {/* Actions (visible on hover) */}
      <div className="txn-item__actions">
        <button
          className="txn-item__action-btn txn-item__action-btn--edit"
          onClick={() => onEdit(t)}
          aria-label={`Edit ${t.description}`}
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          className="txn-item__action-btn txn-item__action-btn--delete"
          onClick={() => onDelete(t.id)}
          aria-label={`Delete ${t.description}`}
          title="Delete"
          disabled={deleting}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </li>
  );
}
