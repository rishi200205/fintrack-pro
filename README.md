# FinTrack Pro

A modern personal finance tracker built with React 19, Redux Toolkit, and Vite. Track income and expenses, manage budgets, visualize spending trends, and export your data — all in a polished dark/light interface.

---

## Features

- **Dashboard** — KPI summary cards, spending trend chart, category breakdown doughnut, top transactions
- **Transactions** — Full CRUD with search, type/category/date filters, sortable table
- **Budgets** — Per-category budget limits with live progress tracking and status indicators
- **Analytics** — Period selector (1M / 3M / 6M / 1Y), line trend chart, category breakdown, monthly summary table, insight highlights
- **Settings** — Dark/light theme toggle, profile display, CSV transaction export, demo data reset, sign-out
- **Toast notifications** — System-wide feedback for all user actions
- **Responsive** — Full mobile support with collapsible sidebar, bottom navigation bar, adaptive layouts

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | React 19 + Vite 7                       |
| State       | Redux Toolkit (5 slices)                |
| Routing     | React Router v7                         |
| Charts      | Chart.js 4 (Line, Doughnut, Bar)        |
| HTTP        | Axios + axios-mock-adapter (mock API)   |
| Styling     | Plain CSS with custom properties (no UI library) |
| Linting     | ESLint (react-hooks, react-refresh)     |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Demo Credentials

| Field    | Value               |
|----------|---------------------|
| Email    | rishi@fintrack.pro  |
| Password | demo1234            |

---

## Project Structure

```
src/
├── api/               # Axios client, mock adapter, mock data, service functions
├── components/
│   ├── analytics/     # InsightCard, TrendChart, CategoryBreakdown
│   ├── budget/        # BudgetCard, BudgetForm, BudgetProgress
│   ├── common/        # Modal, ToastContainer
│   ├── dashboard/     # StatCard, QuickChart, SpendingTrend, RecentTransactions
│   └── transactions/  # TransactionFilters, TransactionForm, TransactionItem, TransactionList
├── context/           # AuthContext (legacy, superseded by Redux)
├── hooks/             # useAnalyticsPage
├── pages/             # Dashboard, Transactions, Budget, Analytics, Settings, Login, Signup
├── routes/            # AppRoutes, ProtectedRoute
├── store/             # Redux store + 5 slices (auth, transactions, categories, budgets, ui)
├── styles/            # variables.css, reset.css
└── utils/             # exportCsv.js
```

---

## Implementation Phases

| Phase | Description                                 | Status |
|-------|---------------------------------------------|--------|
| 1     | Design system & CSS tokens                  | ✅     |
| 2     | Redux store + mock API                      | ✅     |
| 3     | Auth (Login, Signup, protected routes)      | ✅     |
| 4     | Dashboard page                              | ✅     |
| 5     | Transactions page (CRUD + filters)          | ✅     |
| 6     | Budgets page                                | ✅     |
| 7     | Analytics page                              | ✅     |
| 8     | Settings, toast system, CSV export, polish  | ✅     |

