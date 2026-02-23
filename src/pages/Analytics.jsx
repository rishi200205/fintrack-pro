import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, selectTransactionStatus } from '../store/slices/transactionSlice';
import { fetchCategories,   selectCategoriesStatus }   from '../store/slices/categorySlice';
import { useAnalyticsPage }       from '../hooks/useAnalyticsPage';
import { formatCurrencyCompact }  from '../utils/currency';
import InsightCard                from '../components/analytics/InsightCard';
import TrendChart                 from '../components/analytics/TrendChart';
import CategoryBreakdown          from '../components/analytics/CategoryBreakdown';
import './Analytics.css';

const PERIODS = [
  { label: '1M', value: 1  },
  { label: '3M', value: 3  },
  { label: '6M', value: 6  },
  { label: '1Y', value: 12 },
];

export default function Analytics() {
  const dispatch  = useDispatch();
  const txnStatus = useSelector(selectTransactionStatus);
  const catStatus = useSelector(selectCategoriesStatus);
  const [period, setPeriod] = useState(6);

  useEffect(() => {
    if (txnStatus === 'idle') dispatch(fetchTransactions());
    if (catStatus === 'idle') dispatch(fetchCategories());
  }, [dispatch, txnStatus, catStatus]);

  const loading = txnStatus === 'loading' || txnStatus === 'idle';

  const {
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    monthly,
    expByCategory,
    incByCategory,
    biggestExpCat,
    bestMonth,
    worstMonth,
    avgMonthlyExpense,
    txnCount,
    displayCurrency,
  } = useAnalyticsPage(period);

  const fmt = (n) => formatCurrencyCompact(n, displayCurrency);

  const netTrend =
    netSavings > 0 ? 'up'  :
    netSavings < 0 ? 'down' : 'neutral';

  const rateTrend =
    savingsRate >= 20 ? 'up'  :
    savingsRate <  0  ? 'down' : 'neutral';

  return (
    <div className="analytics-page">

      {/* ── Header ── */}
      <div className="analytics-page__header">
        <div>
          <h1 className="analytics-page__title">Analytics</h1>
          <p className="analytics-page__sub">Track your financial performance over time</p>
        </div>
        <div className="analytics-page__period-tabs">
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              className={`analytics-page__period-btn${period === value ? ' analytics-page__period-btn--active' : ''}`}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="analytics-page__kpi-strip">
        <InsightCard
          title="Total Income"
          value={loading ? '—' : fmt(totalIncome)}
          sub={`Across ${period === 1 ? 'this month' : `last ${period} months`}`}
          icon="💰"
          accent="#22c55e"
          trend="up"
          loading={loading}
        />
        <InsightCard
          title="Total Expenses"
          value={loading ? '—' : fmt(totalExpense)}
          sub={`Avg ${loading ? '—' : fmt(avgMonthlyExpense)} / month`}
          icon="💸"
          accent="#f87171"
          trend="down"
          loading={loading}
        />
        <InsightCard
          title="Net Savings"
          value={loading ? '—' : `${netSavings >= 0 ? '+' : ''}${fmt(netSavings)}`}
          sub={biggestExpCat ? `Biggest: ${biggestExpCat.icon} ${biggestExpCat.name}` : undefined}
          icon="🏦"
          accent="#818cf8"
          trend={netTrend}
          loading={loading}
        />
        <InsightCard
          title="Savings Rate"
          value={loading ? '—' : `${savingsRate}%`}
          sub={
            savingsRate >= 20 ? 'Great job! 🎉' :
            savingsRate >  0  ? 'Keep it up!'   :
                                'Expenses exceed income'
          }
          icon="📊"
          accent="#06b6d4"
          trend={rateTrend}
          loading={loading}
        />
      </div>

      {/* ── Trend chart ── */}
      <div className="analytics-page__card">
        <div className="analytics-page__card-header">
          <h2 className="analytics-page__card-title">Income vs Expenses</h2>
          <span className="analytics-page__card-meta">{txnCount} transaction{txnCount !== 1 ? 's' : ''}</span>
        </div>
        <TrendChart monthly={monthly} currency={displayCurrency} loading={loading} />
      </div>

      {/* ── Bottom row ── */}
      <div className="analytics-page__bottom-row">

        {/* Category breakdown */}
        <div className="analytics-page__card analytics-page__card--breakdown">
          <div className="analytics-page__card-header">
            <h2 className="analytics-page__card-title">Category Breakdown</h2>
          </div>
          <CategoryBreakdown
            expByCategory={expByCategory}
            incByCategory={incByCategory}
            currency={displayCurrency}
            loading={loading}
          />
        </div>

        {/* Monthly summary table */}
        <div className="analytics-page__card analytics-page__card--table">
          <div className="analytics-page__card-header">
            <h2 className="analytics-page__card-title">Monthly Summary</h2>
            {!loading && bestMonth && (
              <span className="analytics-page__card-meta">
                Best: {bestMonth.label} (+{fmt(bestMonth.net)})
              </span>
            )}
          </div>

          {loading ? (
            <div className="analytics-page__table-skeleton">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="skeleton" style={{ height: 34, borderRadius: 6 }} />
              ))}
            </div>
          ) : monthly.length === 0 ? (
            <div className="analytics-page__table-empty">No data for this period</div>
          ) : (
            <div className="analytics-page__table-wrap">
              <table className="analytics-page__table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="analytics-page__th--right">Income</th>
                    <th className="analytics-page__th--right">Expenses</th>
                    <th className="analytics-page__th--right">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {[...monthly].reverse().map((m) => (
                    <tr key={m.month} className="analytics-page__tr">
                      <td className="analytics-page__td-month">{m.label}</td>
                      <td className="analytics-page__td-income">{fmt(m.income)}</td>
                      <td className="analytics-page__td-expense">{fmt(m.expense)}</td>
                      <td className={`analytics-page__td-net${m.net >= 0 ? ' analytics-page__td-net--pos' : ' analytics-page__td-net--neg'}`}>
                        {m.net >= 0 ? '+' : ''}{fmt(m.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="analytics-page__tfoot-row">
                    <td>Total</td>
                    <td className="analytics-page__td-income analytics-page__tfoot-val">{fmt(totalIncome)}</td>
                    <td className="analytics-page__td-expense analytics-page__tfoot-val">{fmt(totalExpense)}</td>
                    <td className={`analytics-page__tfoot-val${netSavings >= 0 ? ' analytics-page__td-net--pos' : ' analytics-page__td-net--neg'}`}>
                      {netSavings >= 0 ? '+' : ''}{fmt(netSavings)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {!loading && bestMonth && (
            <div className="analytics-page__callouts">
              <div className="analytics-page__callout analytics-page__callout--best">
                <span className="analytics-page__callout-label">Best month</span>
                <span className="analytics-page__callout-month">{bestMonth.label}</span>
                <span className="analytics-page__callout-val">+{fmt(bestMonth.net)}</span>
              </div>
              {worstMonth && worstMonth.month !== bestMonth.month && (
                <div className="analytics-page__callout analytics-page__callout--worst">
                  <span className="analytics-page__callout-label">Worst month</span>
                  <span className="analytics-page__callout-month">{worstMonth.label}</span>
                  <span className="analytics-page__callout-val">{fmt(worstMonth.net)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}