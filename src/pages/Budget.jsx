import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, selectTransactionStatus } from '../store/slices/transactionSlice';
import { fetchCategories, selectCategoriesStatus } from '../store/slices/categorySlice';
import { useBudgets } from '../hooks/useBudgets';
import BudgetCard from '../components/budget/BudgetCard';
import BudgetForm from '../components/budget/BudgetForm';
import Loader from '../components/common/Loader';
import './Budget.css';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function Budget() {
  const dispatch  = useDispatch();
  const txnStatus = useSelector(selectTransactionStatus);
  const catStatus = useSelector(selectCategoriesStatus);

  useEffect(() => {
    if (txnStatus === 'idle') dispatch(fetchTransactions());
  }, [dispatch, txnStatus]);

  useEffect(() => {
    if (catStatus === 'idle') dispatch(fetchCategories());
  }, [dispatch, catStatus]);

  const { budgeted, unbudgeted, totals, saveBudget, deleteBudget } = useBudgets();

  // ── Modal state ──────────────────────────────────────────────────────────
  const [formOpen,    setFormOpen]    = useState(false);
  const [formCat,     setFormCat]     = useState(null);
  const [formExisting, setFormExisting] = useState(null);

  const openSet  = (cat) => {
    setFormCat(cat);
    setFormExisting(null);
    setFormOpen(true);
  };
  const openEdit = (budget) => {
    setFormCat(budget);
    setFormExisting({ limit: budget.limit, period: budget.period });
    setFormOpen(true);
  };
  const closeForm = () => { setFormOpen(false); setFormCat(null); setFormExisting(null); };

  const isLoading = txnStatus === 'idle' || txnStatus === 'loading' || catStatus === 'loading';
  const overBudget = totals.overCount > 0;

  return (
    <div className="budget-page fade-in">

      {/* ── Header ── */}
      <div className="budget-page__header">
        <div>
          <h1 className="budget-page__title">Budgets</h1>
          <p className="budget-page__subtitle">
            {isLoading
              ? 'Loading…'
              : `${budgeted.length} budget${budgeted.length !== 1 ? 's' : ''} set · resets monthly`}
          </p>
        </div>
      </div>

      {/* ── Overview bar ── */}
      {!isLoading && budgeted.length > 0 && (
        <div className={`budget-page__overview ${overBudget ? 'budget-page__overview--alert' : ''}`}>
          <div className="budget-page__ov-item">
            <span className="budget-page__ov-label">Total budgeted</span>
            <span className="budget-page__ov-value">{fmt(totals.totalLimit)}</span>
          </div>
          <div className="budget-page__ov-divider" />
          <div className="budget-page__ov-item">
            <span className="budget-page__ov-label">Total spent</span>
            <span className={`budget-page__ov-value ${totals.totalSpent > totals.totalLimit ? 'budget-page__ov-value--danger' : ''}`}>
              {fmt(totals.totalSpent)}
            </span>
          </div>
          <div className="budget-page__ov-divider" />
          <div className="budget-page__ov-item">
            <span className="budget-page__ov-label">Remaining</span>
            <span className={`budget-page__ov-value ${totals.totalLimit - totals.totalSpent < 0 ? 'budget-page__ov-value--danger' : 'budget-page__ov-value--safe'}`}>
              {fmt(Math.max(totals.totalLimit - totals.totalSpent, 0))}
            </span>
          </div>
          {(totals.overCount > 0 || totals.warnCount > 0) && (
            <>
              <div className="budget-page__ov-divider" />
              <div className="budget-page__ov-alerts">
                {totals.overCount > 0 && (
                  <span className="budget-page__ov-badge budget-page__ov-badge--over">
                    {totals.overCount} over budget
                  </span>
                )}
                {totals.warnCount > 0 && (
                  <span className="budget-page__ov-badge budget-page__ov-badge--warn">
                    {totals.warnCount} nearing limit
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="budget-page__loader"><Loader size="lg" /></div>
      ) : (
        <>
          {/* ── Active budgets ── */}
          {budgeted.length > 0 ? (
            <section className="budget-page__section">
              <h2 className="budget-page__section-title">Active Budgets</h2>
              <div className="budget-page__grid">
                {budgeted.map((b) => (
                  <BudgetCard
                    key={b.id}
                    budget={b}
                    onEdit={openEdit}
                    onDelete={deleteBudget}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="budget-page__empty">
              <span className="budget-page__empty-icon">💰</span>
              <p className="budget-page__empty-title">No budgets set yet</p>
              <p className="budget-page__empty-sub">
                Set spending limits for your categories to track where your money goes.
              </p>
            </div>
          )}

          {/* ── Categories without a budget ── */}
          {unbudgeted.length > 0 && (
            <section className="budget-page__section">
              <h2 className="budget-page__section-title">Set a Budget</h2>
              <p className="budget-page__section-sub">
                These expense categories don't have a monthly limit yet.
              </p>
              <div className="budget-page__unbudgeted">
                {unbudgeted.map((cat) => (
                  <button
                    key={cat.id}
                    className="budget-page__unbudgeted-item"
                    onClick={() => openSet(cat)}
                  >
                    <span
                      className="budget-page__unbudgeted-icon"
                      style={{ background: `${cat.color}1a`, border: `1px solid ${cat.color}40`, color: cat.color }}
                    >
                      {cat.icon}
                    </span>
                    <span className="budget-page__unbudgeted-name">{cat.name}</span>
                    {cat.spent > 0 && (
                      <span className="budget-page__unbudgeted-spent">{fmt(cat.spent)} this month</span>
                    )}
                    <span className="budget-page__unbudgeted-cta">Set limit →</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Form modal ── */}
      <BudgetForm
        isOpen={formOpen}
        onClose={closeForm}
        category={formCat}
        existing={formExisting}
        onSave={saveBudget}
      />
    </div>
  );
}
