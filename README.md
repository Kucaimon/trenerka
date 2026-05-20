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
    ├── VERCEL.md
    └── ACCEPTANCE.md
```

## Быстрый старт (mock-режим)

```bash
cd frontend
cp .env.demo .env
# или: cp .env.example .env и VITE_USE_MOCK_DATA=true
npm install
npm run dev
```

Для локальной разработки с WordPress: скопируйте `frontend/.env.local` в `frontend/.env` и укажите `VITE_WP_API_URL`.

Production-сборка: `frontend/.env.production` (`VITE_USE_MOCK_DATA=false`).

Откройте **http://localhost:5173** (Vite по умолчанию).

Если порт занят старым процессом, Vite предложит **5174** — смотрите вывод `npm run dev` в терминале. Освободить 5173: `lsof -ti:5173 | xargs kill` (macOS/Linux).

### Демо-аккаунты

| Роль | Email | Пароль | Вход |
|------|-------|--------|------|
| Тренер | trainer@trenerka.ru | demo123 | `/login/trainer` |
| Клиент | client@trenerka.ru | demo123 | `/login/client` |
| Админ | admin@trenerka.ru | demo123 | `/login/admin` |

## Production build

```bash
cd frontend
npm run build
npm run lint
npm test
```

E2E (mock, поднимает dev-сервер): `npm run test:e2e`

## WordPress (production backend)

1. Установите WordPress
2. Активируйте плагин `wordpress/trenerka-core/` (создаёт таблицы + REST API)
3. Активируйте тему `wordpress/theme-trenerka/`
4. Установите [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
5. В `.env` установите `VITE_USE_MOCK_DATA=false` и `VITE_WP_API_URL`

Документация: [docs/API.md](docs/API.md) · [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) · [docs/WORDPRESS.md](docs/WORDPRESS.md)

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `VITE_WP_API_URL` | URL WordPress REST API |
| `VITE_USE_MOCK_DATA` | `false` по умолчанию — WordPress; `true` — локальное демо |

## Маршруты

- `/` — лендинг
- `/login/trainer`, `/login/client`, `/login/admin` — вход
- `/register/trainer` — регистрация
- `/trainer/*` — панель тренера
- `/client/*` — приложение клиента
- `/admin/*` — админка

## Стек

React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query, Framer Motion, Recharts, FullCalendar, @dnd-kit, WordPress REST API.
