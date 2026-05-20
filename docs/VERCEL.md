# Деплой Trenerka на Vercel

Инструкция для **нового** проекта Vercel после удаления старого. Репозиторий: [Kucaimon/trenerka](https://github.com/Kucaimon/trenerka), ветка `main`.

В репозитории уже есть:

- `frontend/vercel.json` — SPA-rewrites для React Router (если Root Directory = `frontend`)
- `vercel.json` в корне — сборка из `frontend/` без смены Root Directory в UI

Рекомендуется **вариант B** (Root Directory = `frontend`) — проще и совпадает с локальной разработкой.

---

## Вариант B (рекомендуется): Root Directory = `frontend`

### 1. Создать проект

1. Откройте [vercel.com/new](https://vercel.com/new) и войдите в аккаунт.
2. **Import Git Repository** → выберите **Kucaimon/trenerka** (подключите GitHub, если ещё не подключён).
3. На шаге **Configure Project** задайте:

| Поле | Значение |
|------|----------|
| **Project Name** | `trenerka` (для URL `trenerka.vercel.app`) |
| **Framework Preset** | **Vite** |
| **Root Directory** | `frontend` → **Edit** → выберите папку `frontend` → **Continue** |
| **Build Command** | `npm run build` (подставится автоматически) |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` или `npm ci` |

4. **Environment Variables** (см. раздел ниже) → **Deploy**.

### 2. Переменные окружения (демо)

В **Project → Settings → Environment Variables** добавьте для **Production**, **Preview** и **Development**:

| Имя | Значение | Зачем |
|-----|----------|--------|
| `VITE_USE_MOCK_DATA` | `false` | `true` — демо без WordPress (trainer@trenerka.ru / demo123) |
| `VITE_WP_API_URL` | *(не обязательно для демо)* | Нужен только при `VITE_USE_MOCK_DATA=false` |

После изменения env vars сделайте **Redeploy** (Deployments → … → Redeploy).

### 3. Публичный preview (без пароля)

1. **Project → Settings → Deployment Protection**
2. Для **Production** (и при необходимости Preview): отключите **Vercel Authentication** / **Password Protection**, если нужен открытый доступ по ссылке.
3. Сохраните и при необходимости пересоберите деплой.

### 4. Какой URL использовать

- **Production:** `https://<project-name>.vercel.app`  
  Пример при имени проекта `trenerka`: **`https://trenerka.vercel.app`**
- Каждый push в `main` обновляет production.
- Preview-деплои: `https://trenerka-<hash>-<team>.vercel.app` (для PR/веток).

Проверка: откройте production URL → лендинг `/` → вход `/login/trainer` с демо-аккаунтом.

### 5. Обновить ссылку на GitHub (по желанию)

После первого успешного деплоя: репозиторий **Settings → Website** → укажите ваш `https://trenerka.vercel.app`.

---

## Вариант A: корень репозитория (без смены Root Directory)

Если **Root Directory** оставить пустым (корень репо), Vercel прочитает корневой `vercel.json`:

- Install: `cd frontend && npm ci`
- Build: `cd frontend && npm run build`
- Output: `frontend/dist`
- SPA rewrites уже в `vercel.json`

Framework Preset: **Vite** или **Other**. Env vars — те же, что в варианте B.

---

## Локальная проверка перед деплоем

```bash
cd frontend
cp .env.example .env
npm ci
npm run build
```

Артефакт: `frontend/dist/`.

---

## WordPress (не Vercel)

Когда появится backend на WordPress:

1. `VITE_USE_MOCK_DATA` = `false`
2. `VITE_WP_API_URL` = `https://ваш-домен/wp-json`
3. Redeploy на Vercel.

Подробнее: [DEPLOYMENT.md](./DEPLOYMENT.md), [WORDPRESS.md](./WORDPRESS.md).

---

## Устранение неполадок

| Симптом | Решение |
|---------|---------|
| 404 на `/trainer/...` после обновления страницы | Root Directory должен быть `frontend` (используется `frontend/vercel.json`) **или** корневой `vercel.json` с rewrites |
| Пустой экран / нет демо-логина | Проверьте `VITE_USE_MOCK_DATA=true` и **Redeploy** |
| Сборка падает на `tsc` | Локально: `cd frontend && npm run build`, исправьте ошибки TypeScript |
| Старый URL `trenerka-five.vercel.app` | Проект удалён — создайте новый по этой инструкции |

CLI `vercel` не обязателен: достаточно импорта через веб-интерфейс.
