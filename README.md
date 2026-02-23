<div align="center">

#  FinTrack Pro

**A full-featured personal finance tracker built with React 19, Redux Toolkit, and Vite.**

Track income and expenses, set budgets, visualize trends, and export your data 
all inside a pixel-perfect dark/light interface with zero external UI libraries.

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764abc?style=flat-square&logo=redux)](https://redux-toolkit.js.org)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-ff6384?style=flat-square&logo=chartdotjs)](https://www.chartjs.org)

</div>

---

##  Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Demo Credentials](#-demo-credentials)
- [Project Structure](#-project-structure)
- [Pages & Components](#-pages--components)
- [State Management](#-state-management)
- [API Layer](#-api-layer)
- [Design System](#-design-system)
- [Build & Scripts](#-build--scripts)

---

##  Overview

FinTrack Pro is a single-page application that simulates a real-world personal finance dashboard.
It runs entirely in the browser using a mock Axios adapter  no backend required.
All data persists in-memory during the session (transactions, custom categories, budgets),
and the theme preference is saved to `localStorage`.

**Key highlights:**

- 100% custom CSS — no Tailwind, no UI component library
- Full CRUD for transactions with search, filter, and sort
- Custom category creator with emoji + color picker, live across all pages
- **Multi-currency support** — 10 currencies, mock exchange rates, real-time conversion across all views
- Interactive charts (Line, Doughnut, Bar) with hover tooltips
- Dark & light themes switchable from the topbar or Settings page
- CSV export, toast notification system, responsive mobile layout
- Custom SVG favicon and branded page title

---

##  Features

###  Dashboard
- KPI cards: total income, total expenses, net balance, savings rate
- Spending trend bar chart (last 6 months)
- Category doughnut breakdown with legend and progress bars
- Recent transactions list

###  Transactions
- Add, edit, and delete transactions via modal form
- Income / expense type toggle with filtered category lists
- **Per-transaction currency selector** — 10 currencies (USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, MXN)
- Each transaction stores its original currency; amounts convert to the display currency everywhere
- Real-time search by description
- Filters: type, category, date range
- Sortable columns: date, amount, category
- **Inline custom category creator** — pick emoji icon + color swatch, auto-selects on create

###  Budgets
- Set per-category monthly / weekly budget limits
- Live progress bars with percentage indicators
- Status badges: On Track  Warning  Over Budget
- Edit and delete budget entries

###  Analytics
- Period selector: 1M / 3M / 6M / 1Y
- Line chart: Income vs Expenses vs Net Savings trend
- Category breakdown doughnut with top-3 highlights and full tile grid
- Monthly summary table (most recent first) with totals footer
- Insight callouts: best month, worst month, average spend, transaction count

###  Settings
- **Appearance** — Dark / Light theme toggle with mini UI preview swatches
- **Currency** — Pick from 10 display currencies; all totals, KPI cards, and charts update instantly using mock exchange rates
- **Profile** — Displays logged-in user name and email with initials avatar
- **Data & Export** — Download all transactions as a `.csv` file
- **Account** — Sign out with redirect to login

###  Toast Notifications
- Global system driven by Redux (`uiSlice.toasts`)
- Four types: `success`  `error`  `warning`  `info`
- Auto-dismiss after 4 s, spring slide-in animation, manual dismiss

###  Responsive Design
- Collapsible sidebar drawer on mobile
- Bottom navigation bar for small screens
- All pages adapt gracefully at 480 px / 768 px / 960 px breakpoints

---

##  Tech Stack

| Layer       | Technology                                                              |
|-------------|-------------------------------------------------------------------------|
| Framework   | React 19                                                                |
| Build tool  | Vite 7                                                                  |
| State       | Redux Toolkit  5 slices: `auth`, `transactions`, `categories`, `budgets`, `ui` |
| Routing     | React Router v7  `BrowserRouter`, protected + guest routes             |
| Charts      | Chart.js 4  `Line`, `Doughnut`, `Bar`                                  |
| HTTP        | Axios + `axios-mock-adapter`                                            |
| Styling     | Plain CSS with custom properties  no UI library, no Tailwind           |
| Linting     | ESLint with `react-hooks` + `react-refresh` plugins                     |
| Persistence | `localStorage` — auth token, user, theme preference, display currency  |

---

##  Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rishi200205/fintrack-pro
cd fintrack-pro

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

##  Demo Credentials

> No sign-up required  use the demo account below.

| Field    | Value                |
|----------|----------------------|
| Email    | `rishi@fintrack.pro` |
| Password | `demo1234`           |

Both fields are pre-filled on the login page for convenience.

---

##  Project Structure

```
fintrack-pro/
 public/
    fintrack.svg              # Custom app favicon (indigo bar-chart + trend arrow)
 src/
    api/
       apiClient.js              # Axios instance
       mockAdapter.js            # In-memory mock API (axios-mock-adapter)
       mockData.js               # Seed data: users, categories, 35 transactions
       services/
           authService.js
           categoryService.js
           transactionService.js
           analyticsService.js
   
    components/
       analytics/
          InsightCard.jsx       # KPI tile with trend indicator
          TrendChart.jsx        # Line chart (income / expenses / net)
          CategoryBreakdown.jsx # Doughnut + highlights + tile grid
       budget/
          BudgetCard.jsx        # Budget progress card
          BudgetForm.jsx        # Add / edit budget modal
       common/
          Modal.jsx             # Accessible modal wrapper
          ToastContainer.jsx    # Global toast renderer
       dashboard/
          BalanceCard.jsx       # KPI summary tile
          QuickChart.jsx        # Doughnut + legend
          SpendingTrend.jsx     # Bar chart
          RecentTransactions.jsx
       transactions/
          TransactionFilters.jsx
          TransactionForm.jsx   # Add/edit + inline custom category creator
          TransactionItem.jsx
       Layout.jsx                # App shell, sidebar, topbar, bottom nav
   
    hooks/
       useAnalyticsPage.js       # Period-aware data aggregation
       useAnalytics.js
       useBudgets.js
       useTransactions.js
   
    pages/
       Dashboard.jsx
       Transactions.jsx
       Budget.jsx
       Analytics.jsx
       Settings.jsx
       Login.jsx
       Signup.jsx
   
    routes/
       AppRoutes.jsx             # Route definitions + GuestRoute
       ProtectedRoute.jsx        # Redirects unauthenticated users
   
    store/
       index.js
       slices/
           authSlice.js          # loginUser, logoutUser thunks
           transactionSlice.js
           categorySlice.js      # fetchCategories, createCategory thunks
           budgetSlice.js
           uiSlice.js            # theme, toasts, sidebar, modal state
   
    styles/
       variables.css             # All design tokens
       reset.css
   
    utils/
        exportCsv.js              # Builds and triggers CSV download
        currency.js               # 10 currencies, mock rates, convertAmount, formatCurrency

 index.html
 vite.config.js
 eslint.config.js
 package.json
```

---

##  Pages & Components

### Routes

| Route           | Component      | Access    | Description                                        |
|-----------------|----------------|-----------|----------------------------------------------------|
| `/`             | Login          | Guest     | Email + password, remember-me, demo hint           |
| `/signup`       | Signup         | Guest     | Registration UI (mock only)                        |
| `/dashboard`    | Dashboard      | Protected | Overview KPIs, charts, recent activity             |
| `/transactions` | Transactions   | Protected | Full transaction management with per-txn currency  |
| `/budgets`      | Budget         | Protected | Per-category budget tracking                       |
| `/analytics`    | Analytics      | Protected | Period-based deep-dive analysis                    |
| `/settings`     | Settings       | Protected | Theme, currency, profile, export, sign-out         |

### Key Component Responsibilities

| Component           | Responsibility                                                      |
|---------------------|---------------------------------------------------------------------|
| `Layout`            | App shell  sidebar nav, topbar with theme toggle, mobile bottom nav |
| `TransactionForm`   | Add/edit modal, per-transaction currency selector, inline custom category creator |
| `ToastContainer`    | Reads `ui.toasts[]` from Redux, renders self-dismissing toasts      |
| `TrendChart`        | Chart.js Line  three overlapping datasets, custom tooltips         |
| `CategoryBreakdown` | Per-period doughnut + top-3 highlights + full category tile grid    |
| `QuickChart`        | Compact doughnut with icon legend (dashboard sidebar chart)         |
| `SpendingTrend`     | Chart.js Bar  6-month expense history                              |
| `InsightCard`       | KPI tile with left accent bar, icon bubble, value, trend indicator  |

---

##  State Management

```
Redux Store
 auth
    user, token, status, error
    thunks: loginUser, logoutUser

 transactions
    items[], filters{}, status, error
    thunks: fetchTransactions, createTransaction, updateTransaction, deleteTransaction

 categories
    items[], status, error
    thunks: fetchCategories, createCategory

 budgets
    items[], status, error
    thunks: fetchBudgets, createBudget, updateBudget, deleteBudget

 ui
     theme ('dark' | 'light')
     currency (ISO 4217 code, e.g. 'USD', 'EUR')
     toasts[]
     sidebarOpen
     actions: toggleTheme, setCurrency, addToast, removeToast, openModal, closeModal
```

**Theme** — `toggleTheme()` updates `localStorage` and sets `data-theme` on `<html>` directly inside the Redux reducer, no React `useEffect` needed.

**Currency** — `setCurrency(code)` persists the code to `localStorage`. Every computed value in `useAnalytics`, `useAnalyticsPage`, and `useTransactions` calls `convertAmount(t.amount, t.currency, displayCurrency)` before aggregating, so all KPI cards, charts, and table values always reflect the chosen currency.

**Custom categories** — `createCategory` thunk fires `POST /categories`, receives the new object, and appends it to `state.categories.items`. Because all pages read from the same slice, the new category is instantly available in Analytics, Budget selects, and Transaction filters.

---

##  API Layer

All calls go through a single Axios instance. An `axios-mock-adapter` intercepts every request in-memory  no real server is needed.

| Endpoint              | Method   | Description                          |
|-----------------------|----------|--------------------------------------|
| `/auth/login`         | `POST`   | Validate credentials, return token   |
| `/auth/logout`        | `POST`   | Clear session                        |
| `/transactions`       | `GET`    | List all transactions                |
| `/transactions`       | `POST`   | Create transaction                   |
| `/transactions/:id`   | `PUT`    | Update transaction                   |
| `/transactions/:id`   | `DELETE` | Delete transaction                   |
| `/categories`         | `GET`    | List all categories                  |
| `/categories`         | `POST`   | Create custom category               |
| `/budgets`            | `GET`    | List all budgets                     |
| `/budgets`            | `POST`   | Create budget                        |
| `/budgets/:id`        | `PUT`    | Update budget                        |
| `/budgets/:id`        | `DELETE` | Delete budget                        |
| `/analytics/summary`  | `GET`    | Aggregated financial summary         |

---

##  Design System

All tokens live in `src/styles/variables.css`. The light theme is a `[data-theme="light"]` override block  the sidebar is intentionally pinned dark in both themes.

| Group       | Tokens                                                         |
|-------------|----------------------------------------------------------------|
| Brand       | `--color-primary-{50700}`                                     |
| Semantic    | `--color-success-*`, `--color-danger-*`, `--color-warning-*`   |
| Surfaces    | `--bg-base`, `--bg-surface`, `--bg-elevated`, `--bg-overlay`   |
| Text        | `--text-primary`, `--text-secondary`, `--text-muted`           |
| Borders     | `--border-subtle`, `--border-default`, `--border-strong`       |
| Spacing     | `--space-1` (4px)  `--space-16` (64px)                        |
| Radius      | `--radius-sm` (6px)  `--radius-full` (9999px)                 |
| Type scale  | `--text-xs` (12px)  `--text-4xl` (36px)                       |
| Shadows     | `--shadow-sm/md/lg/xl`, `--shadow-glow-primary/success/danger` |
| Transitions | `--duration-fast` (150ms), `--duration-base` (200ms), `--duration-slow` (300ms) |
| Z-index     | `--z-dropdown` (100)  `--z-toast` (500)                       |

---

##  Build & Scripts

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build  dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint across all source files
```

**Production output:**

```
dist/assets/index-[hash].js    ~623 kB   gzip: ~203 kB
dist/assets/index-[hash].css   ~80 kB    gzip: ~12 kB
```

---


