# Trenerka Architecture

## Overview

```
trenerka/
├── frontend/          # Vite + React 18 (100% product UI)
├── wordpress/         # Backend: CPTs, REST, users, admin
└── docs/
```

WordPress handles data, auth, and admin CMS. React handles all user-facing UI.

For the premium product direction, UX architecture, screen concepts, component system, and implementation prompt, see [`PREMIUM_PRODUCT_CONCEPT.md`](./PREMIUM_PRODUCT_CONCEPT.md).

## Frontend layers

| Layer | Path | Role |
|-------|------|------|
| App | `src/app/` | Routes, providers |
| Features | `src/features/` | Domain modules (landing, auth, trainer, client, admin) |
| Components | `src/components/` | UI kit (shadcn), layouts |
| Lib | `src/lib/` | WP client, config, mock data |
| Store | `src/store/` | Zustand (auth, UI) |
| API services | `src/features/api/` | Domain API with mock/WP switch |

## Data flow

```
UI Component → TanStack Query → feature/api service
  → if VITE_USE_MOCK_DATA: mock-data
  → else: lib/wordpress/client → WP REST API
```

## Auth

- Zustand `auth-store` persisted to localStorage
- JWT token via `setAuthToken()` in WP client
- `ProtectedRoute` guards `/trainer/*`, `/client/*`, `/admin/*`

## Key libraries

- **Routing**: React Router v6
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **UI**: shadcn/ui + Tailwind v4 + Framer Motion
- **Charts**: Recharts
- **Calendar**: FullCalendar
- **DnD**: @dnd-kit

## Feature modules

| Route prefix | Module |
|--------------|--------|
| `/` | Landing |
| `/login/*`, `/register/*` | Auth |
| `/trainer/*` | Trainer dashboard |
| `/client/*` | Client mobile app |
| `/admin/*` | Platform admin |
