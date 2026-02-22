import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './SpendingTrend.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// Fixed: properly formats values at all magnitudes
const fmtAxis = (v) => {
  if (v === 0) return '$0';
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
};

/**
 * SpendingTrend — grouped bar chart of income vs expense per month.
 * @param {Array}   monthly — [{ label, income, expense }]
 * @param {boolean} loading
 */
export default function SpendingTrend({ monthly = [], loading = false }) {
  // Totals for the period summary row
  const totals = useMemo(() => {
    const inc = monthly.reduce((s, m) => s + m.income, 0);
    const exp = monthly.reduce((s, m) => s + m.expense, 0);
    return { inc, exp, net: inc - exp };
  }, [monthly]);

  const chartData = useMemo(() => ({
    labels: monthly.map((m) => m.label),
    datasets: [
      {
        label:           'Income',
        data:            monthly.map((m) => m.income),
        backgroundColor: 'rgba(34, 197, 94, 0.80)',
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        borderWidth:     0,
        borderRadius:    5,
        borderSkipped:   'bottom',   // Fixed: only round the top edge
        barPercentage:   0.60,
        categoryPercentage: 0.75,
      },
      {
        label:           'Expenses',
        data:            monthly.map((m) => m.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        hoverBackgroundColor: 'rgba(239, 68, 68, 1)',
        borderWidth:     0,
        borderRadius:    5,
        borderSkipped:   'bottom',   // Fixed: only round the top edge
        barPercentage:   0.60,
        categoryPercentage: 0.75,
      },
    ],
  }), [monthly]);

  const options = useMemo(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start',            // Fixed: was 'end', now left-aligned
        labels: {
          color:           '#94a3b8',
          boxWidth:        10,
          boxHeight:       10,
          borderRadius:    3,
          useBorderRadius: true,
          padding:         16,
          font: { size: 12, family: 'Inter, sans-serif' },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `  ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`,
          afterBody: (items) => {
            const inc = items.find((i) => i.datasetIndex === 0)?.parsed.y ?? 0;
            const exp = items.find((i) => i.datasetIndex === 1)?.parsed.y ?? 0;
            const net = inc - exp;
            return [``, `  Net: ${net >= 0 ? '+' : ''}${fmt(net)}`];
          },
        },
        backgroundColor: '#1a1d2e',
        titleColor:      '#f1f5f9',
        bodyColor:       '#94a3b8',
        borderColor:     'rgba(255,255,255,0.08)',
        borderWidth:     1,
        padding:         12,
        cornerRadius:    10,
        boxPadding:      4,
      },
    },
    scales: {
      x: {
        grid:   { display: false },
        ticks:  { color: '#64748b', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: {
          color:     'rgba(255,255,255,0.04)',
          lineWidth: 1,
        },
        ticks: {
          color:    '#64748b',
          font:     { size: 11 },
          callback: fmtAxis,          // Fixed: was broken for values < 1000
          maxTicksLimit: 5,
        },
        border: { display: false },
      },
    },
  }), []);

  if (loading) {
    return (
      <div className="spending-trend spending-trend--loading">
        <div className="skeleton" style={{ height: '100%', borderRadius: 8 }} />
      </div>
    );
  }

  const netPositive = totals.net >= 0;

  return (
    <div className="spending-trend fade-in">
      {/* Bar chart */}
      <div className="spending-trend__chart">
        <Bar data={chartData} options={options} />
      </div>

      {/* Summary footer */}
      {monthly.length > 0 && (
        <div className="spending-trend__summary">
          <div className="spending-trend__sum-item">
            <span className="spending-trend__sum-dot spending-trend__sum-dot--income" />
            <span className="spending-trend__sum-label">Total Income</span>
            <span className="spending-trend__sum-value spending-trend__sum-value--income">
              {fmt(totals.inc)}
            </span>
          </div>
          <div className="spending-trend__sum-divider" />
          <div className="spending-trend__sum-item">
            <span className="spending-trend__sum-dot spending-trend__sum-dot--expense" />
            <span className="spending-trend__sum-label">Total Expenses</span>
            <span className="spending-trend__sum-value spending-trend__sum-value--expense">
              {fmt(totals.exp)}
            </span>
          </div>
          <div className="spending-trend__sum-divider" />
          <div className="spending-trend__sum-item">
            <span
              className={`spending-trend__sum-badge ${netPositive ? 'spending-trend__sum-badge--pos' : 'spending-trend__sum-badge--neg'}`}
            >
              Net
            </span>
            <span className="spending-trend__sum-label">Net Savings</span>
            <span
              className={`spending-trend__sum-value spending-trend__sum-value--net ${netPositive ? 'spending-trend__sum-value--pos' : 'spending-trend__sum-value--neg'}`}
            >
              {netPositive ? '+' : ''}{fmt(totals.net)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
