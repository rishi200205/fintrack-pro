import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTransactions, selectTransactionStatus } from '../store/slices/transactionSlice';
import { fetchCategories, selectCategoriesStatus } from '../store/slices/categorySlice';
import { useAnalytics } from '../hooks/useAnalytics';
import { selectUser } from '../store/slices/authSlice';
import Card from '../components/common/Card';
import BalanceCard from '../components/dashboard/BalanceCard';
import QuickChart from '../components/dashboard/QuickChart';
import SpendingTrend from '../components/dashboard/SpendingTrend';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch   = useDispatch();
  const user       = useSelector(selectUser);
  const txnStatus  = useSelector(selectTransactionStatus);
  const catStatus  = useSelector(selectCategoriesStatus);

  const loading = txnStatus === 'idle' || txnStatus === 'loading' || catStatus === 'loading';

  // Fetch data on first mount
  useEffect(() => {
    if (txnStatus === 'idle') dispatch(fetchTransactions());
  }, [dispatch, txnStatus]);

  useEffect(() => {
    if (catStatus === 'idle') dispatch(fetchCategories());
  }, [dispatch, catStatus]);

  const {
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
    monthIncome,
    monthExpense,
    byCategory,
    monthly,
    recent,
    displayCurrency,
  } = useAnalytics();

  const hour  = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="dashboard fade-in">
      {/* ── Page header ── */}
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">{greeting}, {firstName} 👋</h1>
          <p className="dashboard__subtitle">Here&apos;s your financial overview</p>
        </div>
        <Link to="/transactions" className="dashboard__cta">
          + Add Transaction
        </Link>
      </div>

      {/* ── Balance cards ── */}
      <div className="dashboard__cards">
        <BalanceCard type="balance" value={netBalance}    currency={displayCurrency} loading={loading} />
        <BalanceCard type="income"  value={totalIncome}   currency={displayCurrency} loading={loading} change={monthIncome}  />
        <BalanceCard type="expense" value={totalExpense}  currency={displayCurrency} loading={loading} change={monthExpense} />
        <BalanceCard type="savings" value={savingsRate}   currency={displayCurrency} loading={loading} />
      </div>

      {/* ── Charts row ── */}
      <div className="dashboard__charts">
        {/* Monthly trend */}
        <Card
          className="dashboard__chart-card dashboard__chart-card--trend"
          header={<h3>Monthly Overview</h3>}
          padding="md"
        >
          <SpendingTrend monthly={monthly} currency={displayCurrency} loading={loading} />
        </Card>

        {/* Category pie */}
        <Card
          className="dashboard__chart-card dashboard__chart-card--pie"
          header={<h3>Spending by Category</h3>}
          padding="md"
        >
          <QuickChart byCategory={byCategory} currency={displayCurrency} loading={loading} />
        </Card>
      </div>

      {/* ── Recent transactions ── */}
      <Card
        className="dashboard__recent"
        header={
          <>
            <h3>Recent Transactions</h3>
            <Link to="/transactions" className="dashboard__view-all">View all</Link>
          </>
        }
        padding="md"
      >
        <RecentTransactions transactions={recent} loading={loading} />
      </Card>
    </div>
  );
}