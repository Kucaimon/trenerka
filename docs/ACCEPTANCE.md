# Acceptance checklist (MVP)

## Auth
- [x] Trainer register/login/logout
- [x] Client login with trainer-created credentials
- [x] Admin access to `/admin`
- [x] Role-based route guards
- [x] JWT persistence (`trenerka_token`)

## Trainer CRM
- [x] List/search/filter clients
- [x] Client detail: contacts, payments, notes
- [x] Create/update/archive client
- [x] Export clients CSV (Excel: CSV UTF-8, см. `exportClientsSpreadsheet`)

## Exercises & programs
- [x] 30+ public exercises in catalog
- [x] Trainer custom exercises CRUD
- [x] Program builder save/load
- [x] Assign program to client

## Calendar
- [x] Events from API on FullCalendar
- [x] Drag-drop persists
- [x] Mark completed / copy recurring (API)

## Finance
- [x] Payments CRUD
- [x] Package balance auto-update
- [x] Revenue report endpoint
- [x] Export payments CSV
- [x] Payment provider config stub

## Chat & notifications
- [x] Trainer-client messages
- [ ] Read/unread (API есть, UI частично)
- [x] Templates in UI
- [x] File upload ≤10 MB
- [ ] Notifications list (страница есть, полная интеграция — partial)
- [ ] Reminder cron (WP)

## Client app
- [x] Dashboard from `/client/dashboard`
- [x] Weekly workouts
- [x] Progress measurements
- [x] Chat with trainer
- [x] Payment history

## Analytics & admin
- [x] Trainer metrics from API
- [x] Charts (revenue/retention/attendance)
- [ ] Progress PDF/text export (stub PDF на клиенте)
- [x] Admin stats, users, news CRUD

## Quality
- [x] `npm run build` passes
- [x] `npm run lint` passes
- [x] `npm test` (Vitest smoke)
- [x] `npm run test:e2e` (Playwright mock)
- [ ] No cross-trainer/client data leaks (manual)
