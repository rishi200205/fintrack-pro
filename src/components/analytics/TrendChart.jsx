import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatCurrencyCompact, getCurrency } from '../../utils/currency';
import './TrendChart.css';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Filler, Tooltip, Legend,
);

/**
 * TrendChart — line chart of income vs expense with net savings.
 *
 * @param {Array}   monthly  — [{ label, income, expense, net }]
 * @param {string}  currency — ISO 4217 display currency code
 * @param {boolean} loading
 */
export default function TrendChart({ monthly = [], currency = 'USD', loading = false }) {
  const fmt     = (n) => formatCurrencyCompact(n, currency);
  const sym     = getCurrency(currency).symbol;
  const fmtAxis = (v) => {
    if (v === 0) return `${sym}0`;
    if (v >= 1000) return `${sym}${(v / 1000).toFixed(0)}k`;
    return `${sym}${v}`;
  };
  const chartData = useMemo(() => ({
    labels: monthly.map((m) => m.label),
    datasets: [
      {
        label:            'Income',
        data:             monthly.map((m) => m.income),
        borderColor:      '#22c55e',
        backgroundColor:  'rgba(34, 197, 94, 0.08)',
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#0f1117',
        pointBorderWidth: 2,
        pointRadius:      4,
        pointHoverRadius: 6,
        borderWidth:      2,
        tension:          0.35,
        fill:             false,
      },
      {
        label:            'Expenses',
        data:             monthly.map((m) => m.expense),
        borderColor:      '#f87171',
        backgroundColor:  'rgba(248, 113, 113, 0.08)',
        pointBackgroundColor: '#f87171',
        pointBorderColor: '#0f1117',
        pointBorderWidth: 2,
        pointRadius:      4,
        pointHoverRadius: 6,
        borderWidth:      2,
        tension:          0.35,
        fill:             false,
      },
      {
        label:            'Net Savings',
        data:             monthly.map((m) => m.net),
        borderColor:      '#818cf8',
        backgroundColor:  'rgba(129, 140, 248, 0.10)',
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#0f1117',
        pointBorderWidth: 2,
        pointRadius:      4,
        pointHoverRadius: 6,
        borderWidth:      2,
        tension:          0.35,
        fill:             true,
        borderDash:       [5, 4],
      },
    ],
  }), [monthly]);

  const options = useMemo(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    interaction:         { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display:  true,
        position: 'top',
        align:    'start',
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
    scales: {
      x: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 12 } },
        border: { color: 'transparent' },
      },
      y: {
        grid:     { color: 'rgba(255,255,255,0.04)' },
        ticks:    { color: '#64748b', font: { size: 12 }, callback: fmtAxis },
        border:   { color: 'transparent' },
        beginAtZero: true,
      },
    },
  }), []);

  const skeletonBars = [1, 2, 3, 4, 5, 6];

  return (
    <div className="trend-chart">
      {loading ? (
        <div className="trend-chart__skeleton">
          {skeletonBars.map((i) => (
            <div key={i} className="skeleton" style={{ flex: 1, borderRadius: 4, height: `${30 + i * 12}%`, alignSelf: 'flex-end' }} />
          ))}
        </div>
      ) : monthly.length === 0 ? (
        <div className="trend-chart__empty">
          <span className="trend-chart__empty-icon">📈</span>
          <p>No data for this period</p>
        </div>
      ) : (
        <div className="trend-chart__canvas-wrap">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
