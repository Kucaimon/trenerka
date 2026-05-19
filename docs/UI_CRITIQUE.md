# UI-критика Trenerka (Linear-caliber audit)

## Краткое резюме

Интерфейс тренерского кабинета уже движется к SaaS-плотности (saas-system, AppShell), но остаётся слой «концепт-дизайна»: дублирующие метрики, декоративные карточки, фиктивные KPI и разная иерархия на дашборде, CRM и в навигации. Маркетинговый hero наследует типичные AI-паттерны (пульсирующий badge, огромный заголовок, метрики без контекста). В этом PR: единая строка метрик, 12-колоночная сетка дашборда, TanStack Table в CRM, PageHeader с контекстом, уплотнённая лента активности, спокойный FAB и фокус в сайдбаре — без смены hex в `tokens.css`.

---

## Топ-10 проблем (с примерами)

### 1. Дублирование метрик mobile/desktop
**Где:** `TrainerDashboardPage.tsx` — `trainer-mobile-stat-stack` (md:hidden) + `saas-metric-grid hidden md:grid`.  
**Проблема:** одни и те же 4 KPI рендерятся двумя разными UI; на планшете возможны артефакты, лишний DOM.  
**Исправлено:** одна `saas-metric-grid` на всех брейкпоинтах.

### 2. Фиктивный KPI «91%» без источника
**Где:** `TrainerDashboardPage` — `value: '91%'`, `dashboard.change.completion`.  
**Проблема:** fake dashboard — пользователь не понимает, откуда цифра; подрывает доверие.  
**Исправлено:** 4-я метрика — непрочитанные сообщения из `TrainerAnalytics.unreadMessages`.

### 3. Низкая плотность ленты активности
**Где:** `saas-activity-item` — padding 10px, `hidden lg:flex` скрывает ленту на средних экранах.  
**Проблема:** пустое пространство справа на laptop; мало событий на экране.  
**Исправлено:** уплотнённые отступы, лента с md+, больше пунктов в mock-slice.

### 4. Слабая иерархия заголовков страниц
**Где:** дашборд — inline `<header className="saas-page-header">` без breadcrumb; CRM — `page-title` в боковой колонке.  
**Проблема:** нет контекста «где я»; TopBar только поиск, без привязки к разделу.  
**Исправлено:** `SaasPageHeader` с breadcrumbs на дашборде и в шапке CRM.

### 5. CRM без TanStack Table на desktop
**Где:** `ClientsPage` — ручной `<table className="saas-table">`.  
**Проблема:** нет единого паттерна колонок/строк; сложнее расширять сортировку.  
**Исправлено:** `@tanstack/react-table` + shadcn `Table` primitives.

### 6. Раздутая CRM-шапка и filter bar
**Где:** `crm-list` header `py-4`, filter pills отдельным блоком.  
**Проблема:** мало строк таблицы на экране; фильтры визуально «оторваны».  
**Исправлено:** компактный toolbar, `crm-filter-bar`, chips `filter-pill--compact`.

### 7. Сайдбар: слабая секционная иерархия и focus
**Где:** `AppSidebarGroup`, `snav-item` — одинаковый вес групп; нет `:focus-visible`.  
**Проблема:** keyboard UX слабее Linear; группы сливаются.  
**Исправлено:** ужатые отступы, контрастнее `snav-label`, focus-ring на пунктах.

### 8. FAB AI-коуча — лишний визуальный шум
**Где:** `trainer-layout.tsx` — fixed FAB поверх контента.  
**Проблема:** отвлекает от workflow; на mobile конфликт с tab bar.  
**Исправлено:** приглушённый стиль `trainer-fab--subtle`, без glow.

### 9. Утечка concept.css / metric-grid на app-страницы
**Где:** `index.css` `.metric-grid` — декоративная сетка; `AnalyticsPage` `Card className="metric-grid"`.  
**Проблема:** «AI grid background» на рабочих экранах.  
**Исправлено:** класс переименован в `.chart-grid-bg` только для графиков; app-метрики — `saas-metric-grid`.

### 10. Landing hero — generic AI marketing
**Где:** `concept-hero` padding 100px, `concept-hero-badge` с pulse animation, `metrics-row` под hero.  
**Проблема:** шаблонный SaaS-лендинг; oversized типографика.  
**Исправлено (точечно):** убран pulse у badge, уменьшены отступы hero на mobile.

---

## Области аудита (детально)

### trainer-layout / AppShell
- AppShell корректно разделяет sidebar + main; trainer variant — column на mobile.
- TopBar не показывает title текущей страницы — только ⌘K.
- Badge в nav (`activeClients`) дублирует метрику дашборда — приемлемо как hint, но визуально яркий (#111 on accent).

### TrainerDashboardPage
- Две сетки статов (см. п.1).
- Chart panel: заголовок ок, но total revenue дублируется крупным accent-текстом в header — перегруз.
- Activity feed только lg+ — потеря плотности.
- Side panels (clients, schedule) — нормальная плотность list rows, но subtitle + badge избыточны.

### ClientsPage
- Split CRM layout работает; desktop table не sortable.
- Profile panel: 3 «stat cards» с иконками — decorative, не table-like.
- Status badges `text-[10px]` — ок, но filter pills крупные.

### site-header
- Чистый concept-nav; drawer на mobile адекватен.
- Нет проблем уровня app-shell.

### LandingPage hero
- Badge pulse, clamp(48px–80px) h1, metrics-row — классический AI landing.
- HeroProductMock — второй preview дублирует ProductDashboardPreview ниже (вне scope hero-only).

### Design System page
- Хорошая витрина AppShell/DashboardGrid; не связана с production trainer pages — риск drift.

---

## Что исправлено в PR

| Приоритет | Изменение |
|-----------|-----------|
| 1 | Единая `saas-metric-grid`, удалены mobile stat cards |
| 2 | KPI из API: unread messages вместо 91% |
| 3 | Плотнее activity feed, видна с md |
| 4 | `SaasPageHeader` + breadcrumbs (dashboard, clients) |
| 5 | TanStack Table в ClientsPage (desktop) |
| 6 | Компактный CRM filter toolbar |
| 7 | Sidebar focus + tighter groups |
| 8 | Subtle FAB |
| 9 | `metric-grid` → `chart-grid-bg` для графиков |
| 10 | Hero badge без pulse, меньше padding |

---

*Аудит: май 2026. Ограничение: hex в `tokens.css` не менялись.*

---

## Refinement pass 2 (production SaaS realism)

| Область | Что исправлено |
|---------|----------------|
| Sidebar | Ряды 34px, labels 10px uppercase muted, active `surface2` + 2px accent без glow, collapsed — центрированные иконки |
| Dashboard | `DashboardGrid` + `DashboardContainer` / `AnalyticsWidget`; KPI только из `useTrainerAnalytics` / hooks; график из `getRevenueChart`; убраны fake change hints; блок «Сегодня» для сессий; activity с иконками и relative time |
| CRM | TanStack sort по name/status, column sizing, hover/active `surface2`, компактные filter chips |
| Typography | `SaasPageHeader` + `ds-h1` на Programs, Calendar, Finance, Messages; `page-container` `space-y-5` |
| Cards | `CardHeader` pb-2, `CardTitle` text-sm semibold, padding `p-4 md:p-5`, без glow |
| Landing | Hero padding −20%, `saas-product-mock--hero` меньше, feature panels flat border |
| Mobile | Metrics 2×2 compact на xs; client-card padding уплотнён |

*Pass 2: май 2026. `#b8f53d`, `#080808` в `tokens.css` без изменений.*
