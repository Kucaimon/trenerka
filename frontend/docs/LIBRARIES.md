# Стек библиотек Trenerka (frontend)

Краткий справочник обязательных зависимостей SaaS-интерфейса.

| Пакет | Назначение |
|-------|------------|
| `@tanstack/react-table` | Таблицы с сортировкой, фильтрами, пагинацией |
| `@tremor/react` | Дашборд-компоненты и метрики поверх Recharts |
| `recharts` | Графики и диаграммы |
| `lucide-react` | Иконки |
| `@fullcalendar/*` | Календарь тренера (день / неделя, drag-and-drop) |
| `@dnd-kit/*` | Drag-and-drop списков и канбан |
| `react-hook-form` | Формы с минимальными ре-рендерами |
| `zod` | Схемы валидации |
| `zustand` | Локальный UI/auth state |
| `@tanstack/react-query` | Кэш и запросы к API |
| `sonner` | Toast-уведомления |
| `class-variance-authority` | Варианты стилей UI-компонентов (cva) |
| `tailwindcss-animate` | Утилиты `animate-in` / `animate-out` (подключён в `src/index.css`) |
| `@clerk/clerk-react` | OAuth / сессии (опционально, см. `VITE_CLERK_PUBLISHABLE_KEY`) |
| `uploadthing`, `@uploadthing/react` | Загрузка файлов (опционально, нужны ключи UploadThing) |
| `vaul` | Drawer / bottom sheet на мобильных |

## Переменные окружения

См. `.env.example`:

- `VITE_CLERK_PUBLISHABLE_KEY` — включает `ClerkProvider` в `src/main.tsx`
- `VITE_UPLOADTHING_APP_ID`, `UPLOADTHING_SECRET` — для UploadThing (бэкенд + клиент)

Без ключей приложение собирается и работает на mock/WordPress auth.

## UploadThing

Пакеты установлены. Полная интеграция: API route на бэкенде + `generateUploadButton` / `UploadButton` из `@uploadthing/react` при наличии секретов.
