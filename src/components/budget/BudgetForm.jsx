import { useState } from 'react';
import Modal from '../common/Modal';
import './BudgetForm.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const QUICK_AMOUNTS = [100, 200, 300, 500, 750, 1000];

/**
 * BudgetForm — Set or edit a category budget.
 *
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {object}   category   — { id, name, icon, color, spent }
 * @param {object}   existing   — current budget { limit, period } | null
 * @param {Function} onSave     — (categoryId, limit, period) => void
 */
export default function BudgetForm({ isOpen, onClose, category, existing, onSave }) {
  const [limit,  setLimit]  = useState(existing?.limit ? String(existing.limit) : '');
  const [period, setPeriod] = useState(existing?.period ?? 'monthly');
  const [error,  setError]  = useState('');

  const handleLimit = (val) => {
    setLimit(val);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(limit);
    if (!limit || isNaN(num) || num <= 0) {
      setError('Enter a valid amount greater than $0');
      return;
    }
    onSave(category.id, num, period);
    onClose();
  };

  if (!category) return null;

  const spent     = category.spent ?? 0;
  const limitNum  = parseFloat(limit) || 0;
  const pct       = limitNum > 0 ? Math.min((spent / limitNum) * 100, 100) : 0;
  const status    = pct >= 100 ? 'over' : pct >= 80 ? 'warning' : 'safe';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existing ? `Edit ${category.name} Budget` : `Set Budget — ${category.name}`}
      size="sm"
    >
      <form className="budget-form" onSubmit={handleSubmit} noValidate>

        {/* Category preview */}
        <div className="budget-form__preview">
          <span
            className="budget-form__cat-icon"
            style={{ background: `${category.color}1a`, border: `1px solid ${category.color}40`, color: category.color }}
          >
            {category.icon}
          </span>
          <div className="budget-form__cat-info">
            <span className="budget-form__cat-name">{category.name}</span>
            <span className="budget-form__cat-spent">
              {fmt(spent)} spent this month
            </span>
          </div>
        </div>

        {/* Live preview bar */}
        {limitNum > 0 && (
          <div className="budget-form__live-preview">
            <div className="budget-form__live-bar-track">
              <div
                className="budget-form__live-bar-fill"
                style={{
                  width: `${pct}%`,
                  background: status === 'over' ? '#ef4444' : status === 'warning' ? '#f59e0b' : category.color,
                }}
              />
            </div>
            <div className="budget-form__live-labels">
              <span className="budget-form__live-spent">{fmt(spent)} spent</span>
              <span className={`budget-form__live-pct budget-form__live-pct--${status}`}>
                {pct.toFixed(0)}% of {fmt(limitNum)}
              </span>
            </div>
          </div>
        )}

        {/* Amount field */}
        <div className={`budget-form__field ${error ? 'budget-form__field--error' : ''}`}>
          <label className="budget-form__label" htmlFor="bf-amount">Monthly Limit</label>
          <div className="budget-form__prefix-wrap">
            <span className="budget-form__prefix">$</span>
            <input
              id="bf-amount"
              type="number"
              className="budget-form__input"
              placeholder="0"
              min="1"
              step="1"
              value={limit}
              onChange={(e) => handleLimit(e.target.value)}
              autoFocus
            />
          </div>
          {error && <span className="budget-form__error">{error}</span>}
        </div>

        {/* Quick-pick amounts */}
        <div className="budget-form__quick">
          <span className="budget-form__quick-label">Quick pick</span>
          <div className="budget-form__quick-amounts">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                className={`budget-form__quick-btn ${parseFloat(limit) === a ? 'budget-form__quick-btn--active' : ''}`}
                onClick={() => handleLimit(String(a))}
              >
                ${a}
              </button>
            ))}
          </div>
        </div>

        {/* Period selector */}
        <div className="budget-form__field">
          <label className="budget-form__label">Reset period</label>
          <div className="budget-form__period-tabs">
            {['monthly', 'weekly'].map((p) => (
              <button
                key={p}
                type="button"
                className={`budget-form__period-btn ${period === p ? 'budget-form__period-btn--active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === 'monthly' ? '📅 Monthly' : '📆 Weekly'}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="budget-form__footer">
          <button type="button" className="budget-form__btn budget-form__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="budget-form__btn budget-form__btn--save"
            style={{ background: category.color }}
          >
            {existing ? 'Update Budget' : 'Set Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
