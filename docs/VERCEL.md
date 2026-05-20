# Деплой Trenerka на Vercel

Два режима — **два набора переменных** (один проект Vercel или два отдельных проекта).

| Режим | `VITE_USE_MOCK_DATA` | Build | Назначение |
|-------|----------------------|-------|------------|
| **Demo** | `true` | `npm run build:staging` | Preview без WordPress, localStorage |
| **WP staging** | `false` | `npm run build` | Реальный backend на staging WP |

В `vercel.json` **нет** жёстко прошитого `VITE_USE_MOCK_DATA` — только команда сборки по умолчанию для demo. Для WP staging задайте переменные в Dashboard и смените Build Command на `npm run build`.

---

## 1. Demo-проект (mock, без WordPress)

Пример: `trenerka-mu.vercel.app`.

| Поле | Значение |
|------|----------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build:staging` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci` |

**Environment Variables** (Production + Preview):

| Имя | Значение |
|-----|----------|
| `VITE_USE_MOCK_DATA` | `true` |
| `VITE_WP_API_URL` | *(пусто)* |
| `VITE_SKILLS_URL` | `https://fitnesakademiya.ru` |

Локально: `cp .env.staging .env` → `npm run build:staging`.

Демо-аккаунты: `trainer@trenerka.ru` / `demo123` (см. README).

---

## 2. WP staging-проект (реальный API)

Отдельный Vercel-проект **или** отдельная среда Preview с другими env.

| Поле | Значение |
|------|----------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

**Environment Variables**:

| Имя | Значение |
|-----|----------|
| `VITE_USE_MOCK_DATA` | `false` |
| `VITE_WP_API_URL` | `https://STAGING-DOMAIN/wp-json` |
| `VITE_SKILLS_URL` | `https://fitnesakademiya.ru` |

Шаблон: `frontend/.env.staging.wp.example`.

На WordPress staging: JWT, `TRENERKA_FRONTEND_URL` = URL этого Vercel-проекта, CORS, reactivate plugin. См. [DEPLOYMENT.md](./DEPLOYMENT.md).

После смены env: **Deployments → Redeploy**.

---

## 3. Публичный доступ

**Settings → Deployment Protection** — отключите Vercel Authentication для Production, если нужна открытая ссылка.

---

## 4. Проверка

**Demo:** `/login/trainer` → demo123 → данные в localStorage.

**WP:** регистрация тренера → CRM → клиент → вход клиента. Чеклист: [DEPLOYMENT.md#staging-smoke-test-wordpress--vercel](./DEPLOYMENT.md#staging-smoke-test-wordpress--vercel).

---

## 5. Локально перед деплоем

```bash
cd frontend
npm ci
npm run lint
npm test
# demo:
cp .env.staging .env && npm run build:staging
# wp staging:
cp .env.staging.wp.example .env   # отредактируйте URL
npm run build
```

---

## Устранение неполадок

| Симптом | Решение |
|---------|---------|
| 404 на `/trainer/...` после F5 | Root Directory = `frontend`, rewrites в `vercel.json` |
| Пустой CRM / ошибки сети | `VITE_USE_MOCK_DATA=false` и верный `VITE_WP_API_URL`; CORS на WP |
| Demo не логинится | `VITE_USE_MOCK_DATA=true`, `build:staging`, Redeploy |
| CORS / 401 | JWT secret, `JWT_AUTH_CORS_ENABLE`, plugin active |
