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
```

## Custom Post Types

- `trenerka_client` — clients CRM
- `trenerka_exercise` — exercise catalog
- `trenerka_program` — workout programs
- `trenerka_event` — calendar events
- `trenerka_payment` — payments
- `trenerka_message` — chat messages

## REST API

- `GET /wp-json/trenerka/v1/clients` — list clients (requires auth)
- Standard WP REST: `/wp-json/wp/v2/trenerka_exercise`, etc.

## Extension

Add endpoints in `includes/class-trenerka-rest.php` and meta fields in `class-trenerka-cpt.php`.
