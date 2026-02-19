# FinTrack Pro — Implementation Roadmap & Git Strategy

## Current State

- ✅ Vite + React 19 project, React Router, basic auth context, protected routes, layout shell
- ❌ All pages are empty `<h1>` placeholders — no Redux, no styling, no API, no charts

---

## Git Strategy Overview

> **IMPORTANT:** Commit early, commit often, commit with meaning. Each commit below is a logical checkpoint — the app should be functional (no broken imports/crashes) at every commit point. Use **conventional commit messages** for a professional Git history.

### Commit Message Format
```
type(scope): short description

# Examples:
feat(auth): add login form with validation
feat(dashboard): add balance overview cards
style(layout): implement sidebar with dark theme
refactor(state): migrate auth from Context to Redux
chore(deps): install Redux Toolkit and Chart.js
```

### Branch Strategy (Recommended)
```
main ← stable, deployable
 └── develop ← integration branch
      ├── feature/phase-1-design-system
      ├── feature/phase-2-redux-api
      ├── feature/phase-3-auth
      ├── feature/phase-4-dashboard
      ├── feature/phase-5-transactions
      ├── feature/phase-6-budgets
      ├── feature/phase-7-analytics
      └── feature/phase-8-polish
```
Create a feature branch per phase → merge to `develop` → merge to `main` at milestones.

---

## PHASE 1 — Foundation & Design System

### Dependencies
```bash
npm install @reduxjs/toolkit react-redux chart.js react-chartjs-2 axios-mock-adapter
```

### Files

| Action | File | Purpose |
|--------|------|---------|
| [NEW] | `src/styles/variables.css` | CSS tokens: colors, spacing, typography, shadows |
| [NEW] | `src/styles/reset.css` | Modern CSS reset |
| [MODIFY] | `src/index.css` | Import design system |
| [NEW] | `src/components/common/Button.jsx` | Reusable button (primary, secondary, danger) |
| [NEW] | `src/components/common/Modal.jsx` | Reusable modal overlay |
| [NEW] | `src/components/common/Loader.jsx` | Loading spinner |
| [NEW] | `src/components/common/Card.jsx` | Card container for widgets |
| [MODIFY] | `src/components/Layout.jsx` | Premium sidebar + top navbar, responsive |

### Design Decisions
- Dark mode default, Inter font, CSS custom properties for theming
- Sidebar on desktop, bottom nav on mobile

### 📌 Git Commits

```
git checkout -b feature/phase-1-design-system
```

| # | When to Commit | Commit Message |
|---|---------------|----------------|
| 1 | After installing all dependencies | `chore(deps): install redux toolkit, chart.js, and axios-mock-adapter` |
| 2 | After creating `variables.css` + `reset.css` + updating `index.css` | `style(design-system): add CSS variables, reset, and global styles` |
| 3 | After building all 4 common components (Button, Modal, Loader, Card) | `feat(common): add reusable Button, Modal, Loader, and Card components` |
| 4 | After rebuilding Layout with sidebar + navbar | `feat(layout): implement responsive sidebar navigation with dark theme` |

```
git checkout develop && git merge feature/phase-1-design-system
```

---

## PHASE 2 — Redux Store & Mock API Layer

### Files

| Action | File | Purpose |
|--------|------|---------|
| [NEW] | `src/store/index.js` | `configureStore` with all slices |
| [NEW] | `src/store/slices/authSlice.js` | User, token, login/logout thunks |
| [NEW] | `src/store/slices/transactionSlice.js` | Transactions CRUD + filters |
| [NEW] | `src/store/slices/categorySlice.js` | Categories with colors |
| [NEW] | `src/store/slices/budgetSlice.js` | Budget per category |
| [NEW] | `src/store/slices/uiSlice.js` | Theme, sidebar, modal state |
| [NEW] | `src/api/apiClient.js` | Axios instance + token interceptors |
| [NEW] | `src/api/mockAdapter.js` | axios-mock-adapter setup |
| [NEW] | `src/api/mockData.js` | 30+ realistic seed transactions |
| [NEW] | `src/api/services/authService.js` | Login/logout API calls |
| [NEW] | `src/api/services/transactionService.js` | Transaction CRUD API |
| [NEW] | `src/api/services/categoryService.js` | Category fetch API |
| [NEW] | `src/api/services/analyticsService.js` | Analytics summary API |
| [MODIFY] | `src/main.jsx` | Wrap with Redux `<Provider>` |
| [MODIFY] | `src/App.jsx` | Remove AuthProvider |
| [DELETE] | `src/context/AuthContext.jsx` | Replaced by Redux |
| [MODIFY] | `src/routes/ProtectedRoute.jsx` | Use `useSelector` |

### 📌 Git Commits
```
git checkout -b feature/phase-2-redux-api
```

| # | When to Commit | Commit Message |
|---|---------------|----------------|
| 5 | After creating all 5 Redux slices + store index | `feat(store): set up Redux store with auth, transaction, category, budget, and ui slices` |
| 6 | After creating apiClient + mockData + mockAdapter | `feat(api): add Axios client with mock adapter and realistic seed data` |
| 7 | After creating all 4 service files | `feat(api): add auth, transaction, category, and analytics service layers` |
| 8 | After wiring Redux into App, removing Context, updating ProtectedRoute | `refactor(app): migrate from Context API to Redux store` |

```
git checkout develop && git merge feature/phase-2-redux-api
```

---

## PHASE 3 — Authentication System

### Files

| Action | File | Purpose |
|--------|------|---------|
| [MODIFY] | `src/pages/Login.jsx` | Full login form with validation, error states, remember me |
| [NEW] | `src/pages/Signup.jsx` | Registration form (mock) |
| [NEW] | `src/hooks/useAuth.js` | Custom hook wrapping Redux auth |
| [MODIFY] | `src/routes/AppRoutes.jsx` | Add signup route, auto-redirect |

### 📌 Git Commits
```
git checkout -b feature/phase-3-auth
```

| # | When to Commit | Commit Message |
|---|---------------|----------------|
| 9 | After building Login page with form + validation | `feat(auth): implement login page with form validation and error handling` |
| 10 | After adding Signup page | `feat(auth): add signup page with registration form` |
| 11 | After adding useAuth hook + session persistence + auto-redirect | `feat(auth): add session persistence and auto-redirect for logged-in users` |

```
git checkout develop && git merge feature/phase-3-auth
```

> **🏷️ MILESTONE TAG:** After merging Phase 3, tag this as `v0.1.0` — you now have a working auth flow + Redux + design system. This is your first deployable checkpoint.
> ```bash
> git checkout main && git merge develop
> git tag -a v0.1.0 -m "Auth system, Redux store, design system complete"
> git push origin main --tags
> ```

---

## PHASE 4 — Dashboard

### Files

| Action | File | Purpose |
|--------|------|---------|
| [MODIFY] | `src/pages/Dashboard.jsx` | Full dashboard layout |
| [NEW] | `src/components/dashboard/BalanceCard.jsx` | Balance, income, expense cards |
| [NEW] | `src/components/dashboard/QuickChart.jsx` | Category pie chart |
| [NEW] | `src/components/dashboard/SpendingTrend.jsx` | Monthly spending bar chart |
| [NEW] | `src/components/dashboard/RecentTransactions.jsx` | Last 5-10 transactions list |
| [NEW] | `src/hooks/useAnalytics.js` | Memoized derived analytics |

### 📌 Git Commits
```
git checkout -b feature/phase-4-dashboard
```

| # | When to Commit | Commit Message |
|---|---------------|----------------|
| 12 | After building BalanceCard + displaying derived totals | `feat(dashboard): add balance overview cards with income and expense totals` |
| 13 | After adding QuickChart + SpendingTrend (both charts working) | `feat(dashboard): add expense pie chart and monthly spending trend chart` |
| 14 | After adding RecentTransactions + final dashboard layout | `feat(dashboard): add recent transactions list and complete dashboard layout` |

```
git checkout develop && git merge feature/phase-4-dashboard
```

---

## PHASE 5 — Transaction Management

### Files

| Action | File | Purpose |
|--------|------|---------|
| [MODIFY] | `src/pages/Transactions.jsx` | Full transactions page |
| [NEW] | `src/components/transactions/TransactionList.jsx` | Paginated table/list |
| [NEW] | `src/components/transactions/TransactionForm.jsx` | Add/edit form in modal |
| [NEW] | `src/components/transactions/TransactionFilters.jsx` | Filter bar: date, category, type, search |
| [NEW] | `src/components/transactions/TransactionItem.jsx` | Single row with edit/delete |
| [NEW] | `src/hooks/useTransactions.js` | Filtered/sorted transactions hook |

### 📌 Git Commits
```
git checkout -b feature/phase-5-transactions
```

| # | When to Commit | Commit Message |
|---|---------------|----------------|
| 15 | After building TransactionList + TransactionItem (read-only display) | `feat(transactions): add transaction list with category colors and amounts` |
| 16 | After adding TransactionForm (add + edit in modal) | `feat(transactions): add transaction form with add and edit functionality` |
| 17 | After adding delete + confirmation dialog | `feat(transactions): add delete transaction with confirmation dialog` |
| 18 | After adding filters, search, sort | `feat(transactions): add search, filters, and sorting with debounced input` |

```
git checkout develop && git merge feature/phase-5-transactions
```

> **🏷️ MILESTONE TAG:** After merging Phase 5, tag `v0.2.0` — full transaction CRUD + dashboard is working.
> ```bash
> git checkout main && git merge develop
> git tag -a v0.2.0 -m "Dashboard and full transaction management complete"
> git push origin main --tags
> ```

---

## PHASE 6 — Budget Tracking

### Files

| Action | File | Purpose |
|--------|------|---------|
| [NEW] | `src/pages/Budget.jsx` | Budget management page |
| [NEW] | `src/components/budget/BudgetCard.jsx` | Category budget with progress bar |
| [NEW] | `src/components/budget/BudgetForm.jsx` | Set/edit budget per category |
| [NEW] | `src/components/budget/BudgetOverview.jsx` | Monthly budget summary |
| [MODIFY] | `src/routes/AppRoutes.jsx` | Add `/budget` route |
| [MODIFY] | `src/components/Layout.jsx` | Add Budget to sidebar |

### 📌 Git Commits
```
git checkout -b feature/phase-6-budgets
```

| # | When to Commit | Commit Message |
|---|---------------|----------------|
| 19 | After creating BudgetForm + BudgetCard (set + display budgets) | `feat(budget): add budget setting form and category budget cards` |
| 20 | After adding progress bars, alerts, overview, and wiring route | `feat(budget): add progress tracking, overspend alerts, and budget overview` |

```
git checkout develop && git merge feature/phase-6-budgets
```

---

## PHASE 7 — Analytics Page

### Files

| Action | File | Purpose |
|--------|------|---------|
| [MODIFY] | `src/pages/Analytics.jsx` | Full analytics page |
| [NEW] | `src/components/charts/MonthlyTrendChart.jsx` | Income vs expense bar chart |
| [NEW] | `src/components/charts/CategoryPieChart.jsx` | Spending distribution doughnut |
| [NEW] | `src/components/charts/SavingsChart.jsx` | Savings rate line chart |
| [NEW] | `src/components/charts/TopExpensesChart.jsx` | Top categories horizontal bar |
| [NEW] | `src/components/analytics/InsightCard.jsx` | Smart insight cards |
| [NEW] | `src/components/analytics/DateRangeFilter.jsx` | Date range selector |

### 📌 Git Commits
```
git checkout -b feature/phase-7-analytics
```

| # | When to Commit | Commit Message |
|---|---------------|----------------|
| 21 | After building MonthlyTrendChart + CategoryPieChart | `feat(analytics): add monthly trend and category distribution charts` |
| 22 | After adding SavingsChart + TopExpensesChart | `feat(analytics): add savings trend and top expenses charts` |
| 23 | After adding InsightCard + DateRangeFilter + final page layout | `feat(analytics): add smart insights, date filters, and complete analytics page` |

```
git checkout develop && git merge feature/phase-7-analytics
```

> **🏷️ MILESTONE TAG:** Tag `v0.3.0` — all core features complete.
> ```bash
> git checkout main && git merge develop
> git tag -a v0.3.0 -m "Analytics, budgets, and all core features complete"
> git push origin main --tags
> ```

---

## PHASE 8 — Settings, Polish & Deployment

### Files

| Action | File | Purpose |
|--------|------|---------|
| [MODIFY] | `src/pages/Settings.jsx` | Theme toggle, currency, profile, export |
| [NEW] | `src/utils/helpers.js` | Format currency, dates, percentages |
| [NEW] | `src/utils/constants.js` | Categories, currencies, chart colors |
| [NEW] | `src/utils/exportData.js` | CSV export utility |
| [MODIFY] | All components | Responsive breakpoints, micro-animations |

### 📌 Git Commits
```
git checkout -b feature/phase-8-polish
```

| # | When to Commit | Commit Message |
|---|---------------|----------------|
| 24 | After building Settings page (theme toggle, currency) | `feat(settings): add theme toggle, currency selection, and profile display` |
| 25 | After adding CSV export + helper utilities | `feat(export): add CSV transaction export and utility helpers` |
| 26 | After responsive design pass on all pages | `style(responsive): add mobile-friendly layouts and breakpoints` |
| 27 | After micro-animations, loading skeletons, final polish | `style(polish): add animations, transitions, and loading skeletons` |
| 28 | After updating README with screenshots, tech stack, features | `docs(readme): add project overview, tech stack, features, and screenshots` |

```
git checkout develop && git merge feature/phase-8-polish
git checkout main && git merge develop
git tag -a v1.0.0 -m "FinTrack Pro v1.0.0 - Production ready"
git push origin main --tags
```

---

## Complete Git History Preview

After all phases, your Git log will look like this (newest first):

```
v1.0.0  docs(readme): add project overview, tech stack, features, and screenshots
        style(polish): add animations, transitions, and loading skeletons
        style(responsive): add mobile-friendly layouts and breakpoints
        feat(export): add CSV transaction export and utility helpers
        feat(settings): add theme toggle, currency selection, and profile display
v0.3.0  feat(analytics): add smart insights, date filters, and complete analytics page
        feat(analytics): add savings trend and top expenses charts
        feat(analytics): add monthly trend and category distribution charts
        feat(budget): add progress tracking, overspend alerts, and budget overview
        feat(budget): add budget setting form and category budget cards
v0.2.0  feat(transactions): add search, filters, and sorting with debounced input
        feat(transactions): add delete transaction with confirmation dialog
        feat(transactions): add transaction form with add and edit functionality
        feat(transactions): add transaction list with category colors and amounts
        feat(dashboard): add recent transactions list and complete dashboard layout
        feat(dashboard): add expense pie chart and monthly spending trend chart
        feat(dashboard): add balance overview cards with income and expense totals
v0.1.0  feat(auth): add session persistence and auto-redirect for logged-in users
        feat(auth): add signup page with registration form
        feat(auth): implement login page with form validation and error handling
        refactor(app): migrate from Context API to Redux store
        feat(api): add auth, transaction, category, and analytics service layers
        feat(api): add Axios client with mock adapter and realistic seed data
        feat(store): set up Redux store with auth, transaction, category, budget, and ui slices
        feat(layout): implement responsive sidebar navigation with dark theme
        feat(common): add reusable Button, Modal, Loader, and Card components
        style(design-system): add CSS variables, reset, and global styles
        chore(deps): install redux toolkit, chart.js, and axios-mock-adapter
```

> **⚠️ Never commit broken code.** Every commit should leave the app in a buildable, runnable state. Run `npm run build` before each commit to verify.

---

## Verification Plan

### Per Phase (Browser Testing)

| Phase | What to Verify |
|-------|---------------|
| **1** | Sidebar renders, nav links work, dark theme applies, responsive on mobile |
| **2** | Redux DevTools shows state, mock API returns data |
| **3** | Login validates, redirects, logout clears state, session persists on refresh |
| **4** | Dashboard shows cards + charts with correct data |
| **5** | CRUD transactions, filters/search work, list updates instantly |
| **6** | Set budgets, progress bars update, alerts on overspend |
| **7** | All charts render, date range filter works, insights are accurate |
| **8** | Theme persists, CSV exports, mobile layout usable |

### End-to-End Flow
Login → Dashboard → Add transactions → View analytics → Set budgets → Export → Toggle theme → Logout

---

## Resume Impact

| Skill | Evidence |
|-------|----------|
| **React Architecture** | Component hierarchy, hooks, separation of concerns |
| **Redux Toolkit** | Slices, async thunks, normalized state, selectors |
| **API Integration** | Axios interceptors, service layer, mock adapter |
| **Data Visualization** | Chart.js with 4+ chart types, memoized rendering |
| **UI/UX Design** | Dark/light theme, responsive, animations |
| **Performance** | useMemo, debounced search, memoized charts |
| **Git Workflow** | Conventional commits, feature branches, semantic versioning |
| **Production Readiness** | Clean folder structure, error handling, data export |
