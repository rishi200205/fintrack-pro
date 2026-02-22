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

/**
 * SpendingTrend — grouped bar chart of income vs expense per month.
 * @param {Array}   monthly — [{ label, income, expense }]
 * @param {boolean} loading
 */
export default function SpendingTrend({ monthly = [], loading = false }) {
  const chartData = useMemo(() => ({
    labels:   monthly.map((m) => m.label),
    datasets: [
      {
        label:           'Income',
        data:            monthly.map((m) => m.income),
        backgroundColor: 'rgba(34, 197, 94, 0.75)',
        borderColor:     'rgba(34, 197, 94, 1)',
        borderWidth:     0,
        borderRadius:    4,
        borderSkipped:   false,
      },
      {
        label:           'Expenses',
        data:            monthly.map((m) => m.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        borderColor:     'rgba(239, 68, 68, 1)',
        borderWidth:     0,
        borderRadius:    4,
        borderSkipped:   false,
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
        align: 'end',
        labels: {
          color:     'var(--text-secondary)',
          boxWidth:  10,
          boxHeight: 10,
          borderRadius: 3,
          useBorderRadius: true,
          padding: 16,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}` },
        backgroundColor: '#1e2130',
        titleColor:      '#f1f5f9',
        bodyColor:       '#94a3b8',
        borderColor:     'rgba(255,255,255,0.1)',
        borderWidth:     1,
        padding:         10,
        cornerRadius:    8,
      },
    },
    scales: {
      x: {
        grid:  { display: false },
        ticks: { color: 'var(--text-muted)', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid:  { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color:    'var(--text-muted)',
          font:     { size: 11 },
          callback: (v) => `$${(v / 1000).toFixed(v >= 1000 ? 1 : 0)}${v >= 1000 ? 'k' : ''}`,
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

  return (
    <div className="spending-trend fade-in">
      <Bar data={chartData} options={options} />
    </div>
  );
}
