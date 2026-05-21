# Trenerka Fit — передача на production (Beget)

Краткий чеклист для Самата / DevOps. Подробности: [BEGET.md](./BEGET.md), [DEPLOYMENT.md](./DEPLOYMENT.md).

## Три URL входа (этап 1)

| Роль | URL |
|------|-----|
| Хаб выбора роли | `https://app.trenerka-fit.ru/login` |
| Тренер Smart Fitness | `https://app.trenerka-fit.ru/login/trainer` |
| Клиент | `https://app.trenerka-fit.ru/login/client` |
| Админ платформы | `https://app.trenerka-fit.ru/login/admin` |

Корневой домен `https://trenerka-fit.ru` — редирект на `https://app.trenerka-fit.ru` (см. BEGET §1).

## Деплой (порядок)

1. **WordPress** `wp.trenerka-fit.ru`: загрузить `wordpress/trenerka-core/` → `wp-content/plugins/trenerka-core/`, активировать + JWT plugin.
2. **wp-config.php**: `JWT_AUTH_SECRET_KEY`, `JWT_AUTH_CORS_ENABLE`, `TRENERKA_FRONTEND_URL=https://app.trenerka-fit.ru`.
3. **`.htaccess` WP**: передача заголовка `Authorization`.
4. **Постоянные ссылки**: «Название записи» → Сохранить.
5. **Фронт**: `cd frontend && npm ci && npm run build` → содержимое `dist/` в `app.trenerka-fit.ru/public_html/`.
6. **SSL** на `app.` и `wp.`.
7. **Cron**: `DISABLE_WP_CRON` + curl `wp-cron.php` каждые 5–15 мин (напоминания календаря).
8. **Дымовой API**: `node scripts/smoke-api.mjs` (из корня репозитория, см. ниже).

## SMTP (обязательно для писем)

Без SMTP письма verify / welcome / сброс пароля / напоминания **не дойдут**.

1. Установить **WP Mail SMTP** (или аналог) на `wp.trenerka-fit.ru`.
2. Прописать SMTP Beget (логин ящика, пароль, `smtp.beget.com`, порт 465 SSL).
3. Тестовое письмо из настроек плагина.
4. Проверить: регистрация тренера → письмо verify; CRM → новый клиент → welcome с временным паролем.

Подробнее: [BEGET.md §10](./BEGET.md) и раздел «Письма в спам».

## Тестовые аккаунты

После сида / ручного создания на WP:

| Роль | Как получить |
|------|----------------|
| Тренер | `/login/trainer` — регистрация + verify email |
| Клиент | Тренер: CRM → новый клиент → временный пароль → `/login/client` |
| Админ | Пользователь WP с ролью `trenerka_admin` |

В mock-режиме (`VITE_USE_MOCK_DATA=true`) — см. `frontend/.env.demo`.

## Артефакты сборки

| Файл | Назначение |
|------|------------|
| `frontend/dist/` | SPA на Beget |
| `trenerka-core.zip` | Плагин WP (пересобрать после изменений в `wordpress/trenerka-core/`) |
| `production-build.zip` | Полный production-бандл (если обновлялся) |

Пересборка плагина из корня репозитория:

```bash
cd wordpress/trenerka-core && zip -r ../../trenerka-core.zip . -x '*.git*'
```

## Что остаётся этапом 2

Маркетплейс, полноценный LMS, AI Coach, Telegram, wearables, нативный PWA install — не входят в текущий handoff.
