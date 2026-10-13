# Base44 Setup Notes

## Project Overview
"Alto dos Ipês – Gestão Financeira" — a financial management system for a real estate development (loteamento). Recreated from a Base44 app at https://ipes-finance.base44.app.

## Tech Stack
- **Frontend:** React 18 + Vite 6 + Tailwind CSS 3
- **Routing:** React Router DOM v6
- **Charts:** Recharts
- **Icons:** lucide-react
- **Data persistence:** localStorage (no backend)
- **Auth:** Simple localStorage-based mock auth

## Pages
- `/login`, `/register`, `/forgot-password` — auth pages
- `/` — Dashboard (KPIs + chart + lotes summary)
- `/receitas` — Revenue CRUD with filters
- `/despesas` — Expense CRUD with filters
- `/parcelas` — Installment/financing management
- `/clientes` — Client CRUD (card layout)
- `/lotes` — Lot management (table with area, value, R$/m²)
- `/fluxo-caixa` — Cash flow (KPIs + line chart + monthly table)
- `/relatorios` — Reports with filters and PDF/Excel export buttons
- `/calendario` — Financial calendar with events
- `/analise-ia` — AI analysis with metrics and Q&A

## How to Run
`docker compose -f docker-compose.base44.yml up -d` starts the Vite dev server on port 3000.

## Design
- Primary color: green (#2a9d69)
- White sidebar, light gray background
- Sans-serif typography

## Verification
- `curl http://localhost:3000/` returns the HTML with Vite client
- Login with any email/password to access the dashboard
- All pages render with correct layout, tables, and forms
- CRUD operations work (tested creating and displaying a receita)
