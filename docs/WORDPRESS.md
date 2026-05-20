# WordPress Integration

## Setup

1. Install WordPress (local: Local WP, Docker, or MAMP; staging: subdomain/subdirectory)
2. Activate plugin `wordpress/trenerka-core/`
3. Activate theme `wordpress/theme-trenerka/` (optional if SPA is hosted separately)
4. Install [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
5. Configure `wp-config.php`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
define('TRENERKA_FRONTEND_URL', 'https://your-vercel-app.vercel.app');
```

6. Set frontend URL for email links: `TRENERKA_FRONTEND_URL` or option `trenerka_frontend_url`
7. **Reactivate** Trenerka Core after copying plugin files (runs `dbDelta`)
8. Optional: `Trenerka_Seeder::maybe_seed_exercises()` runs on activation (public exercise catalog)
9. Configure SMTP for `wp_mail` (verify / reset)

Full staging checklist: [DEPLOYMENT.md](./DEPLOYMENT.md#wordpress-staging-setup-stage-1-mvp).

## React ↔ WordPress

| React env | Purpose |
|-----------|---------|
| `VITE_WP_API_URL` | WordPress REST base, e.g. `https://staging.example.com/wp-json` |
| `VITE_USE_MOCK_DATA` | Must be **`true` explicitly** for mock; anything else uses live API (no fallback to mock on errors) |

Copy `frontend/.env.staging.wp.example` → `.env` for WP-backed staging builds.

## Deployment options

### A. Subdomain (recommended)

- `app.trenerka.ru` → static Vite `dist/` (Vercel)
- `api.trenerka.ru` or `staging.example.com` → WordPress

### B. Theme embed

1. `cd frontend && npm run build`
2. Copy `frontend/dist/` to `wordpress/theme-trenerka/dist/`
3. WordPress serves SPA on main domain

## Auth flow

1. React POST `/jwt-auth/v1/token` with credentials
2. Store token in localStorage (`trenerka_token`)
3. Send `Authorization: Bearer <token>` on API requests
4. Trainer self-register: `POST /trenerka/v1/auth/register-trainer` → verify email
5. Clients: trainer `POST /trenerka/v1/clients` only (no client self-register in production)

## REST API (trenerka/v1)

- `GET/PATCH /trenerka/v1/trainer/profile`
- `GET/POST/PUT/DELETE /trenerka/v1/clients`
- `GET/POST /trenerka/v1/client/dashboard`, `/client/workouts`, `/client/progress`
- Payments, messages, events, programs, exercises, analytics — see `class-trenerka-rest.php`

Legacy CPT routes (optional): `/wp-json/wp/v2/trenerka_*`
