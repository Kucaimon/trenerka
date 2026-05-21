# Trenerka Fit на Beget + WordPress

Пошаговая инструкция для production-развёртывания **Trenerka Fit** на [Beget](https://beget.com) с разделением фронтенда и WordPress API.

Связанные документы: [DEPLOYMENT.md](./DEPLOYMENT.md), [WORDPRESS.md](./WORDPRESS.md), [VERCEL.md](./VERCEL.md).

---

## 1. Схема доменов (production)

| Домен | Назначение | Что загружать |
|-------|------------|---------------|
| `trenerka-fit.ru` | Основной домен (лендинг / редирект) | **Рекомендуется:** 301-редирект на `https://app.trenerka-fit.ru` (панель Beget → «Перенаправления» или `.htaccess` в корне `trenerka-fit.ru/public_html/`) |
| `app.trenerka-fit.ru` | React SPA (Vite) | **Содержимое** `frontend/dist/` → `public_html/` |
| `wp.trenerka-fit.ru` | WordPress 6.x + API | CMS, MySQL, плагины |

**Рекомендуемая схема для MVP:**

- Пользователи открывают **`https://app.trenerka-fit.ru`**
- API и админка — **`http://wp.trenerka-fit.ru`**
- SSL: включить Let's Encrypt в панели Beget для каждого поддомена (авто-продление)

### Альтернатива: Vercel для фронта

Фронт можно оставить на Vercel, а на Beget — только WordPress. См. [VERCEL.md](./VERCEL.md). Переменные окружения те же (`VITE_WP_API_URL=http://wp.trenerka-fit.ru/wp-json`).

---

## 2. Точные пути на Beget (FTP / файловый менеджер)

Типичная структура (подставьте свой логин Beget):

```text
/home/ВАШ_ЛОГИН/app.trenerka-fit.ru/public_html/     ← фронтенд (SPA)
/home/ВАШ_ЛОГИН/wp.trenerka-fit.ru/public_html/      ← WordPress
/home/ВАШ_ЛОГИН/wp.trenerka-fit.ru/public_html/wp-content/plugins/
```

### 2.1. Фронтенд (`app.trenerka-fit.ru`)

1. Локально: `cd frontend && npm ci && npm run build`
2. Загрузите **все файлы из** `frontend/dist/` (не саму папку `dist`, а её содержимое) в:

```text
/home/ВАШ_ЛОГИН/app.trenerka-fit.ru/public_html/
```

Должны оказаться в корне: `index.html`, `assets/`, `.htaccess` (SPA fallback для Apache).

3. Проверка: `https://app.trenerka-fit.ru` открывает приложение; прямой заход на `https://app.trenerka-fit.ru/login/trainer` не даёт 404 (благодаря `.htaccess`).

### 2.2. Backend WordPress (`wp.trenerka-fit.ru`)

| Локально (репозиторий) | На Beget |
|------------------------|----------|
| `wordpress/trenerka-core/` (вся папка) | `public_html/wp-content/plugins/trenerka-core/` |

Не загружайте `.git`, `node_modules`.

1. **Плагины** → **Trenerka Core** → **Активировать**
2. Установить **JWT Authentication for WP REST API** (Enrique Chavez) → активировать
3. **Настройки** → **Постоянные ссылки** → **Название записи** → Сохранить

Тему `wordpress/theme-trenerka/` загружайте только если отдаёте SPA с того же домена, что WP. Для `app.` + `wp.` — **не обязательно**.

---

## 3. `wp-config.php` (JWT + URL фронта)

Файл: `wp.trenerka-fit.ru/public_html/wp-config.php`

Перед строкой `/* That's all, stop editing! */`:

```php
/** JWT для Trenerka REST API */
define('JWT_AUTH_SECRET_KEY', 'ВСТАВЬТЕ_СЛУЧАЙНУЮ_СТРОКУ_64_СИМВОЛА');
define('JWT_AUTH_CORS_ENABLE', true);

/** URL React-приложения (письма verify/reset, CORS origin) */
define('TRENERKA_FRONTEND_URL', 'https://app.trenerka-fit.ru');
```

Секрет JWT:

```bash
openssl rand -base64 48
```

### 3.1. `.htaccess` WordPress — передача `Authorization`

В `wp.trenerka-fit.ru/public_html/.htaccess` (после блока WordPress):

```apache
# JWT: передать Authorization в PHP (Beget / Apache)
<IfModule mod_rewrite.c>
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.+)
RewriteRule .* - [E=HTTP_AUTHORIZATION:%1]
</IfModule>
```

---

## 4. Аутентификация (как устроено во фронте)

Фронтенд **не** использует mock JWT в production (`VITE_USE_MOCK_DATA=false`).

| Шаг | Endpoint | Назначение |
|-----|----------|------------|
| 1 | `POST /wp-json/jwt-auth/v1/token` | Логин: `username` (email), `password` → `{ token }` |
| 2 | `GET /wp-json/trenerka/v1/auth/me` | Текущий пользователь (роль trainer/client/admin) |
| 3 | `POST /wp-json/trenerka/v1/auth/register-trainer` | Регистрация тренера |
| 4 | `POST /wp-json/trenerka/v1/auth/verify-email` | Подтверждение email |
| 5 | `POST /wp-json/trenerka/v1/auth/reset-password` | Запрос сброса |
| 6 | `POST /wp-json/trenerka/v1/auth/reset-password/confirm` | Новый пароль по токену |
| 7 | `GET/PATCH /wp-json/trenerka/v1/trainer/profile` | Профиль тренера |

Код: `frontend/src/lib/wordpress/endpoints.ts`, `frontend/src/features/api/auth-service.ts`.

Все запросы к Trenerka API идут с заголовком `Authorization: Bearer <token>` (`wpFetch` в `client.ts`).

### Проверка JWT (curl)

```bash
curl -sS -X POST "http://wp.trenerka-fit.ru/wp-json/jwt-auth/v1/token" \
  -H "Content-Type: application/json" \
  -d '{"username":"EMAIL","password":"PASSWORD"}'
```

```bash
curl -sS "http://wp.trenerka-fit.ru/wp-json/trenerka/v1/auth/me" \
  -H "Authorization: Bearer ВАШ_ТОКЕН"
```

---

## 5. CORS: `app.trenerka-fit.ru` → `wp.trenerka-fit.ru`

| Механизм | Действие |
|----------|----------|
| `JWT_AUTH_CORS_ENABLE` = `true` | CORS для JWT и preflight |
| `TRENERKA_FRONTEND_URL` | `https://app.trenerka-fit.ru` — ссылки в письмах |
| Файрвол WP | Не блокировать `OPTIONS` и `/wp-json/*` |

В DevTools при логине не должно быть ошибки CORS на `/wp-json/jwt-auth/v1/token`.

---

## 6. Переменные окружения фронтенда

Файл `frontend/.env.production` (уже в репозитории для Beget):

| Переменная | Значение |
|------------|----------|
| `VITE_USE_MOCK_DATA` | `false` |
| `VITE_WP_API_URL` | `http://wp.trenerka-fit.ru/wp-json` |
| `VITE_SKILLS_URL` | `https://fitnesakademiya.ru` |

Сборка: `cd frontend && npm run build` — значения вшиваются в бандл на этапе build.

Для Vercel — те же переменные в Dashboard → Environment Variables, Root Directory: `frontend`.

---

## 7. PHP: загрузка файлов до 10 МБ

Trenerka ограничивает вложения **10 МБ** на уровне API (`frontend/src/lib/wordpress/upload.ts`).

На Beget для домена **`wp.trenerka-fit.ru`**:

| Параметр | Рекомендация |
|----------|----------------|
| `upload_max_filesize` | `12M` или `16M` |
| `post_max_size` | `16M` или `20M` |
| `max_execution_time` | `120` |

**Сайты** → `wp.trenerka-fit.ru` → **PHP** → дополнительные директивы.

---

## 8. Панель Beget: чеклист

| № | Шаг | Готово |
|---|-----|--------|
| 1 | Созданы сайты `app.trenerka-fit.ru`, `wp.trenerka-fit.ru`, DNS на Beget | ☐ |
| 2 | SSL Let's Encrypt для обоих поддоменов | ☐ |
| 3 | WordPress на `wp.`, вход `/wp-admin/` | ☐ |
| 4 | PHP 8.1+, `trenerka-core` в `plugins/`, активирован | ☐ |
| 5 | JWT плагин установлен и активирован | ☐ |
| 6 | `wp-config.php`: `JWT_AUTH_*`, `TRENERKA_FRONTEND_URL=https://app.trenerka-fit.ru` | ☐ |
| 7 | `.htaccess` WP: передача `Authorization` | ☐ |
| 8 | Постоянные ссылки: «Название записи» | ☐ |
| 9 | `curl http://wp.trenerka-fit.ru/wp-json/` → JSON | ☐ |
| 10 | JWT `/jwt-auth/v1/token` → поле `token` | ☐ |
| 11 | Локально `npm run build`, загрузка `dist/` в `app.../public_html/` | ☐ |
| 12 | `https://app.trenerka-fit.ru` — логин тренера, CRM, чат, файл &lt; 10 МБ | ☐ |
| 13 | (Опц.) Cron Beget для `wp-cron.php`, SMTP для писем | ☐ |

---

## 9. Дымовой тест после деплоя

1. `https://app.trenerka-fit.ru` → **Регистрация тренера** → verify email.
2. **Вход тренера** → дашборд (данные с API, не mock).
3. **CRM** → новый клиент → временный пароль.
4. **Вход клиента** — `/login/client` с email и **временным паролем** из CRM (тренер добавляет клиента в CRM).
5. **Сообщения** → текст + файл &lt; 10 МБ.

Если ошибки: `VITE_WP_API_URL`, CORS, секрет JWT, повторная активация Trenerka Core.

Полный сценарий: [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 10. Типичные проблемы

### 404 на `/wp-json` или маршрутах Trenerka

- Снова сохраните постоянные ссылки.
- Проверьте `.htaccess` в корне WP.

### 404 на маршрутах SPA (`/login/trainer`)

- Убедитесь, что `.htaccess` из `frontend/public/` попал в `app.../public_html/`.
- `mod_rewrite` на Beget для Apache обычно включён.

### 401 с валидным токеном

- Блок `Authorization` в `.htaccess` WP.
- Совпадение `JWT_AUTH_SECRET_KEY` (не менять после выдачи токенов).

### Письма в спам / не приходят

Trenerka отправляет: подтверждение email тренера, welcome клиенту, сброс пароля, напоминания календаря. Всё через `wp_mail` → **нужен SMTP**.

| Шаг | Действие |
|-----|----------|
| 1 | Плагин **WP Mail SMTP** на `wp.trenerka-fit.ru` |
| 2 | SMTP Beget: хост `smtp.beget.com`, порт **465** (SSL), логин = полный email ящика, пароль ящика |
| 3 | Отправитель: `noreply@trenerka-fit.ru` (или ваш ящик на домене) |
| 4 | Тест из плагина + регистрация тренера на `app.` |
| 5 | SPF/DKIM для домена в панели Beget (снижает спам) |

См. также [HANDOFF.md](./HANDOFF.md).

### Cron напоминаний (обязательно на production)

Trenerka отправляет email-напоминания о тренировках через WP Cron (`trenerka_send_reminders` в `trenerka-core`). На shared-хостинге Beget встроенный `wp-cron` при низком трафике **не срабатывает надёжно**.

**Рекомендуемая настройка:**

1. В `wp-config.php` добавьте (перед `/* That's all */`):

```php
define('DISABLE_WP_CRON', true);
```

2. В панели Beget → **Cron** → задача каждые **5–15 минут**:

```bash
curl -sS "https://wp.trenerka-fit.ru/wp-cron.php?doing_wp_cron" > /dev/null
```

(используйте HTTPS, если SSL включён)

3. Проверка: после создания события в календаре тренера с напоминанием — письмо должно уйти в окне cron (см. также карточку «Напоминания» в `/trainer/notifications`).

Без cron напоминания и фоновые задачи WP **не работают** — это не баг фронтенда.
