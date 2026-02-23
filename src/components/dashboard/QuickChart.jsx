import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js';
import './QuickChart.css';

ChartJS.register(ArcElement, Tooltip);

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const pct = (part, total) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

/**
 * QuickChart — Redesigned doughnut with side-by-side legend.
 * @param {Array}   byCategory  — [{ id, name, color, spent }]
 * @param {boolean} loading
 */
export default function QuickChart({ byCategory = [], loading = false }) {
  const top = useMemo(() => byCategory.slice(0, 6), [byCategory]);
  const total = useMemo(() => top.reduce((s, c) => s + c.spent, 0), [top]);

  const chartData = useMemo(() => ({
    labels:   top.map((c) => c.name),
    datasets: [{
      data:            top.map((c) => c.spent),
      backgroundColor: top.map((c) => c.color),
      // White ring between segments for clear separation
      borderColor:     '#0f1117',
      borderWidth:     3,
      hoverBorderWidth: 3,
      hoverOffset:     8,
    }],
  }), [top]);

  const options = useMemo(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '72%',
    animation:           { animateRotate: true, duration: 600 },
    layout:              { padding: 10 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const p = pct(ctx.parsed, total);
            return `  ${ctx.label}: ${fmt(ctx.parsed)} (${p}%)`;
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

  if (loading) {
    return (
      <div className="quick-chart quick-chart--loading">
        <div className="quick-chart__canvas-wrap">
          <div className="skeleton quick-chart__skeleton-ring" />
        </div>
        <div className="quick-chart__legend">
          {[1,2,3,4].map((i) => (
            <div key={i} className="quick-chart__legend-item">
              <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 11, width: '60%', marginBottom: 5, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 6, width: '80%', borderRadius: 3 }} />
              </div>
              <div className="skeleton" style={{ width: 52, height: 14, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!top.length) {
    return (
      <div className="quick-chart quick-chart--empty">
        <div className="quick-chart__empty-icon">📊</div>
        <p className="quick-chart__empty-title">No spending data</p>
        <p className="quick-chart__empty-sub">Add transactions to see your breakdown</p>
      </div>
    );
  }

  return (
    <div className="quick-chart fade-in">
      {/* ── Doughnut ── */}
      <div className="quick-chart__canvas-wrap">
        <Doughnut data={chartData} options={options} />
        <div className="quick-chart__center">
          <span className="quick-chart__center-label">Spent</span>
          <span className="quick-chart__center-value">{fmt(total)}</span>
          <span className="quick-chart__center-sub">{top.length} categories</span>
        </div>
      </div>

      {/* ── Legend ── */}
      <ul className="quick-chart__legend">
        {top.map((cat) => {
          const share = pct(cat.spent, total);
          return (
            <li key={cat.id} className="quick-chart__legend-item">
              {/* Colored swatch */}
              <span
                className="quick-chart__legend-swatch"
                style={{ background: `${cat.color}22`, borderLeft: `3px solid ${cat.color}` }}
              >
                <span className="quick-chart__legend-icon">{cat.icon ?? '💼'}</span>
              </span>

              {/* Name + progress bar */}
              <div className="quick-chart__legend-body">
                <div className="quick-chart__legend-row">
                  <span className="quick-chart__legend-name">{cat.name}</span>
                  <span className="quick-chart__legend-pct">{share}%</span>
                </div>
                <div className="quick-chart__legend-bar-track">
                  <div
                    className="quick-chart__legend-bar-fill"
                    style={{ width: `${share}%`, background: cat.color }}
                  />
                </div>
              </div>

              {/* Amount */}
              <span className="quick-chart__legend-amount">{fmt(cat.spent)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
