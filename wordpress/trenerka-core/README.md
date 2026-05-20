# Trenerka Core Plugin

WordPress plugin for Trenerka fitness SaaS backend.

## Installation

1. Copy `trenerka-core` to `wp-content/plugins/`
2. Activate in WordPress admin
3. Install [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
4. Add to `wp-config.php`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
define('TRENERKA_FRONTEND_URL', 'http://localhost:5173'); // ссылки в письмах verify/reset
```

5. В **Настройки → Общие** или через опцию `trenerka_frontend_url` укажите URL SPA (если не задан `TRENERKA_FRONTEND_URL`).
6. Настройте SMTP для `wp_mail` (сброс пароля, подтверждение email).

## Custom Post Types

- `trenerka_client` — clients CRM
- `trenerka_exercise` — exercise catalog
- `trenerka_program` — workout programs
- `trenerka_event` — calendar events
- `trenerka_payment` — payments
- `trenerka_message` — chat messages

## REST API

- `GET/PATCH /wp-json/trenerka/v1/trainer/profile` — профиль тренера
- `GET /wp-json/trenerka/v1/clients` — CRM клиентов (JWT)
- `POST /wp-json/trenerka/v1/auth/register-trainer`, `verify-email`, `reset-password`
- Standard WP REST: `/wp-json/wp/v2/trenerka_exercise`, etc.

## Extension

Add endpoints in `includes/class-trenerka-rest.php` and meta fields in `class-trenerka-cpt.php`.
