# Trenerka

Платформа SaaS для фитнес-тренеров: CRM, конструктор тренировок, аналитика и приложение для клиентов.

## Структура

```
trenerka/
├── frontend/                 # Vite + React (весь UI)
├── wordpress/
│   ├── trenerka-core/        # Плагин: CPT, REST, JWT stub
│   └── theme-trenerka/       # Тема: загрузка SPA
└── docs/
    ├── API.md
    ├── TZ_DESIGN_ALIGNMENT.md
    ├── DEPLOYMENT.md
    ├── BEGET.md
    ├── VERCEL.md
    └── ACCEPTANCE.md
```

## Demo / staging (без WordPress)

Режим для локальной разработки и Vercel preview (`trenerka-mu.vercel.app`): данные в **localStorage**, без backend.

```bash
cd frontend
cp .env.staging .env
# или: cp .env.demo .env
npm install
npm run dev
```

Сборка как на Vercel staging:

```bash
cd frontend
npm run build:staging
```

Откройте **http://localhost:5173** (порт смотрите в выводе `npm run dev`).

### Демо-аккаунты

| Роль | Email | Пароль | Вход |
|------|-------|--------|------|
| Тренер | trainer@trenerka.ru | demo123 | `/login/trainer` |
| Клиент | client@trenerka.ru | demo123 | `/login/client` |
| Админ | admin@trenerka.ru | demo123 | `/login/admin` |

**Новый тренер:** `/register/trainer` → подтвердите email по ссылке на экране (mock) → войдите → профиль заполните своими данными.

**Новый клиент от тренера:** CRM → добавить клиента → в toast будет **временный пароль** → клиент входит на `/login/client`.

## Vercel

Два режима (переменные в Dashboard, не в `vercel.json`):

| Режим | `VITE_USE_MOCK_DATA` | Build |
|-------|----------------------|-------|
| Demo | `true` | `npm run build:staging` |
| WP staging | `false` + `VITE_WP_API_URL` | `npm run build` |

Подробнее: [docs/VERCEL.md](docs/VERCEL.md) · чеклист WP: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## WordPress staging build

```bash
cd frontend
cp .env.staging.wp.example .env   # задайте STAGING-DOMAIN
npm run build
npm run lint
npm test
```

E2E (mock, поднимает dev-сервер): `npm run test:e2e`

## WordPress (production backend)

1. Установите WordPress
2. Активируйте плагин `wordpress/trenerka-core/`
3. Активируйте тему `wordpress/theme-trenerka/`
4. Установите [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
5. В `.env` установите `VITE_USE_MOCK_DATA=false` и `VITE_WP_API_URL`

Документация: [docs/API.md](docs/API.md) · [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) · [docs/WORDPRESS.md](docs/WORDPRESS.md)

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `VITE_WP_API_URL` | URL WordPress REST API (не нужен при mock) |
| `VITE_USE_MOCK_DATA` | `true` — demo/staging; `false` — WordPress |
| `VITE_SKILLS_URL` | Ссылка на курсы Фитнес Академии |

Файлы: `.env.staging` (demo), `.env.staging.wp.example` (WP staging), `.env.production` (WP prod).

## Маршруты

- `/` — лендинг
- `/login/trainer`, `/login/client`, `/login/admin` — вход
- `/register/trainer` — регистрация тренера
- `/trainer/*` — панель тренера
- `/client/*` — приложение клиента
- `/admin/*` — админка

## Стек

React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query, Framer Motion, Recharts, FullCalendar, @dnd-kit, WordPress REST API.
