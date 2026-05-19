# Trenerka REST API

Base URL: `{WP_SITE}/wp-json/trenerka/v1`

Auth: `Authorization: Bearer <jwt>` (JWT Authentication for WP REST API plugin).

## Auth

| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/me` | Current user + role |
| POST | `/auth/register-trainer` | Register trainer |
| POST | `/auth/reset-password` | Send reset email |

JWT login: `POST /wp-json/jwt-auth/v1/token` with `{ username, password }`.

## Clients (trainer)

| Method | Path |
|--------|------|
| GET/POST | `/clients` |
| GET/PUT/DELETE | `/clients/{id}` |
| GET | `/clients/{id}/progress` |

Create client returns `temporary_password` for first login.

Client export: `exportClientsSpreadsheet()` — CSV UTF-8 (открывается в Excel; отдельный XLSX-пакет не подключён).

## Exercises

| Method | Path |
|--------|------|
| GET/POST | `/exercises` |
| PUT/DELETE | `/exercises/{id}` |

Public catalog + trainer-owned exercises.

## Programs

| Method | Path |
|--------|------|
| GET/POST | `/programs` |
| GET/PUT/DELETE | `/programs/{id}` |
| GET/POST | `/client-programs` |

GET `?clientId=` — активная программа клиента (trainer).

Body for save includes `workouts[]` with nested `exercises[]`.

## Calendar

| Method | Path |
|--------|------|
| GET/POST | `/events` |
| PUT/DELETE | `/events/{id}` |

## Payments

| Method | Path |
|--------|------|
| GET/POST | `/payments` |
| PUT/DELETE | `/payments/{id}` |
| GET | `/payments/reports?from=&to=` |

`POST` may include `sessionsAdded` to increment client `packageBalance`.

## Messages

| Method | Path |
|--------|------|
| GET | `/messages?clientId=` |
| POST | `/messages` |
| POST | `/messages/{id}/read` |

## Notifications

| Method | Path |
|--------|------|
| GET | `/notifications` |
| POST | `/notifications/{id}/read` |

## Client cabinet

| Method | Path |
|--------|------|
| GET | `/client/dashboard` |
| GET | `/client/workouts` |
| GET/POST | `/client/progress` |
| POST | `/client/workouts/{id}/complete` |

## Analytics

| Method | Path |
|--------|------|
| GET | `/analytics/trainer` |
| GET | `/analytics/client/{id}/pdf` |

## Admin

| Method | Path |
|--------|------|
| GET | `/admin/stats` |
| GET | `/admin/users` |
| PATCH | `/admin/users/{id}` |
| GET/POST | `/news` |
| PUT/DELETE | `/news/{id}` |

## Upload

| Method | Path |
|--------|------|
| POST | `/upload` | multipart `file`, max 10 MB |

## Roles

- `trainer` — CRM, programs, finance, calendar
- `client` — own dashboard, workouts, progress, chat
- `admin` — platform stats, users, news, public exercises
