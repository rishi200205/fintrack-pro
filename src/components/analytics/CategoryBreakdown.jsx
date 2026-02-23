import { useState, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js';
import './CategoryBreakdown.css';

ChartJS.register(ArcElement, Tooltip);

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const pct = (part, total) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

/**
 * CategoryBreakdown — Doughnut + ranked category list with income/expense toggle.
 *
 * @param {Array}   expByCategory — [{ id, name, icon, color, value }]
 * @param {Array}   incByCategory — [{ id, name, icon, color, value }]
 * @param {boolean} loading
 */
export default function CategoryBreakdown({
  expByCategory = [],
  incByCategory = [],
  loading = false,
}) {
  const [mode, setMode] = useState('expense');

  const items = useMemo(
    () => (mode === 'expense' ? expByCategory : incByCategory).slice(0, 7),
    [mode, expByCategory, incByCategory],
  );

  const total = useMemo(() => items.reduce((s, c) => s + c.value, 0), [items]);

  const chartData = useMemo(() => ({
    labels:   items.map((c) => c.name),
    datasets: [{
      data:            items.map((c) => c.value),
      backgroundColor: items.map((c) => c.color),
      borderColor:     '#0f1117',
      borderWidth:     3,
      hoverBorderWidth: 3,
      hoverOffset:     8,
    }],
  }), [items]);

  const options = useMemo(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '70%',
    animation:           { animateRotate: true, duration: 500 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const share = pct(ctx.parsed, total);
            return `  ${ctx.label}: ${fmt(ctx.parsed)} (${share}%)`;
          },
        },
        backgroundColor: '#1a1d2e',
        titleColor:      '#f1f5f9',
        bodyColor:       '#94a3b8',
        borderColor:     'rgba(255,255,255,0.08)',
        borderWidth:     1,
        padding:         12,
        cornerRadius:    10,
        displayColors:   true,
        boxWidth:        10,
        boxHeight:       10,
      },
    },
  }), [total]);

  const isEmpty = items.length === 0;

  return (
    <div className="cat-breakdown">
      {/* ── Type toggle ── */}
      <div className="cat-breakdown__toggle">
        <button
          className={`cat-breakdown__toggle-btn${mode === 'expense' ? ' cat-breakdown__toggle-btn--active cat-breakdown__toggle-btn--expense' : ''}`}
          onClick={() => setMode('expense')}
        >
          Expenses
        </button>
        <button
          className={`cat-breakdown__toggle-btn${mode === 'income' ? ' cat-breakdown__toggle-btn--active cat-breakdown__toggle-btn--income' : ''}`}
          onClick={() => setMode('income')}
        >
          Income
        </button>
      </div>

      {loading ? (
        <div className="cat-breakdown__loading">
          <div className="skeleton cat-breakdown__skeleton-ring" />
          <div className="cat-breakdown__list">
            {[1,2,3,4].map((i) => (
              <div key={i} className="cat-breakdown__skeleton-row">
                <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 10, width: '55%', borderRadius: 4, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 6, width: '80%', borderRadius: 3 }} />
                </div>
                <div className="skeleton" style={{ width: 50, height: 13, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </div>
      ) : isEmpty ? (
        <div className="cat-breakdown__empty">
          <span>{mode === 'expense' ? '🛍️' : '💰'}</span>
          <p>No {mode} data for this period</p>
        </div>
      ) : (
        <div className="cat-breakdown__content">
          {/* ── Doughnut ── */}
          <div className="cat-breakdown__donut-wrap">
            <Doughnut data={chartData} options={options} />
            <div className="cat-breakdown__center">
              <span className="cat-breakdown__center-label">
                {mode === 'expense' ? 'Spent' : 'Earned'}
              </span>
              <span className="cat-breakdown__center-value">{fmt(total)}</span>
              <span className="cat-breakdown__center-sub">{items.length} categories</span>
            </div>
          </div>

          {/* ── Ranked list ── */}
          <ul className="cat-breakdown__list">
            {items.map((cat, idx) => {
              const share = pct(cat.value, total);
              return (
                <li key={cat.id} className="cat-breakdown__item">
                  <span className="cat-breakdown__rank">{idx + 1}</span>
                  <span
                    className="cat-breakdown__icon"
                    style={{
                      background: `${cat.color}22`,
                      borderColor: `${cat.color}44`,
                    }}
                  >
                    {cat.icon}
                  </span>
                  <div className="cat-breakdown__info">
                    <div className="cat-breakdown__row">
                      <span className="cat-breakdown__name">{cat.name}</span>
                      <span className="cat-breakdown__amt">{fmt(cat.value)}</span>
                    </div>
                    <div className="cat-breakdown__bar-track">
                      <div
                        className="cat-breakdown__bar-fill"
                        style={{ width: `${share}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                  <span className="cat-breakdown__pct" style={{ color: cat.color }}>
                    {share}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
