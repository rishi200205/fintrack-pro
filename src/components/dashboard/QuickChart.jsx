import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './QuickChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

/**
 * QuickChart — Doughnut chart showing spending by category.
 * @param {Array}   byCategory  — [{ id, name, color, spent }]
 * @param {boolean} loading
 */
export default function QuickChart({ byCategory = [], loading = false }) {
  const top = useMemo(() => byCategory.slice(0, 6), [byCategory]);

  const chartData = useMemo(() => ({
    labels:   top.map((c) => c.name),
    datasets: [{
      data:            top.map((c) => c.spent),
      backgroundColor: top.map((c) => c.color),
      borderColor:     top.map((c) => c.color),
      borderWidth:     2,
      hoverOffset:     6,
    }],
  }), [top]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${fmt(ctx.parsed)}`,
        },
        backgroundColor: 'var(--bg-overlay)',
        titleColor:      'var(--text-primary)',
        bodyColor:       'var(--text-secondary)',
        borderColor:     'var(--border-default)',
        borderWidth:     1,
        padding:         10,
        cornerRadius:    8,
      },
    },
  }), []);

  const total = top.reduce((s, c) => s + c.spent, 0);

  if (loading) {
    return (
      <div className="quick-chart">
        <div className="quick-chart__canvas-wrap">
          <div className="skeleton" style={{ width: 160, height: 160, borderRadius: '50%' }} />
        </div>
      </div>
    );
  }

  if (!top.length) {
    return (
      <div className="quick-chart quick-chart--empty">
        <p className="quick-chart__empty-text">No expense data yet</p>
      </div>
    );
  }

  return (
    <div className="quick-chart fade-in">
      <div className="quick-chart__canvas-wrap">
        <Doughnut data={chartData} options={options} />
        <div className="quick-chart__center">
          <span className="quick-chart__center-label">Total</span>
          <span className="quick-chart__center-value">{fmt(total)}</span>
        </div>
      </div>

      <ul className="quick-chart__legend">
        {top.map((cat) => (
          <li key={cat.id} className="quick-chart__legend-item">
            <span className="quick-chart__legend-dot" style={{ background: cat.color }} />
            <span className="quick-chart__legend-name">{cat.name}</span>
            <span className="quick-chart__legend-amount">{fmt(cat.spent)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
