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
| `VITE_WP_API_URL` | `https://api.example.com/wp-json` | WordPress REST base |
| `VITE_USE_MOCK_DATA` | `false` | `true` = local mock store |
| `VITE_STRIPE_PUBLIC_KEY` | optional | Payment provider stub |

### Static hosting

Deploy `frontend/dist/` to Netlify, Vercel, or S3. Set SPA fallback to `index.html`.

**Vercel (пошагово на русском):** [VERCEL.md](./VERCEL.md)

## WordPress

1. Install WordPress 6.x+
2. Copy `wordpress/trenerka-core/` → `wp-content/plugins/trenerka-core/`
3. Copy `wordpress/theme-trenerka/` → `wp-content/themes/theme-trenerka/`
4. Activate plugin and theme
5. Install [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
6. Add to `wp-config.php`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);
```

7. Reactivate **Trenerka Core** to run DB migrations and seed 38 public exercises.

### CORS

Allow your frontend origin in WordPress / reverse proxy. JWT plugin handles `Authorization` header.

### Cron

Plugin registers hourly `trenerka_session_reminders` for 2h and 30m session emails.

### Theme embed (single domain)

```bash
cd frontend && npm run build
cp -r dist/* ../wordpress/theme-trenerka/dist/
```

## Smoke test

1. Register trainer via `/register/trainer`
2. Login trainer → create client → note temp password
3. Login client → view dashboard and workouts
4. Trainer: add payment with `sessionsAdded` → verify balance
5. Admin: `admin@trenerka.ru` / demo (mock) or WP admin user
