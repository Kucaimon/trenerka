# Аудит личного кабинета тренера по ТЗ §4.2.1–4.2.7

**Проект:** Trenerka  
**Заказчик:** Самат  
**Дата аудита:** 20 мая 2026  
**Объект проверки:** `frontend/` (React SPA) + `wordpress/trenerka-core/` (REST API)  
**Источник требований:** `docs/TZ_SOURCE_DOCX.txt` (раздел 4.2)  
**Метод:** статический аудит кода (без редизайна UI); ключевые утверждения сверены с репозиторием

---

## 1. Резюме для заказчика

### 1.1. Общая готовность

| Категория | Доля (оценка) | Комментарий |
|-----------|---------------|-------------|
| **DONE** (UI + поведение в mock) | **~32%** | Экраны и сценарии работают локально |
| **PARTIAL** | **~41%** | Интерфейс есть, контракт ТЗ не закрыт |
| **MOCK ONLY** | **~14%** | Только `localStorage` / seed-данные |
| **MISSING** | **~11%** | Нет UI, API или связки |
| **BROKEN** | **~2%** | Путь WP не совпадает с фронтендом |

**Итоговая оценка готовности к приёмке по контракту §4.2:** **~38%** (сильная оболочка SaaS, слабая production-связка с WordPress и почтой).

По умолчанию приложение работает в режиме mock:

```4:5:frontend/src/lib/config.ts
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false',
```

Пока `VITE_USE_MOCK_DATA` не установлен в `false` и не развёрнут WP + JWT + SMTP, **приёмка «боевого» кабинета тренера по ТЗ невозможна**.

### 1.2. Топ-10 критических разрывов (блокеры контракта)

| № | Разрыв | Раздел ТЗ | Влияние |
|---|--------|-----------|---------|
| 1 | Все сервисы тренера по умолчанию идут в `mockApi` / `localStorage` | 4.2.* | Нет персистентности, мультиустройство, бэкапа |
| 2 | Подтверждение email: mock-ссылка; WP `/auth/verify-email` **не зарегистрирован** | 4.2.1 | Регистрация не соответствует «подтверждение через почту» |
| 3 | Профиль тренера: фронт вызывает `/trenerka/v1/trainer/profile`, **маршрута нет в WP** | 4.2.1 | Профиль не сохранится при `useMockData=false` |
| 4 | Назначение питания клиенту в CRM **отсутствует** | 4.2.2 | Прямое несоответствие ТЗ |
| 5 | Групповой чат **отсутствует** | 4.2.6 | Прямое несоответствие ТЗ |
| 6 | Создание события календаря: только заголовок, `type: 'training'` захардкожен, нет клиента/типа | 4.2.4 | Календарь не пригоден для production-планирования |
| 7 | «Умные напоминания» 2ч/30м: cron в WP есть, фронт/mock не планируют напоминания | 4.2.4 | Email + ЛК не работают end-to-end |
| 8 | Назначение программы: только `startDate = сегодня`, без периода (4 недели) | 4.2.3 | Нет привязки к датам по ТЗ |
| 9 | PDF-отчёт прогресса: функция есть, **нигде не вызвана**; кнопка PDF у клиента без `onClick` | 4.2.7 | Отчёт недоступен пользователю |
| 10 | Платёжная интеграция: `enabled: false`, заглушка | 4.2.5 (опц.) | Автооплата подписок отсутствует |

### 1.3. Вердикт production readiness

| Критерий | Статус |
|----------|--------|
| UI/UX кабинета тренера (визуальная зрелость) | **Готов к демо** |
| Функциональное соответствие ТЗ §4.2 | **Не готов** |
| Интеграция WordPress REST | **Частично** (ядро CRUD есть, auth/profile/verify — нет) |
| Email / SMTP / verify | **Не готов** |
| Приёмка по контракту без оговорок | **Не рекомендуется** |

**Рекомендация:** принять **этап 1** как «Production UI + mock data layer» (см. `docs/STAGE1_CONTRACT.md`), а **этап 2** — отдельный контракт на WP, почту, напоминания, питание, групповой чат, PDF и платежи.

---

## 2. Методология и охват

### 2.1. Проверенные области кода

| Область | Ключевые файлы |
|---------|----------------|
| Auth | `RegisterPage.tsx`, `LoginPage.tsx`, `ResetPasswordPage.tsx`, `VerifyEmailPage.tsx`, `ProfilePage.tsx`, `auth-service.ts` |
| CRM | `ClientsPage.tsx`, `ClientsDataTable.tsx`, `ClientFormDialog.tsx`, `ClientDetailPage.tsx`, `clients-service.ts` |
| Тренировки | `ExercisesPage.tsx`, `WorkoutBuilderPage.tsx`, `ProgramsPage.tsx`, `AssignProgramDialog.tsx` |
| Календарь | `CalendarPage.tsx`, `calendar-service.ts` |
| Финансы | `FinancePage.tsx`, `payments-service.ts` |
| Коммуникация | `MessagesPage.tsx`, `NotificationsPage.tsx`, `messages-service.ts` |
| Аналитика | `TrainerDashboardPage.tsx`, `AnalyticsPage.tsx`, `analytics-service.ts` |
| Mock | `lib/mock-api/store.ts`, `lib/mock-data/*` |
| WordPress | `wordpress/trenerka-core/includes/class-trenerka-rest.php`, `class-trenerka-cron.php` |

### 2.2. Формат оценки требования

Для каждого пункта ТЗ:

- **STATUS:** `DONE` | `PARTIAL` | `MISSING` | `MOCK ONLY` | `BROKEN`
- **DESCRIPTION** — что реализовано фактически
- **PROBLEMS** — расхождения с ТЗ / риски
- **REQUIRED FIX** — что нужно для закрытия контракта

### 2.3. Сводная таблица проверок (количественные)

| Проверка | Результат | Доказательство в коде |
|----------|-----------|------------------------|
| Упражнений в каталоге ≥ 30 | **DONE (63)** | 62 seed `{ slug:` + `romanianDeadliftSample` в `mock-data/exercises.ts` |
| Mock-клиентов | **11** | `mock-data/clients.ts` |
| Экспорт клиентов CSV | **DONE** | `exportClientsSpreadsheet` в `clients-service.ts` |
| Экспорт финансов CSV | **DONE** | `exportPaymentsCsv` на `FinancePage.tsx` |
| Назначение питания (тренер) | **MISSING** | Только `NutritionPage` в кабинете клиента |
| Групповой чат | **MISSING** | Нет модели/UI |
| PDF (тренер) | **MISSING** | `downloadClientProgressPdf` не импортируется в страницах |
| PDF (клиент) | **BROKEN** | Кнопка без обработчика в `ProgressPage.tsx` |
| Email-напоминания 2ч/30м | **PARTIAL (WP)** | `class-trenerka-cron.php`; фронт не связан |
| Вид календаря «месяц» | **DONE** | `dayGridMonth` в `CalendarPage.tsx` |
| dnd-kit в конструкторе | **DONE** | `WorkoutBuilderPage.tsx` |
| FullCalendar | **DONE** | week/day/month |
| Платёжный провайдер | **MISSING** | `getPaymentProviderConfig().enabled === false` |

---

## 3. §4.2.1 — Авторизация и профиль

### 3.1. Регистрация тренера (email + пароль, подтверждение через почту)

**STATUS:** `PARTIAL`

**DESCRIPTION:** Форма регистрации (`RegisterPage.tsx`), mock-пользователи в `pending` до верификации, страница `/verify-email`. В mock на экране показывается ссылка для разработки.

**PROBLEMS:**
- Реальной отправки письма нет; production-подтверждение не реализовано.
- `auth-service.verifyEmail` вызывает `/trenerka/v1/auth/verify-email` — **маршрут отсутствует** в `class-trenerka-rest.php` (зарегистрированы только `/auth/me`, `/auth/register-trainer`, `/auth/reset-password`).
- WP `register_trainer` создаёт пользователя сразу, без токена верификации.
- Вход не блокируется для неверифицированного email.

**REQUIRED FIX:**
1. Таблица/мета токенов verify + SMTP-шаблон письма.
2. REST `POST /auth/verify-email`, `POST /auth/resend-verify`.
3. Запрет login/JWT до `email_verified`.
4. Убрать dev-ссылку verify с UI при `useMockData=false`.

---

### 3.2. Заполнение профиля (ФИО, специализация, опыт, контакты, аватар)

**STATUS:** `PARTIAL`

**DESCRIPTION:** `ProfilePage.tsx` — форма с валидацией; после первого входа редирект на `/trainer/profile?setup=1` (`LoginPage.tsx` + `isTrainerProfileComplete`).

**PROBLEMS:**
- `wpEndpoints.trainerProfile` → `/trenerka/v1/trainer/profile` **не зарегистрирован** в WordPress.
- Аватар: mock / object URL, UploadThing только при env; без WP upload в production-пути нестабильно.
- `ProtectedRoute` не принуждает заполнение профиля при прямом заходе на `/trainer/clients` и др.

**REQUIRED FIX:**
1. WP `GET/PATCH /trainer/profile` с полями ТЗ.
2. Загрузка аватара через `/trenerka/v1/upload`.
3. Guard: неполный профиль → только `/trainer/profile?setup=1`.

---

### 3.3. Восстановление пароля

**STATUS:** `PARTIAL`

**DESCRIPTION:** `ResetPasswordPage.tsx` — запрос сброса + подтверждение по токену; mock хранит токены в `localStorage`.

**PROBLEMS:**
- WP `reset_password` использует `retrieve_password` (письмо WP), без endpoint под `confirmResetPassword` с токеном из SPA.
- Mock в dev возвращает `resetToken` на экран — недопустимо в production.

**REQUIRED FIX:** Единый flow: либо только ссылка из письма WP, либо REST confirm с JWT-safe токеном; убрать отображение токена в UI.

---

### 3.4. Вход в систему (дополнительно к ТЗ)

**STATUS:** `PARTIAL` (`DONE` в mock / `PARTIAL` в WP)

**DESCRIPTION:** Логин по ролям; JWT через внешний плагин `/jwt-auth/v1/token` (`wpEndpoints.auth.login`).

**PROBLEMS:** Зависимость от JWT Auth plugin не задокументирована в деплое; mock-аккаунты в `auth-service.ts` для локальной разработки.

**REQUIRED FIX:** Чеклист деплоя JWT + отключение demo-учёток в production-сборке.

---

## 4. §4.2.2 — Управление клиентами (CRM)

### 4.1. Добавление клиента (ФИО, телефон/email, ДР опционально, статус)

**STATUS:** `PARTIAL`

**DESCRIPTION:** `ClientFormDialog.tsx`: имя, email, телефон, статус, цель, заметки, `packageBalance`. Создание возвращает `temporaryPassword` (mock/WP).

**PROBLEMS:** Поле **дата рождения** есть в типе `Client` и sanitize в WP, **отсутствует в форме** (`dateOfBirth` не найден в `features/trainer/`).

**REQUIRED FIX:** Опциональное поле ДР в диалоге + маппинг в API.

---

### 4.2. Редактирование и удаление клиента

**STATUS:** `PARTIAL`

**DESCRIPTION:** Редактирование через тот же диалог; `deleteClient` в mock переводит в статус `archive` (мягкое удаление).

**PROBLEMS:** ТЗ формулирует «удаление» — фактически архивация; клиент остаётся в списке при снятии фильтра.

**REQUIRED FIX:** Зафиксировать с заказчиком: archive vs hard delete; при необходимости — отдельное действие «Удалить навсегда».

---

### 4.3. Список: поиск, фильтр по статусу, сортировка

**STATUS:** `DONE`

**DESCRIPTION:** `ClientsPage.tsx` — поиск и pills статуса; `ClientsDataTable.tsx` — TanStack Table с сортировкой колонок.

**PROBLEMS:** Нет существенных расхождений с ТЗ.

**REQUIRED FIX:** — (при переключении на WP — регрессионные тесты фильтров).

---

### 4.4. Карточка клиента (контакты, история, заметки, замеры, платежи)

**STATUS:** `PARTIAL`

**DESCRIPTION:** `ClientDetailPage.tsx` — вкладки: обзор, замеры, программа, платежи, заметки, посещаемость, тренировки, файлы, сообщения.

**PROBLEMS:**
- «История тренировок» — список упражнений программы + события календаря, не журнал **завершённых** сессий.
- `getClientRecentActivity` — статический mock (`client-activity-mock.ts`).
- Бейдж посещаемости не читает `event.status` (всегда «completed»).

**REQUIRED FIX:** API активности/завершений; бейджи из `CalendarEvent.status`; связка с `complete_workout` клиента.

---

### 4.5. Назначение программы тренировок и питания

**STATUS:** `PARTIAL` (программа) / `MISSING` (питание)

**DESCRIPTION:** `AssignProgramDialog` + вкладка «Программа» в карточке клиента.

**PROBLEMS:**
- **Питание:** в CRM тренера потока нет; `mockMealPlan` только в `NutritionPage` клиента.
- Назначение программы без выбора дат (см. §4.2.3).

**REQUIRED FIX:**
1. CRUD планов питания тренером + назначение клиенту.
2. Диапазон дат назначения программы.

---

### 4.6. Экспорт списка клиентов в Excel/CSV

**STATUS:** `DONE` (CSV)

**DESCRIPTION:** Кнопка экспорта; UTF-8 BOM CSV через `exportClientsSpreadsheet`.

**PROBLEMS:** ТЗ указывает Excel; реализован только CSV (в коде явно: XLSX не подключён).

**REQUIRED FIX:** Либо `.xlsx` (SheetJS и т.п.), либо письменное согласование CSV как приёмочного формата.

---

## 5. §4.2.3 — Управление тренировками и упражнениями

### 5.1. Каталог ≥30 упражнений (описание, техника, мышцы, изображение)

**STATUS:** `DONE` (`MOCK ONLY` для production-данных)

**DESCRIPTION:** 63 упражнения в mock; детальная страница с шагами для sample RDL; изображения у большинства seed без URL.

**PROBLEMS:** Контент частично шаблонный; stock-изображения по ТЗ не массово заполнены.

**REQUIRED FIX:** Seed с `imageUrl`; WP media для публичного каталога; миграция при `useMockData=false`.

---

### 5.2. Создание собственных упражнений тренером

**STATUS:** `PARTIAL`

**DESCRIPTION:** CRUD-диалог на `ExercisesPage.tsx` (название, группа мышц, оборудование, сложность).

**PROBLEMS:** Нет полей **изображение** и **videoUrl** в форме; REST WP принимает `imageUrl`/`videoUrl`.

**REQUIRED FIX:** Поля загрузки картинки + YouTube URL в диалоге create/edit.

---

### 5.3. Конструктор тренировок (подходы, повторения, отдых, видео)

**STATUS:** `PARTIAL`

**DESCRIPTION:** `WorkoutBuilderPage.tsx` — dnd-kit, библиотека, сохранение программы.

**PROBLEMS:**
- Подходы/повторения/отдых **захардкожены** (`4`, `8`, `90s`) в `SortableExercise` — не редактируются.
- Нет `videoUrl` на упражнение в билдере.
- При переключении дня недели список не сохраняется per-day — один state `selected` на активный день.
- Кнопка «AI» (`Sparkles`) без логики — декоративная.

**REQUIRED FIX:** Редактируемые sets/reps/rest/video; persist `workouts[]` по дням; убрать или реализовать AI-suggest.

---

### 5.4. Группировка по дням недели / циклам (неделя 1, 2)

**STATUS:** `PARTIAL`

**DESCRIPTION:** Табы дней недели; поле `Program.weeks` (по умолчанию 4).

**PROBLEMS:** Нет UI «неделя 1 / неделя 2»; save пишет `weekNumber: 1` и один workout.

**REQUIRED FIX:** Селектор недели цикла + несколько `ProgramWorkout` на программу.

---

### 5.5. Назначение программы с привязкой к датам (например, 4 недели)

**STATUS:** `PARTIAL`

**DESCRIPTION:** `assignProgram(clientId, programId, startDate)`; `startDate` = сегодня:

```24:24:frontend/src/components/trainer/AssignProgramDialog.tsx
      await assignProgram(clientId, programId, new Date().toISOString().slice(0, 10))
```

**PROBLEMS:** Нет picker начала/конца; mock `clientPrograms` без `endDate`; WP поддерживает `end_date`, UI не отправляет.

**REQUIRED FIX:** Диалог: дата начала + авто `endDate = start + program.weeks`; отображение периода в карточке клиента.

---

### 5.6. Drag-and-drop в расписании

**STATUS:** `DONE`

**DESCRIPTION:** Перетаскивание упражнений внутри дня в конструкторе (dnd-kit).

**PROBLEMS:** DnD только внутри одного дня, не между днями.

**REQUIRED FIX:** Опционально cross-day DnD, если требуется буквальное «расписание за пару минут» по всей неделе.

---

## 6. §4.2.4 — Планирование и календарь

### 6.1. Календарь (месяц / неделя / день)

**STATUS:** `DONE`

**DESCRIPTION:** FullCalendar: `dayGridMonth`, `timeGridWeek`, `timeGridDay` в `CalendarPage.tsx`.

**PROBLEMS:** —

**REQUIRED FIX:** —

---

### 6.2. Создание события (тип, клиент, дата/время)

**STATUS:** `PARTIAL`

**DESCRIPTION:** Выделение слота → диалог с заголовком; drag для переноса.

**PROBLEMS:** В `submitNew` жёстко `type: 'training'`; нет полей тип (`consultation`/`group`), `clientId`, редактирования времени в диалоге.

**REQUIRED FIX:** Полная форма create/edit: тип, клиент, start/end, location/note.

---

### 6.3. Умные напоминания (2 ч и 30 мин, email + ЛК)

**STATUS:** `MOCK ONLY` (фронт) / `PARTIAL` (WP)

**DESCRIPTION:** WP `Trenerka_Cron` проверяет окна 120/30 мин, создаёт notification + `wp_mail`.

**PROBLEMS:** Mock-календарь и уведомления не связаны; seed-уведомления статичны; тренер в mock не получает напоминаний от своих событий.

**REQUIRED FIX:** E2E: создание event → cron → запись в `/notifications` → UI bell; тест SMTP.

---

### 6.4. Отметка о проведении тренировки

**STATUS:** `DONE`

**DESCRIPTION:** `completeEvent` выставляет `status: 'completed'`.

**PROBLEMS:** Вкладка «Посещаемость» в карточке клиента не отражает статус события.

**REQUIRED FIX:** UI badge/link из `event.status`.

---

### 6.5. Быстрое копирование повторяющихся событий

**STATUS:** `PARTIAL`

**DESCRIPTION:** `copyRecurringEvent` — дубликат +7 дней.

**PROBLEMS:** Не серия RRULE; флаг `recurring` в модели не используется в UI.

**REQUIRED FIX:** Правила повторения или UX «копировать на N недель».

---

## 7. §4.2.5 — Финансовый учёт

### 7.1. Добавление оплаты (сумма, дата, способ, комментарий)

**STATUS:** `PARTIAL`

**DESCRIPTION:** Форма на `FinancePage.tsx`: клиент, сумма, метод, пакет сессий.

**PROBLEMS:** **Комментарий** не в форме создания (только в таблице); дата всегда «сегодня».

**REQUIRED FIX:** Textarea note + date picker при создании/редактировании.

---

### 7.2. Автоматический расчёт остатка по подписке / пакету

**STATUS:** `DONE` (`MOCK ONLY` без списания за сессию)

**DESCRIPTION:** `sessionsAdded` увеличивает `packageBalance` при создании платежа (mock/WP).

**PROBLEMS:** Списание при завершении тренировки не реализовано.

**REQUIRED FIX:** Связать `completeEvent` / client workout complete с decrement balance (если по бизнес-правилам).

---

### 7.3. Отчёт по доходам (день / неделя / месяц / период)

**STATUS:** `PARTIAL`

**DESCRIPTION:** KPI месяца, произвольный период from/to, график выручки.

**PROBLEMS:**
- Нет пресетов «день/неделя» в UI.
- `getRevenueChart`, `getRetentionChart`, `getAttendanceChart`, `getSubscriptionMixChart` **всегда** вызывают `mockApi`, даже при `useMockData=false`:

```14:16:frontend/src/features/api/analytics-service.ts
export async function getRevenueChart(): Promise<RevenueReportPoint[]> {
  await apiDelay()
  return mockApi.analytics.revenue()
```

**REQUIRED FIX:** WP endpoints для графиков; ветвление `config.useMockData` во всех analytics-функциях.

---

### 7.4. Экспорт финансового отчёта в Excel

**STATUS:** `DONE` (CSV)

**DESCRIPTION:** `exportPaymentsCsv` — выгрузка всех платежей.

**PROBLEMS:** CSV вместо XLSX (как в §4.2.2).

**REQUIRED FIX:** Согласование формата или XLSX.

---

### 7.5. Интеграция с платёжной системой (опционально)

**STATUS:** `MISSING`

**DESCRIPTION:** Текст-заглушка `finance.integrationStub`; `enabled: false` в `payments-service.ts`.

**PROBLEMS:** Нет Stripe/ЮKassa, webhooks, checkout UI.

**REQUIRED FIX:** Отдельный scope: провайдер, webhook endpoint в WP, UI оплаты клиентом.

---

## 8. §4.2.6 — Коммуникация

### 8.1. Чат с клиентом (асинхронный, вложения до 10 МБ)

**STATUS:** `MOCK ONLY` / `PARTIAL` (WP path)

**DESCRIPTION:** `MessagesPage.tsx` — список диалогов, тред, шаблоны; проверка 10 МБ на upload.

**PROBLEMS:** Mock-вложение = `blob:` URL; из карточки клиента переход на общий `/trainer/messages` без `?clientId=`; нет real-time.

**REQUIRED FIX:** WP `/upload` для файлов; deep link `?clientId=`; polling или WebSocket.

---

### 8.2. Групповой чат для массовых курсов

**STATUS:** `MISSING`

**DESCRIPTION:** Не реализовано.

**PROBLEMS:** Нет сущности Group/Course, REST, UI.

**REQUIRED FIX:** Модель группы, участники, отдельный thread, права тренера.

---

### 8.3. Уведомления (сообщение, тренировка, оплата)

**STATUS:** `PARTIAL`

**DESCRIPTION:** `NotificationsPage.tsx`; mock-list; WP создаёт при payment/message/reminder (при live backend).

**PROBLEMS:** Mock не генерирует уведомления от действий пользователя; нет push.

**REQUIRED FIX:** Генерация в mock-store для QA; production — poll 30s или SSE.

---

### 8.4. Шаблоны быстрых сообщений

**STATUS:** `PARTIAL`

**DESCRIPTION:** 4 шаблона i18n (`workoutReminder` и др.).

**PROBLEMS:** Тексты не совпадают дословно с примерами ТЗ («Оплата принята, спасибо!»).

**REQUIRED FIX:** Обновить copy или CRUD шаблонов тренером.

---

## 9. §4.2.7 — Отчёты и аналитика

### 9.1. Дашборд (активные клиенты, доход месяца, тренировки недели, загруженность)

**STATUS:** `MOCK ONLY` (данные) / `DONE` (UI)

**DESCRIPTION:** `TrainerDashboardPage.tsx` — KPI, расписание на сегодня, графики, лента активности.

**PROBLEMS:** `mockActivityFeed` синтетическая; метрика загруженности календаря упрощена.

**REQUIRED FIX:** Агрегации из `/events` и `/payments`; убрать synthetic feed в production.

---

### 9.2. Отчёт по прогрессу клиентов (замеры, тесты, выполненные/пропущенные)

**STATUS:** `PARTIAL`

**DESCRIPTION:** Замеры и график в `ClientDetailPage`; `AnalyticsPage` — сводные графики (retention, weekday) из mock.

**PROBLEMS:** Нет отчёта «клиент + период» с missed vs completed; тестовые упражнения не моделируются.

**REQUIRED FIX:** REST progress report + экран/фильтр периода в аналитике тренера.

---

### 9.3. PDF с прогрессом и рекомендациями

**STATUS:** `MISSING` (тренер) / `BROKEN` (клиент)

**DESCRIPTION:** `downloadClientProgressPdf` в `analytics-service.ts` — mock `.txt`, WP — base64 placeholder.

**PROBLEMS:**
- Функция **нигде не импортируется** в trainer pages.
- Кнопка PDF в `ProgressPage.tsx` **без `onClick`**.

**REQUIRED FIX:** Кнопка в `ClientDetailPage` / Analytics; серверный PDF (TCPDF/Dompdf) или клиентский pdfmake; рекомендации тренера в шаблоне.

---

## 10. Общий продуктовый аудит

### 10.1. Маршруты и навигация

**STATUS:** `DONE`

**DESCRIPTION:** `routes.tsx` + `trainer-layout.tsx` — полное покрытие §4.2 плюс расширения: `ai-coach`, `files`, `support`, `settings`, `notifications`. Защита `ProtectedRoute role="trainer"`.

**PROBLEMS:** Доп. разделы не в ТЗ — риск scope creep при приёмке.

**REQUIRED FIX:** Матрица «в контракте / вне контракта» для AI Coach, Files, Support.

---

### 10.2. Слой данных

**STATUS:** `MOCK ONLY` (по умолчанию)

**DESCRIPTION:** Store `trenerka_mock_store_v4` в `localStorage`; все `*-service.ts` ветвятся через `config.useMockData`.

**PROBLEMS:** `STAGE1_CONTRACT.md` помечает многие экраны как «Production UI» — корректно для **интерфейса**, не для **контракта данных**.

**REQUIRED FIX:** Чеклист переключения mock→WP; миграция seed→DB.

---

### 10.3. Соответствие дизайну ТЗ §5

**STATUS:** `PARTIAL`

**DESCRIPTION:** Реализована тёмная SaaS-палитра (`#080808`, `#b8f53d`), плотность Linear/Attio.

**PROBLEMS:** ТЗ §5: светлая схема `#FFFFFF`, акцент `#00A86B` / `#FF6B35` — визуальное расхождение (функционально допустимо, если дизайн согласован отдельно).

**REQUIRED FIX:** Письменное согласование бренда или Phase 2 theme tokens.

---

## 11. Детекция AI / demo-паттернов (вне ТЗ, влияет на восприятие «готовности»)

| Сигнал | Где | Риск для приёмки |
|--------|-----|------------------|
| Страница **AI Coach** (карточки Bot/Sparkles) | `AICoachPage.tsx` | Выглядит как AI-фича без backend |
| Кнопка **«AI»** без handler | `WorkoutBuilderPage.tsx` | Вводит в заблуждение |
| Синтетическая **лента активности** | `mockActivityFeed`, `client-activity-mock.ts` | «Живой» дашборд — фейк |
| Copy «MVP» / AI в nutrition | `NutritionPage`, locales | Не production wording |
| Mock insights на лендинге | `landing.json` | Не блокер §4.2, но снижает доверие |

**REQUIRED FIX:** Пометить разделы «Beta» / скрыть до релиза AI; заменить synthetic feed на API.

---

## 12. WordPress vs Frontend — таблица контракта API

| Endpoint / возможность | Frontend ожидает | WordPress `trenerka-core` | Статус |
|------------------------|------------------|---------------------------|--------|
| JWT login | `/jwt-auth/v1/token` | Внешний плагин (не в repo) | `PARTIAL` |
| Register trainer | `/auth/register-trainer` | ✅ | `PARTIAL` (без verify) |
| Verify email | `/auth/verify-email` | ❌ | `BROKEN` |
| Reset password confirm | token flow в SPA | только `retrieve_password` | `PARTIAL` |
| Trainer profile | `/trainer/profile` | ❌ | `BROKEN` |
| Clients CRUD | `/clients` | ✅ | `DONE` (при JWT) |
| Exercises / Programs | `/exercises`, `/programs` | ✅ | `DONE` |
| Client programs assign | `/client-programs` | ✅ | `PARTIAL` (UI dates) |
| Calendar events | `/events` | ✅ | `PARTIAL` (UI fields) |
| Payments + reports | `/payments`, `/payments/reports` | ✅ | `PARTIAL` |
| Messages + read | `/messages` | ✅ | `PARTIAL` (upload) |
| Notifications | `/notifications` | ✅ | `PARTIAL` |
| Trainer analytics | `/analytics/trainer` | ✅ | `PARTIAL` (charts mock) |
| Client PDF | `/analytics/client/{id}/pdf` | ✅ placeholder | `PARTIAL` |
| File upload | `/upload` | ✅ | `PARTIAL` |
| Session reminders cron | — | ✅ `class-trenerka-cron.php` | `PARTIAL` (не связан с UI) |
| Group chat | — | ❌ | `MISSING` |
| Nutrition assign (trainer) | — | ❌ | `MISSING` |
| Payment gateway webhooks | Stripe stub | ❌ | `MISSING` |

---

## 13. Дорожная карта приоритетов для закрытия контракта

### Фаза A — Блокеры приёмки (2–3 недели)

1. `VITE_USE_MOCK_DATA=false` + деплой WP + JWT Auth + SMTP  
2. REST: `/auth/verify-email`, `/trainer/profile` (GET/PATCH)  
3. Блокировка login до verify; единый reset password  
4. Исправить `analytics-service` — все chart-функции через WP при live mode  

### Фаза B — Ядро §4.2 (3–4 недели)

5. Календарь: полная форма события + связка с cron-напоминаниями  
6. Конструктор: редактируемые sets/reps/rest, multi-day/week save  
7. `AssignProgramDialog`: период дат, `endDate`  
8. CRM: DOB, activity из API, статусы посещаемости  
9. PDF: кнопка тренера + рабочий handler клиента + реальный PDF  

### Фаза C — Явные пункты ТЗ (по согласованию scope)

10. Назначение питания из CRM тренера  
11. Групповой чат  
12. Платёжный провайдер (если в контракте)  
13. XLSX-экспорт (если обязателен Excel)  

### Фаза D — Качество приёмки

14. Убрать/пометить AI-демо (AI Coach, кнопка AI в билдере)  
15. E2E-тесты критических путей на staging с `useMockData=false`  
16. Документ «Definition of Done» по каждому §4.2.x  

---

## 14. Сводка по разделам (для протокола приёмки)

| Раздел ТЗ | DONE | PARTIAL | MOCK ONLY | MISSING | BROKEN |
|-----------|------|---------|-----------|---------|--------|
| 4.2.1 Auth/профиль | 0 | 4 | 0 | 0 | 0* |
| 4.2.2 CRM | 2 | 4 | 0 | 1 | 0 |
| 4.2.3 Тренировки | 2 | 4 | 1 | 0 | 0 |
| 4.2.4 Календарь | 2 | 2 | 1 | 0 | 0 |
| 4.2.5 Финансы | 1 | 2 | 0 | 1 | 0 |
| 4.2.6 Коммуникация | 0 | 3 | 1 | 1 | 0 |
| 4.2.7 Аналитика | 0 | 2 | 1 | 1 | 1 |

\* BROKEN относится к связке WP при `useMockData=false` (verify-email, trainer/profile), не к отдельным пунктам 4.2.1 в mock-режиме.

---

## 15. Заключение

Проект Trenerka на текущем коммите представляет собой **зрелый frontend SaaS-кабинета тренера** с проработанными экранами, таблицами, календарём, конструктором (dnd-kit), финансами и чатом **в режиме разработки (mock)**. Это соответствует внутреннему статусу Stage 1 UI, но **не закрывает контракт DOCX §4.2.1–4.2.7** для production без второго этапа интеграции.

**Для Самата (заказчик):** рекомендуется подписать приёмку **UI-этапа** и отдельный акт на **backend-этап** по таблице §12 и дорожной карте §13. Попытка принять весь §4.2 «как есть» при текущем `useMockData=true` по умолчанию создаёт юридический и продуктовый риск несоответствия ТЗ.

---

*Отчёт подготовлен по результатам кодового аудита (subagent f0cdaf9f) с верификацией ключевых утверждений в репозитории `trenerka`.*
