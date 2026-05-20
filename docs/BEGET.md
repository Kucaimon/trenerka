# Trenerka на Beget: WordPress backend

Пошаговая инструкция для размещения **backend Trenerka** (WordPress + плагин `trenerka-core`) на хостинге [Beget](https://beget.com). Интерфейс React остаётся на **Vercel** (рекомендуется) или, при желании, как статика на поддомене Beget.

Связанные документы: [DEPLOYMENT.md](./DEPLOYMENT.md), [WORDPRESS.md](./WORDPRESS.md), [VERCEL.md](./VERCEL.md).

---

## 1. Что размещать на Beget, а что — на Vercel

| Компонент | Где | Зачем |
|-----------|-----|--------|
| WordPress 6.x | Beget | CMS, база MySQL, REST API |
| Плагин `trenerka-core` | Beget `wp-content/plugins/` | API `/wp-json/trenerka/v1/*` |
| Плагин JWT | Beget | Вход тренера/клиента из браузера |
| React SPA (Vite) | **Vercel** | UI, быстрые превью, HTTPS из коробки |
| Тема `theme-trenerka` | Beget (опционально) | Нужна только если хотите отдавать SPA с того же домена, что и WP |

**Рекомендуемая схема:**

- `https://ваш-проект.vercel.app` — фронтенд (пользователи заходят сюда)
- `https://api.ваш-домен.ru` или `https://staging.ваш-домен.ru` — WordPress на Beget (только API и админка)

Тему `wordpress/theme-trenerka/` можно **не** загружать, если фронт полностью на Vercel.

---

## 2. Панель Beget: сайт, WordPress, PHP, SSL

### 2.1. Создать сайт или поддомен

1. Войдите в [панель Beget](https://cp.beget.com).
2. **Сайты** → добавьте домен или поддомен, например:
   - `api.trenerka.ru` — production/staging API
   - `staging.trenerka.ru` — тестовый backend
3. Дождитесь привязки DNS (A-запись на Beget или делегирование NS).

### 2.2. Установить WordPress

1. **Сайты** → выберите домен → **Установить CMS** → **WordPress**.
2. Задайте логин/пароль администратора и email — сохраните в менеджере паролей.
3. Beget создаст MySQL-базу автоматически (имя БД, пользователь и пароль — в карточке сайта).

### 2.3. Версия PHP

1. **Сайты** → ваш домен → **PHP** (или **Настройки PHP**).
2. Выберите **PHP 8.1** или новее (8.2/8.3 — тоже подходят).
3. Сохраните. Перезагрузка обычно не требуется.

### 2.4. SSL (Let's Encrypt)

1. **Сайты** → домен → **SSL** / **Let's Encrypt**.
2. Включите бесплатный сертификат для домена (и `www`, если нужно).
3. Включите принудительный HTTPS (редирект HTTP → HTTPS), если есть такая опция.

После этого админка: `https://ваш-домен/wp-admin/`.

---

## 3. Загрузить плагин Trenerka (FTP/SFTP)

### 3.1. Данные FTP из панели

1. **FTP** → логин, пароль, хост (часто `ваш-логин.beget.tech` или IP).
2. Подключитесь через **FileZilla**, **Cyberduck** или встроенный **Файловый менеджер** Beget.

### 3.2. Пути на сервере

Типичная структура Beget:

```text
/home/ВАШ_ЛОГИН/ваш-домен.ru/public_html/     ← корень сайта
/home/ВАШ_ЛОГИН/ваш-домен.ru/public_html/wp-content/plugins/
/home/ВАШ_ЛОГИН/ваш-домен.ru/public_html/wp-content/themes/
```

Для поддомена папка может называться `api.ваш-домен.ru/public_html/` — смотрите в файловом менеджере, куда установился WordPress.

### 3.3. Что загрузить из репозитория Trenerka

С локального компьютера (папка проекта `trenerka`):

| Локально | На Beget |
|----------|----------|
| `wordpress/trenerka-core/` (вся папка) | `public_html/wp-content/plugins/trenerka-core/` |
| `wordpress/theme-trenerka/` (опционально) | `public_html/wp-content/themes/theme-trenerka/` |

Не загружайте `.git`, `node_modules` и лишние файлы — только содержимое папок плагина/темы.

### 3.4. Активация в WordPress

1. Откройте `https://ваш-домен/wp-admin/`.
2. **Плагины** → найдите **Trenerka Core** → **Активировать**.
3. Если обновляли файлы плагина повторно: **деактивировать** → **активировать** снова (запустятся миграции БД `dbDelta`).
4. Тему **Theme Trenerka** активируйте только если отдаёте SPA с Beget; для Vercel — не обязательно.

---

## 4. Плагин JWT и настройка `wp-config.php`

### 4.1. Установить JWT

1. **Плагины** → **Добавить новый** → поиск: `JWT Authentication for WP REST API`.
2. Установить и **активировать** (автор: Enrique Chavez).

### 4.2. Константы в `wp-config.php`

Файл обычно здесь:

```text
public_html/wp-config.php
```

или

```text
public_html/ваш-домен.ru/wp-config.php
```

Откройте через **Файловый менеджер** Beget или FTP. Найдите строку:

```php
/* That's all, stop editing! Happy publishing. */
```

**Перед этой строкой** вставьте (подставьте свои значения):

```php
/** JWT для Trenerka REST API */
define('JWT_AUTH_SECRET_KEY', 'ВСТАВЬТЕ_СЛУЧАЙНУЮ_СТРОКУ_64_СИМВОЛА');
define('JWT_AUTH_CORS_ENABLE', true);

/** URL React-приложения на Vercel (ссылки в письмах verify/reset) */
define('TRENERKA_FRONTEND_URL', 'https://ваш-проект.vercel.app');
```

**Секрет JWT:** сгенерируйте длинную случайную строку (минимум 32 символа, лучше 64). Пример в терминале macOS/Linux:

```bash
openssl rand -base64 48
```

Скопируйте результат в `JWT_AUTH_SECRET_KEY` **без пробелов и кавычек внутри значения**.

`TRENERKA_FRONTEND_URL` — точный URL Vercel **без** слэша в конце (например `https://trenerka-mu.vercel.app`).

Альтернатива: в WP **Настройки → Общие** можно задать опцию `trenerka_frontend_url`, если константу не используете.

### 4.3. Передача заголовка Authorization (важно для JWT)

Плагин JWT часто требует правило в `.htaccess` в **корне WordPress** (`public_html/.htaccess`). В конец файла (после блока WordPress) добавьте:

```apache
# JWT: передать Authorization в PHP (Beget / Apache)
<IfModule mod_rewrite.c>
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.+)
RewriteRule .* - [E=HTTP_AUTHORIZATION:%1]
</IfModule>
```

Сохраните. Если после этого REST отвечает 401 на все запросы с токеном — проверьте, что блок не продублирован и `mod_rewrite` включён (на Beget для Apache обычно включён по умолчанию).

---

## 5. CORS: Vercel → Beget

Браузер открывает фронт на `https://*.vercel.app`, а API — на `https://api.ваш-домен.ru`. Это разные origin, нужен CORS.

| Механизм | Что делает |
|----------|------------|
| `JWT_AUTH_CORS_ENABLE` = `true` | Плагин JWT добавляет заголовки для preflight и `Authorization` |
| `TRENERKA_FRONTEND_URL` | Ссылки в email, не CORS |
| Плагины безопасности на WP | Могут блокировать `OPTIONS` — отключите для staging или добавьте origin Vercel в whitelist |

**Проверка:** в DevTools → Network при логине не должно быть ошибки «CORS policy» на запрос к `/wp-json/jwt-auth/v1/token`.

Если используете плагин файрвола (Wordfence и т.п.) — добавьте в исключения REST: `/wp-json/*`.

Дополнительный `.htaccess` для CORS на Beget **обычно не нужен**, если JWT CORS включён. При жёсткой блокировке на уровне сервера (редко) обратитесь в поддержку Beget с текстом: «нужны preflight OPTIONS для `https://ваш-проект.vercel.app` к `/wp-json/`».

---

## 6. Постоянные ссылки (Permalinks)

1. **Настройки** → **Постоянные ссылки**.
2. Выберите **Название записи** (Post name).
3. **Сохранить** — WordPress обновит `.htaccess` и маршруты REST.

Без этого `/wp-json/...` может отдавать 404.

---

## 7. Проверка REST API (curl)

Подставьте свой домен в `DOMAIN`.

### 7.1. WordPress REST жив

```bash
curl -sS "https://DOMAIN/wp-json/" | head -c 400
```

Ожидается JSON с `"name":"..."` сайта.

### 7.2. Маршруты Trenerka

```bash
curl -sS "https://DOMAIN/wp-json/trenerka/v1/exercises" -H "Authorization: Bearer НЕВАЛИДНЫЙ"
```

Без токена или с невалидным — ответ об ошибке авторизации (не HTML 404). Список упражнений после входа требует JWT.

Публичная проверка маршрута (без логина):

```bash
curl -sS -X POST "https://DOMAIN/wp-json/trenerka/v1/auth/register-trainer" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!","name":"Test"}'
```

На staging может вернуть ошибку «email занят» — это нормально, главное **JSON**, не 404.

### 7.3. JWT токен

Создайте в WP пользователя-тренера (роль с доступом к Trenerka) или зарегистрируйтесь через API, затем:

```bash
curl -sS -X POST "https://DOMAIN/wp-json/jwt-auth/v1/token" \
  -H "Content-Type: application/json" \
  -d '{"username":"ВАШ_EMAIL","password":"ВАШ_ПАРОЛЬ"}'
```

Успех: JSON с полем `"token"`. Скопируйте токен:

```bash
curl -sS "https://DOMAIN/wp-json/trenerka/v1/trainer/profile" \
  -H "Authorization: Bearer ВАШ_ТОКЕН"
```

Ожидается профиль тренера (200) или понятная ошибка прав.

---

## 8. Переменные Vercel после готовности Beget

В [Vercel Dashboard](https://vercel.com) → проект → **Settings** → **Environment Variables** (Production и Preview для staging):

| Переменная | Значение |
|------------|----------|
| `VITE_USE_MOCK_DATA` | `false` |
| `VITE_WP_API_URL` | `https://ваш-домен-на-бегете.ru/wp-json` |
| `VITE_SKILLS_URL` | `https://fitnesakademiya.ru` |

**Build Command:** `npm run build` (не `build:staging`).

**Root Directory:** `frontend`.

Пересоберите деплой (**Deployments** → … → Redeploy). Локально для проверки: `cp .env.staging.wp.example .env` и те же значения.

Подробнее: [VERCEL.md](./VERCEL.md).

---

## 9. Типичные проблемы на Beget

### mod_rewrite / 404 на `/wp-json`

- Снова сохраните **Постоянные ссылки** → «Название записи».
- Проверьте, что в `public_html/.htaccess` есть стандартные правила WordPress.
- В панели сайта не должно быть конфликтующего «каталога» вместо корня WP.

### Загрузка файлов в чате (до 10 МБ)

Trenerka ограничивает файл **10 МБ** на уровне API. На Beget поднимите лимиты PHP для домена:

| Параметр | Рекомендация |
|----------|----------------|
| `upload_max_filesize` | `12M` или `16M` |
| `post_max_size` | `16M` или `20M` |
| `max_execution_time` | `120` |

**Сайты** → домен → **PHP** → дополнительные директивы или `php.ini` в корне (зависит от тарифа). После изменения проверьте загрузку вложения в сообщениях.

### Память WordPress

При ошибках «Allowed memory size» добавьте в `wp-config.php` (рядом с JWT):

```php
define('WP_MEMORY_LIMIT', '256M');
```

### Письма (verify email, сброс пароля)

На shared-хостинге `wp_mail()` часто попадает в спам. Для production установите SMTP-плагин (например WP Mail SMTP) и укажите почту домена или SendGrid/Mail.ru.

На staging можно смотреть токен в БД: мета пользователя `trenerka_verify_token` (phpMyAdmin в панели Beget).

### Cron: напоминания о тренировках

Плагин регистрирует задачу `trenerka_session_reminders` (каждый час). На малопосещаемом staging `wp-cron` срабатывает только при заходах на сайт.

**Надёжнее на Beget:**

1. **Планировщик (Cron)** в панели Beget.
2. Команда каждые 5–15 минут:

```bash
curl -sS "https://ваш-домен/wp-cron.php?doing_wp_cron" > /dev/null
```

или

```bash
wget -q -O - "https://ваш-домен/wp-cron.php?doing_wp_cron"
```

3. В `wp-config.php` при желании отключите виртуальный cron и оставьте только системный:

```php
define('DISABLE_WP_CRON', true);
```

---

## 10. Trenerka_Seeder (тестовые упражнения)

При **первой активации** плагина `Trenerka_Seeder` добавляет ~38 упражнений в каталог, если таблица пуста.

- Повторный сид не нужен — флаг `trenerka_seeded_exercises` в опциях WP.
- Клиентов и тренеров для CRM создайте через приложение: регистрация тренера → CRM → «Добавить клиента».

---

## 11. Опционально: статика фронта на Beget

Если не используете Vercel:

1. Локально: `cd frontend && npm run build`.
2. Загрузите содержимое `frontend/dist/` в отдельный поддомен (например `app.ваш-домен.ru/public_html/`).
3. В `wp-config.php` укажите этот URL в `TRENERKA_FRONTEND_URL`.
4. Настройте `index.html` как индекс и SPA-fallback (через `.htaccess` или nginx-правила в панели).

Для MVP проще держать фронт на Vercel.

---

## 12. Чеклист (отмечайте по мере выполнения)

| № | Шаг | Готово |
|---|-----|--------|
| 1 | Создан сайт/поддомен на Beget, DNS указывает на хостинг | ☐ |
| 2 | WordPress установлен, вход в `/wp-admin/` работает | ☐ |
| 3 | PHP 8.1+, SSL Let's Encrypt включён, сайт открывается по HTTPS | ☐ |
| 4 | Папка `trenerka-core` загружена в `wp-content/plugins/`, плагин активирован | ☐ |
| 5 | Плагин JWT установлен и активирован | ☐ |
| 6 | В `wp-config.php` добавлены `JWT_AUTH_*` и `TRENERKA_FRONTEND_URL` | ☐ |
| 7 | В `.htaccess` добавлена передача `Authorization` | ☐ |
| 8 | Постоянные ссылки: «Название записи» | ☐ |
| 9 | `curl https://DOMAIN/wp-json/` возвращает JSON | ☐ |
| 10 | `curl` JWT `/jwt-auth/v1/token` возвращает `token` | ☐ |
| 11 | В Vercel: `VITE_USE_MOCK_DATA=false`, `VITE_WP_API_URL=https://DOMAIN/wp-json`, redeploy | ☐ |
| 12 | Вход тренера с Vercel, CRM: создание клиента, чат/загрузка файла | ☐ |
| 13 | (Опц.) Cron Beget для `wp-cron.php`, SMTP для писем | ☐ |

---

## 13. Дымовой тест после связки Beget + Vercel

1. Откройте URL Vercel → **Регистрация тренера** → письмо/токен verify.
2. **Вход тренера** → дашборд без mock-данных.
3. **Профиль** — сохранение имени.
4. **CRM** — новый клиент, временный пароль в уведомлении.
5. **Вход клиента** с временным паролем.
6. **Сообщения** — отправка текста и файла &lt; 10 МБ.

Если что-то падает: проверьте `VITE_WP_API_URL`, CORS, секрет JWT, повторную активацию Trenerka Core (таблицы БД).

Полный сценарий: [DEPLOYMENT.md — Staging smoke test](./DEPLOYMENT.md#staging-smoke-test-wordpress--vercel).
