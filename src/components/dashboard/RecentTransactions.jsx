import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';
import './RecentTransactions.css';

const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * RecentTransactions — shows the last 8 transactions.
 * @param {Array}   transactions — enriched with `.category`
 * @param {boolean} loading
 */
export default function RecentTransactions({ transactions = [], loading = false }) {
  if (loading) {
    return (
      <ul className="recent-txns">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="recent-txns__item">
            <div className="skeleton recent-txns__icon-skeleton" />
            <div className="recent-txns__info">
              <div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 11, width: '35%' }} />
            </div>
            <div className="skeleton" style={{ height: 14, width: 60, borderRadius: 4 }} />
          </li>
        ))}
      </ul>
    );
  }

  if (!transactions.length) {
    return (
      <div className="recent-txns__empty">
        <p>No transactions yet. <Link to="/transactions">Add one</Link></p>
      </div>
    );
  }

  return (
    <ul className="recent-txns fade-in">
      {transactions.map((txn) => {
        const cat = txn.category;
        const isIncome = txn.type === 'income';
        return (
          <li key={txn.id} className="recent-txns__item">
            {/* Category icon bubble */}
            <div
              className="recent-txns__icon"
              style={{ background: cat ? `${cat.color}22` : undefined, color: cat?.color ?? 'var(--text-muted)' }}
              aria-hidden="true"
            >
              {cat?.icon ?? '💳'}
            </div>

            {/* Description + category */}
            <div className="recent-txns__info">
              <span className="recent-txns__desc">{txn.description}</span>
              <span className="recent-txns__meta">
                {cat?.name ?? 'Uncategorized'} · {fmtDate(txn.date)}
              </span>
            </div>

            {/* Amount */}
            <span className={`recent-txns__amount ${isIncome ? 'recent-txns__amount--income' : 'recent-txns__amount--expense'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(txn.amount, txn.currency ?? 'USD')}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
