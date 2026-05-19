# Сопоставление ТЗ · HTML-концепт · реализация

Источники: `docs/PREMIUM_PRODUCT_CONCEPT.md`, `docs/ACCEPTANCE.md`, `docs/API.md`, `trenerka_platform_concept.html` (Syne/DM Sans, `#080808`, `#b8f53d`, RU).

Легенда статусов: **done** · **partial** · **stub** · **missing**

| Требование ТЗ | Маршрут | Компонент / сервис | Статус |
|---------------|---------|-------------------|--------|
| **Публичный сайт** |
| Hero RU + CTA | `/` | `LandingPage`, `SiteHeader` | done |
| Метрики / social proof | `/` | `LandingPage` (metrics-row) | done |
| CRM showcase | `/` | `LandingPage` ProductShowcase | done |
| Календарь / builder / analytics превью | `/` | `LandingPage` sections | partial |
| Мобильное приложение клиента | `/` | `LandingPage` MobileSection | done |
| Тарифы RU (Базовый/Pro/VIP) | `/` | `LandingPage` PricingSection | done |
| Testimonials / onboarding / integrations | `/` | — | missing |
| Footer RU | `/` | `SiteFooter` | done |
| **Auth** |
| Регистрация тренера | `/register/trainer` | `RegisterPage`, `auth-service` | done |
| Вход тренер / клиент / админ | `/login/*` | `LoginPage`, `ProtectedRoute` | done |
| JWT `trenerka_token` / persist | — | `auth-store`, `wordpress/client` | done |
| Role guards | `/trainer/*`, `/client/*`, `/admin/*` | `ProtectedRoute` | done |
| **Trainer workspace** |
| Дашборд (метрики, график, расписание) | `/trainer` | `TrainerDashboardPage`, `useTrainerAnalytics` | done |
| CRM список (поиск, фильтр, таблица) | `/trainer/clients` | `ClientsPage`, `clients-service` | done |
| CRM split / деталь клиента | `/trainer/clients/:id` | `ClientDetailPage` | partial |
| Конструктор тренировок | `/trainer/workouts/builder` | `WorkoutBuilderPage`, `programs-service` | partial |
| Каталог упражнений 30+ | `/trainer/exercises` | `ExercisesPage`, `exercises-service` | done |
| Программы (список) | `/trainer/programs` | `ProgramsPage`, `programs-service` | partial |
| Календарь FullCalendar + API | `/trainer/calendar` | `CalendarPage`, `calendar-service` | partial |
| Аналитика + графики | `/trainer/analytics` | `AnalyticsPage`, `analytics-service` | partial |
| Финансы / платежи | `/trainer/finance` | `FinancePage`, `payments-service` | partial |
| Сообщения | `/trainer/messages` | `MessagesPage`, `messages-service` | partial |
| AI Coach | `/trainer/ai-coach` | `AICoachPage` | partial |
| Файлы | `/trainer/files` | `FilesPage` | partial |
| Уведомления | `/trainer/notifications` | `NotificationsPage`, `notifications-service` | partial |
| Настройки | `/trainer/settings` | `SettingsPage` | partial |
| Профиль | `/trainer/profile` | `ProfilePage` | partial |
| Поддержка | `/trainer/support` | `SupportPage` | stub |
| Sidebar группы (Главное/Тренировки/Бизнес) | `/trainer/*` | `trainer-layout` | done |
| Command palette ⌘K | `/trainer/*` | `command-palette` | done |
| **Client app** |
| Home / dashboard API | `/client` | `ClientHomePage`, `client-cabinet-service` | partial |
| Тренировки недели | `/client/workouts` | `ClientWorkoutsPage` | done |
| Сессия тренировки | `/client/workouts/session` | `WorkoutSessionPage` | partial |
| Прогресс | `/client/progress` | `ProgressPage`, `client-cabinet-service` | partial |
| Питание | `/client/nutrition` | `NutritionPage` (mock meal plan) | stub |
| Достижения | `/client/achievements` | `AchievementsPage` (mock) | stub |
| Чат | `/client/chat` | `ChatPage`, `messages-service` | partial |
| Профиль | `/client/profile` | `ClientProfilePage` | partial |
| **Admin** |
| Дашборд | `/admin` | `AdminDashboardPage`, `admin-service` | partial |
| Упражнения каталог | `/admin/exercises` | `ExercisesAdminPage` | partial |
| Пользователи | `/admin/users` | `UsersAdminPage` | partial |
| Новости CRUD | `/admin/news` | `NewsAdminPage` | partial |
| Подписки / платформенные настройки | — | — | missing |
| **Дизайн (HTML concept)** |
| Syne + DM Sans | global | `index.html`, `tokens.css` | done |
| Палитра `#080808` / `#b8f53d` | global | `tokens.css`, `concept.css` | done |
| dash-grid / gap-grid / CRM split | landing, CRM, exercises | `concept.css`, pages | partial |
| Единый токен-слой (без дублей) | global | `tokens.css` + aliases | done |
| Старый blue Inter `#050816` | — | убрано с footer/градиентов | done (сессия) |
| **Backend / WP** |
| REST domains | — | `wordpress/trenerka-core` | partial |
| Mock mode demo | — | `VITE_USE_MOCK_DATA=true` | done |

## Дизайн-чеклист (concept.html)

| Элемент концепта | Где в приложении | Статус |
|------------------|------------------|--------|
| Fixed nav 60px blur | `SiteHeader`, `trainer-layout` header | done |
| Hero badge + Syne h1 | `LandingPage` | done |
| metrics-row 4 col | `LandingPage` | done |
| features-grid 3 col | `LandingPage` | done |
| dashboard-preview | `LandingPage` hero right | done |
| app-layout sidebar 220px | `trainer-layout`, `admin-layout` | done |
| snav-item active accent | `concept.css` `.snav-item` | done |
| dash-grid KPI | `TrainerDashboardPage` | done |
| crm-split list + detail | `ClientsPage` (list); detail separate route | partial |
| client-app phone frame | `client-shell` | done |
| pricing-cards | `LandingPage` | done |

## Приоритеты до полного ТЗ

1. WP production: отключить mock, проверить все REST endpoints.
2. CRM: табы детали клиента (Program, Progress, Payments, Messages, Notes, Files).
3. Calendar: drag-drop persist, recurring, completed/missed.
4. Finance: CSV export, provider config UI.
5. Chat: шаблоны, upload ≤10 MB.
6. Client: nutrition/achievements на API; session completion persist.
7. Landing: testimonials, onboarding, integrations sections.
8. Admin: subscriptions route.
9. E2E тесты и `npm run lint` без ошибок.

*Обновлено: 2026-05-19 — сессия выравнивания дизайна и MVP.*
