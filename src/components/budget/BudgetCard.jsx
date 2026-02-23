import './BudgetCard.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

const STATUS_LABEL = { safe: 'On track', warning: 'Nearing limit', over: 'Over budget' };

/**
 * BudgetCard — displays one category's budget progress.
 */
export default function BudgetCard({ budget, onEdit, onDelete }) {
  const { name, icon, color, limit, spent, remaining, overage, pct, rawPct, status } = budget;

  return (
    <div className={`budget-card budget-card--${status}`}>
      {/* ── Header ── */}
      <div className="budget-card__header">
        <span
          className="budget-card__icon"
          style={{ background: `${color}1a`, border: `1px solid ${color}40`, color }}
        >
          {icon}
        </span>

        <div className="budget-card__title-group">
          <span className="budget-card__name">{name}</span>
          <span className={`budget-card__badge budget-card__badge--${status}`}>
            {STATUS_LABEL[status]}
          </span>
        </div>

        <div className="budget-card__actions">
          <button
            className="budget-card__action-btn"
            onClick={() => onEdit(budget)}
            title="Edit budget"
            aria-label={`Edit ${name} budget`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            className="budget-card__action-btn budget-card__action-btn--del"
            onClick={() => onDelete(budget.id)}
            title="Remove budget"
            aria-label={`Remove ${name} budget`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="budget-card__progress-wrap">
        <div
          className="budget-card__progress-fill"
          style={{
            width:      `${pct}%`,
            background: status === 'over'    ? '#ef4444' :
                        status === 'warning' ? '#f59e0b' : color,
          }}
        />
      </div>

      {/* ── Amount row ── */}
      <div className="budget-card__amounts">
        <div className="budget-card__spent-group">
          <span className="budget-card__spent-label">Spent</span>
          <span className={`budget-card__spent-value budget-card__spent-value--${status}`}>
            {fmt(spent)}
          </span>
        </div>

        <div className="budget-card__pct">
          {rawPct.toFixed(0)}%
        </div>

        <div className="budget-card__limit-group">
          <span className="budget-card__limit-label">
            {status === 'over' ? 'Over by' : 'Remaining'}
          </span>
          <span className={`budget-card__limit-value ${status === 'over' ? 'budget-card__limit-value--over' : ''}`}>
            {status === 'over' ? fmt(overage) : fmt(remaining)}
            <span className="budget-card__limit-total"> / {fmt(limit)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
