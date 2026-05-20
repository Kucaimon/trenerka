# Деплой Trenerka на Vercel

Инструкция для **staging/demo** на Vercel без WordPress (например `trenerka-mu.vercel.app`). Репозиторий: [Kucaimon/trenerka](https://github.com/Kucaimon/trenerka), ветка `main`.

В репозитории:

- `frontend/vercel.json` — SPA rewrites
- `frontend/.env.staging` — `VITE_USE_MOCK_DATA=true`
- `npm run build:staging` — сборка в demo-режиме

**Рекомендуется:** Root Directory = `frontend`.

---

## 1. Создать / настроить проект

| Поле | Значение |
|------|----------|
| **Project Name** | `trenerka-mu` (или своё) |
| **Framework Preset** | **Vite** |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build:staging` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci` |

---

## 2. Environment Variables (обязательно для demo)

Для **Production**, **Preview**, **Development**:

| Имя | Значение | Зачем |
|-----|----------|--------|
| `VITE_USE_MOCK_DATA` | `true` | Demo без WordPress |
| `VITE_WP_API_URL` | *(пусто)* | Не используется в mock |
| `VITE_SKILLS_URL` | `https://fitnesakademiya.ru` | Ссылка на курсы |

> Если задать только переменные в UI и **не** использовать `build:staging`, убедитесь что `VITE_USE_MOCK_DATA=true` в Vercel — иначе приложение попытается ходить в несуществующий WP.

После изменения env: **Deployments → … → Redeploy**.

---

## 3. Публичный доступ

**Settings → Deployment Protection** — отключите Vercel Authentication для Production, если нужна открытая ссылка.

---

## 4. Проверка

1. Откройте `https://<project>.vercel.app/`
2. `/login/trainer` → `trainer@trenerka.ru` / `demo123`
3. Дашборд, CRM, календарь, финансы, чат — данные из localStorage, сохраняются после reload

---

## 5. Демо-аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Тренер | trainer@trenerka.ru | demo123 |
| Клиент | client@trenerka.ru | demo123 |
| Админ | admin@trenerka.ru | demo123 |

Новый клиент: тренер создаёт в CRM → временный пароль в toast.

---

## 6. Локально перед деплоем

```bash
cd frontend
cp .env.staging .env
npm ci
npm run build:staging
npm run lint
npm test
```

---

## WordPress (не Vercel demo)

Когда backend на WordPress готов:

1. `VITE_USE_MOCK_DATA` = `false`
2. `VITE_WP_API_URL` = `https://ваш-домен/wp-json`
3. Build: `npm run build`
4. Redeploy

Подробнее: [DEPLOYMENT.md](./DEPLOYMENT.md), [WORDPRESS.md](./WORDPRESS.md).

---

## Устранение неполадок

| Симптом | Решение |
|---------|---------|
| 404 на `/trainer/...` после F5 | Root Directory = `frontend`, есть `vercel.json` rewrites |
| Пустой экран / нет логина | `VITE_USE_MOCK_DATA=true` + Redeploy |
| Данные не сохраняются | Нормально в приватном режиме / другой браузер — mock в localStorage |
| Сборка падает | `cd frontend && npm run build:staging` локально |
