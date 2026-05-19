# WordPress Integration

## Setup

1. Install WordPress (local: Local WP, Docker, or MAMP)
2. Activate plugin `wordpress/trenerka-core/`
3. Activate theme `wordpress/theme-trenerka/`
4. Install JWT Authentication for WP REST API plugin
5. Configure `wp-config.php` with JWT secret

## React ↔ WordPress

| React env | Purpose |
|-----------|---------|
| `VITE_WP_API_URL` | WordPress REST base, e.g. `http://localhost:8080/wp-json` |
| `VITE_USE_MOCK_DATA` | `true` = mock data, `false` = live WP API |

## Deployment options

### A. Subdomain (recommended)

- `app.trenerka.ru` → static Vite `dist/` (Netlify, Vercel, S3)
- `api.trenerka.ru` or main domain → WordPress

### B. Theme embed

1. `cd frontend && npm run build`
2. Copy `frontend/dist/` to `wordpress/theme-trenerka/dist/`
3. WordPress serves SPA on main domain

## Auth flow

1. React POST `/jwt-auth/v1/token` with credentials
2. Store token in localStorage (`trenerka_token`)
3. Send `Authorization: Bearer <token>` on API requests

## CPT REST endpoints

- `/wp-json/wp/v2/trenerka_client`
- `/wp-json/wp/v2/trenerka_exercise`
- `/wp-json/wp/v2/trenerka_program`
- `/wp-json/wp/v2/trenerka_event`
- `/wp-json/wp/v2/trenerka_payment`
- `/wp-json/wp/v2/trenerka_message`
- `/wp-json/trenerka/v1/clients` (custom aggregate)
