# Stage 1 — Production Trainer & Client Platform

Contract deliverable: production-grade SaaS UI for trainers and clients (not landing, not demo UX).

## Design system

- Palette: `#080808` / `#b8f53d`, Linear/Attio/Stripe density
- Stack: AppShell, saas-system, shadcn/ui, TanStack Table, Tremor/recharts, FullCalendar, dnd-kit
- Reusable primitives: `MetricCard`, `DashboardSection`, `DataTable`, `SaasPageHeader`, `EmptyState`

## Trainer workspace (`/trainer`)

| Route | Status | Notes |
|-------|--------|-------|
| Dashboard | **Production UI** | KPIs, today schedule, quick actions, active clients (payment/progress), activity feed, revenue + attendance mini charts |
| Clients CRM | **Production UI** | TanStack Table, filters, payment badges |
| Client detail | **Production UI** | Tabs: Overview, Measurements, Program, Payments, Notes, Attendance, Workouts, Files, Messages |
| Workout builder | **Production UI** | dnd-kit days, exercise library, sets/reps/rest |
| Calendar | **Production UI** | FullCalendar week/day, create dialog on select |
| Finance | **Production UI** | Stats, revenue chart, payments table, CSV export |
| Messages | **Production UI** | Split list/thread, templates, unread badges |
| Analytics | **Production UI** | Revenue, retention, attendance, weekday, subscription mix |
| Programs / Exercises | **Production UI** | Existing catalog flows |
| Settings / Profile | **Production UI** | Auth profile completion flow |
| AI Coach / Files | **Partial** | Functional UI; files list is mock metadata until WP upload API |

## Client workspace (`/client`)

| Route | Status | Notes |
|-------|--------|-------|
| Home | **Production UI** | Today workout, streak, next session, messages preview, weight chart, history, calendar mini |
| Workouts / Session | **Production UI** | Plan list + guided session with sets/rest |
| Progress | **Production UI** | Measurements, charts, save progress |
| Chat | **Production UI** | Thread with trainer |
| Profile / Nutrition / Achievements | **Production UI** | Existing mobile-first screens |

## Data layer (dev)

- `mock-api/store` v4: realistic named clients, relative dates, messages, calendar, payments, per-client files
- No demo banners or pre-filled login credentials in UI
- Auth mock accounts remain for local dev only (not shown in login copy)

## WordPress backend (still required)

- JWT/session auth, email verify, password reset (SMTP)
- REST: clients CRUD, programs, calendar, payments webhooks, messages, file upload, client cabinet
- Replace `mockApi` calls in `features/api/*-service.ts` when `config.useMockData` is false

## i18n

- New keys in `ru` + `en` for dashboard quick actions, client CRM tabs, auth subtitles
- Other locales: copy from en or run locale generator when wired in CI
