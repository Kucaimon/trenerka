# Deployment

## Frontend (Vite)

```bash
cd frontend
cp .env.example .env
npm install
npm run build
```

### Environment

| Variable | Example | Notes |
|----------|---------|-------|
| `VITE_WP_API_URL` | `https://api.example.com/wp-json` | WordPress REST base (required when mock is off) |
| `VITE_USE_MOCK_DATA` | `false` | **`true` only** when set explicitly — demo/localStorage mode |
| `VITE_STRIPE_PUBLIC_KEY` | optional | Payment provider stub |
| `VITE_SKILLS_URL` | `https://fitnesakademiya.ru` | Skills/courses link |

Env templates:

| File | Use |
|------|-----|
| `.env.staging` | Vercel **demo** (`VITE_USE_MOCK_DATA=true`) |
| `.env.staging.wp.example` | **WordPress staging** on Vercel or local |
| `.env.production` | Production WP backend |
| `.env.local` | Local dev against WP (`VITE_USE_MOCK_DATA=false`) |

### Static hosting

Deploy `frontend/dist/` to Netlify, Vercel, or S3. Set SPA fallback to `index.html`.

**Vercel:** [VERCEL.md](./VERCEL.md) — two targets: demo (mock) vs WordPress staging.

---

## WordPress staging setup (Stage 1 MVP)

Use a **clean WordPress** install on a subdomain or subdirectory (e.g. `https://staging-api.example.com` or `https://example.com/wp`).

### Checklist

1. **WordPress 6.x+** on staging host (HTTPS recommended).
2. Copy `wordpress/trenerka-core/` → `wp-content/plugins/trenerka-core/` and **activate**.
3. Copy `wordpress/theme-trenerka/` → `wp-content/themes/theme-trenerka/` (optional if SPA is on Vercel).
4. Install [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/).
5. Add to `wp-config.php` (above `/* That's all, stop editing! */`):

```php
define('JWT_AUTH_SECRET_KEY', 'long-random-secret-min-32-chars');
define('JWT_AUTH_CORS_ENABLE', true);
define('TRENERKA_FRONTEND_URL', 'https://your-app.vercel.app');
```

`TRENERKA_FRONTEND_URL` — URL of the React app (verify-email and reset-password links in emails). Alternative: WordPress option `trenerka_frontend_url` in **Settings → General** if the constant is not set.

6. **CORS** — allow the Vercel staging origin:
   - JWT plugin with `JWT_AUTH_CORS_ENABLE` handles `Authorization` for browser requests.
   - Ensure staging WP does not block `OPTIONS` from your frontend origin (reverse proxy / security plugin).
   - Frontend must call `VITE_WP_API_URL` pointing at this host’s `/wp-json`.
7. **Reactivate Trenerka Core** once after deploy so `dbDelta` migrations run.
8. **Trenerka_Seeder** (optional): on first activation seeds ~38 public exercises if the table is empty. For extra staging data, create a trainer via `/register/trainer`, then clients via CRM.
9. Configure **SMTP** (`wp_mail`) for verify-email and password reset (or read tokens from DB/user meta on staging only).

### Staging ↔ Vercel

| Vercel env (Production or Preview) | Value |
|-----------------------------------|--------|
| `VITE_USE_MOCK_DATA` | `false` |
| `VITE_WP_API_URL` | `https://STAGING-DOMAIN/wp-json` |
| `VITE_SKILLS_URL` | `https://fitnesakademiya.ru` |

Build command: `npm run build` (not `build:staging`). See [VERCEL.md](./VERCEL.md).

---

## WordPress (production)

1. Install WordPress 6.x+
2. Copy `wordpress/trenerka-core/` → `wp-content/plugins/trenerka-core/`
3. Copy `wordpress/theme-trenerka/` → `wp-content/themes/theme-trenerka/`
4. Activate plugin and theme
5. Install JWT plugin
6. `wp-config.php` constants (same as staging checklist)
7. Reactivate **Trenerka Core** for DB migrations

### CORS

Allow your frontend origin. JWT plugin handles `Authorization` header.

### Cron

Plugin registers hourly `trenerka_session_reminders` for 2h and 30m session emails.

### Theme embed (single domain)

```bash
cd frontend && npm run build
cp -r dist/* ../wordpress/theme-trenerka/dist/
```

---

## Staging smoke test (WordPress + Vercel)

Prerequisites: WP staging live, plugin active, JWT configured, Vercel deployed with `VITE_USE_MOCK_DATA=false` and correct `VITE_WP_API_URL`.

1. **Trainer register** — `/register/trainer` → submit → confirm email (link from mail or WP user meta `trenerka_verify_token` on staging).
2. **Trainer login** — `/login/trainer` → JWT → dashboard loads (may be empty).
3. **Profile** — `/trainer/profile` → save name/specialization (PATCH `/trenerka/v1/trainer/profile`).
4. **CRM** — create client → note **temporary password** in toast → client row appears.
5. **Client login** — `/login/client` with client email + temp password → `/client` dashboard.
6. **Calendar** — trainer creates event linked to client.
7. **Finance** — add payment with `sessionsAdded` → client package balance updates.
8. **Messages** — send message trainer ↔ client.
9. **Client progress** — client adds measurement (+ photo upload if configured).
10. **Logout / ProtectedRoute** — refresh page stays logged in; wrong role redirects to login.

Failures usually mean: wrong `VITE_WP_API_URL`, CORS, JWT secret, or plugin not reactivated (missing tables).

---

## Local smoke (mock, no WP)

1. `cp .env.staging .env` → `npm run dev`
2. Login `trainer@trenerka.ru` / `demo123`
3. CRM → create client → temp password in toast
