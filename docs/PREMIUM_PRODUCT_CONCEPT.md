# Trenerka Premium Product Concept

## Product Vision

«Тренерка» is a premium AI fitness SaaS ecosystem for independent coaches, boutique studios, and fitness specialists who need one calm operating system for clients, programs, scheduling, payments, progress, and communication.

The product must feel like a real Series A/B fitness-tech startup:

- operationally useful, not decorative;
- premium and restrained, not generic SaaS;
- data-rich but readable;
- mobile-first for clients, desktop-first for coaches;
- scalable for WordPress-backed production.

Primary benchmark references: Stripe, Linear, Apple Fitness, Future, Vercel, Arc Browser, Notion, Supabase.

## Product Promise

**For trainers:** manage 20-50 active clients without Excel, fragmented messengers, and manual scheduling.

**For clients:** open the app and immediately know what to do today, how to perform it, what changed in progress, and how to contact the trainer.

**For admins:** operate the platform, content, users, public exercise catalog, news, subscriptions, and safety controls.

## Roles And Core Jobs

### Trainer

Main job: run a coaching practice in one place.

Critical workflows:

- see today's operational picture;
- add and segment clients;
- assign workout and nutrition programs;
- manage calendar and reminders;
- record payments and package balance;
- monitor progress and risks;
- communicate through chat;
- export reports.

### Client

Main job: follow the assigned program and report progress.

Critical workflows:

- see today's workout instantly;
- complete sets and rest timers;
- review exercise technique and video;
- add measurements and progress photos;
- chat with trainer;
- see next session and payment/package status.

### Admin

Main job: manage platform health.

Critical workflows:

- view trainers, clients, subscriptions;
- manage public exercises;
- manage users and blocking;
- publish news/announcements;
- inspect payments and support signals.

## Information Architecture

### Public Site

- Header
- Hero with real SaaS dashboard preview
- Product system overview
- CRM showcase
- Workout builder showcase
- Analytics showcase
- Mobile client app preview
- Onboarding
- Integrations
- Testimonials
- Pricing
- Final CTA
- Footer

### Trainer Workspace

- Overview
- Clients
- Client detail
- Programs
- Workout builder
- Calendar
- Analytics
- Finance
- Messages
- AI Coach
- Files
- Notifications
- Profile
- Settings
- Support

### Client App

- Home
- Workouts
- Workout session
- Progress
- Nutrition
- Achievements
- Chat
- Profile

### Admin

- Dashboard
- Users
- Exercises
- News
- Subscriptions/payments
- Platform settings

## Design Principles

### 1. Product First

Every screen must show a believable workflow. Avoid abstract cards that only look good in isolation. Product previews must contain real entities: clients, package balance, training blocks, revenue, retention, reminders, messages.

### 2. Calm Density

The trainer interface is an operating system. It should be dense enough for repeat work, but calm enough to scan quickly. Use tables, rows, badges, filters, and compact panels with consistent rhythm.

### 3. Apple-Level Mobile

The client app should feel like a premium iPhone fitness product: thumb-friendly, focused, tactile, and visually quieter than the trainer desktop workspace.

### 4. Accent Discipline

Lime is a signal, not decoration. Use it for:

- primary CTA;
- active navigation;
- key metric highlight;
- completed workout/progress states;
- current focus in builder/session.

### 5. Real Data Shapes

Charts should reflect actual product questions:

- revenue by period;
- retention;
- attendance;
- calendar load;
- client compliance;
- progress measurements;
- subscription/package state.

## Visual Language

### Palette

Core:

- `#050816` base black-blue
- `#0B1120` elevated deep surface
- `#111827` muted surface
- `#F8FAFC` primary text

Accent:

- `#D9F500` primary lime
- `#B7FF2A` secondary lime

Support:

- emerald for positive health;
- amber for warnings;
- rose for destructive states;
- soft slate borders and muted copy.

### Surfaces

Use layered dark surfaces:

- base page background;
- elevated panels;
- nested row/cards;
- focused states;
- modal surfaces.

Avoid heavy glassmorphism. Use subtle translucency only where it reinforces hierarchy.

### Typography

Use Inter.

Landing:

- editorial hero scale;
- tight but readable line-height;
- short supporting copy;
- strong section headlines.

Trainer:

- compact headings;
- tabular numbers;
- uppercase labels for analytics and tables;
- dense rows with clear status badges.

Client:

- larger touch-friendly headings;
- short labels;
- strong metrics;
- clear action text.

### Spacing

Global rhythm:

- page shell: 24-32px desktop;
- card padding: 16-24px;
- dense table rows: 14-18px vertical;
- mobile app sections: 16px gap;
- button height: 36-44px depending surface.

Do not create giant empty SaaS cards. Use air around groups, not inside every component.

## Component System

### Foundations

- Button
- Input
- Textarea
- Select
- Dialog
- Tabs
- Badge
- Avatar
- Progress
- Tooltip
- Separator
- ScrollArea

### Product Components

- MetricCard
- InsightCard
- ClientRow
- ClientStatusBadge
- RevenueChart
- RetentionChart
- AttendanceChart
- CalendarEventCard
- WorkoutExerciseCard
- WorkoutBlock
- SetRepRestEditor
- RestTimer
- ProgramDayTabs
- PaymentRow
- MessageBubble
- NotificationItem
- AIInsightPanel
- EmptyState
- PageHeader
- MobilePhoneFrame

### Empty States

Every module needs an empty state with:

- concise title;
- one-line explanation;
- primary action;
- secondary link only when useful.

Examples:

- No clients yet: "Add your first client"
- No program assigned: "Assign a program to start tracking workouts"
- No payments: "Record a payment to update package balance"
- No messages: "Send the first check-in"
- No measurements: "Add baseline measurements"

## Motion System

Use Framer Motion sparingly.

Allowed:

- 160-260ms fades/reveals;
- hover lift no more than 1-2px;
- soft active tab transitions;
- dialog scale/opacity;
- row hover background;
- progress bar transition;
- chart animation disabled on critical dashboards if it causes layout warnings.

Avoid:

- bounce;
- excessive parallax;
- random floating elements;
- intense glow;
- ornamental motion without workflow meaning.

## Public Landing Concept

### Hero

Left:

- Badge: "Coach operating system"
- Headline: "Управляй тренировками и клиентами в одном месте"
- Subheadline: practical promise around CRM, calendar, programs, payments, progress
- CTA: "Начать бесплатно"
- Secondary: "Открыть демо"
- Social proof: saved hours, active clients, program access speed

Right:

Real product dashboard preview:

- sidebar;
- CRM table;
- today's sessions;
- revenue line;
- AI signal;
- workout template;
- payment event.

No abstract SaaS blobs. Dashboard must be legible and believable.

### Product Sections

1. CRM pipeline
2. Calendar and reminders
3. Workout builder
4. Finance and subscriptions
5. Analytics
6. Client mobile app
7. Onboarding
8. Integrations
9. Testimonials
10. Pricing

### Testimonials

Use realistic operator language:

- "I stopped reconciling payments in spreadsheets."
- "Clients actually open their plan before training."
- "I can see who is drifting before they pause."

Avoid generic marketing praise.

### Integrations

Future-facing:

- WordPress backend
- Stripe / YooKassa
- SMTP / SendPulse / Unisender
- Google Calendar / Apple Calendar export
- Apple Health / Google Fit future
- Telegram/email notification future

## Trainer Dashboard Concept

Purpose: daily operating command center.

Top layer:

- monthly revenue;
- active clients;
- weekly sessions;
- unread messages;
- risk alerts.

Main layer:

- revenue chart;
- today's schedule;
- AI work signals;
- practice activity feed.

Secondary:

- calendar load;
- package expirations;
- client compliance;
- payment follow-ups.

UX rule: trainer should know what to do next within 10 seconds.

## CRM System Concept

### List View

Required controls:

- search by name/email/phone;
- status filter;
- package balance filter;
- sort by last session/payment;
- tags/segments;
- export.

Table columns:

- client identity;
- goal;
- assigned program;
- last session;
- package balance;
- payment status;
- client status;
- next action.

### Client Detail

Header:

- name, status, contact;
- assigned program;
- package balance;
- next session;
- primary actions.

Tabs:

- Overview
- Program
- Progress
- Payments
- Messages
- Notes
- Files

AI assistant:

- churn risk;
- missed workouts;
- payment reminder;
- program adjustment suggestion.

## Workout Builder Concept

Purpose: fast program creation without spreadsheet-like friction.

Layout:

- left/main: weekly program canvas;
- right: exercise catalog;
- top: day/week tabs;
- bottom or side: templates/AI suggestions.

Exercise card:

- drag handle;
- exercise name;
- muscle group/equipment;
- sets/reps/rest fields;
- video link;
- notes/technique;
- superset marker;
- remove/duplicate.

AI recommendations:

- "Replace heavy hinge due to low back note"
- "Add deload week after 3 high-intensity weeks"
- "Client compliance dropped below 70%"

States:

- empty day;
- unsaved changes;
- assigned to client;
- validation missing sets/reps.

## Calendar Concept

Views:

- month;
- week;
- day.

Event types:

- personal training;
- consultation;
- group class;
- check-in;
- payment follow-up.

Interaction:

- drag/drop persists;
- copy recurring;
- mark completed;
- missed/no-show;
- reminder status.

Visual language:

- event color should encode type/status, not random aesthetics;
- dense but readable week view;
- side panel for event edit.

## Analytics Concept

Analytics are not decoration. They answer:

- Is revenue growing?
- Which clients are at risk?
- How full is the calendar?
- Who is progressing?
- Which programs are working?
- Which subscriptions are expiring?

Dashboards:

- Revenue
- Retention
- Attendance
- Client progress
- Calendar load
- Subscription/packages
- Trainer workload

Charts:

- line for revenue trend;
- area for retention/compliance;
- bar for attendance;
- heatmap for calendar load;
- table for at-risk clients.

## Client Mobile App Concept

### Home

Immediate answers:

- what workout today?
- when is the next session?
- what did trainer say?
- package balance?
- weekly compliance?

### Workouts

Weekly plan:

- day cards;
- exercise list;
- sets/reps/rest;
- technique instructions;
- video links;
- completion state.

### Session

Touch-first:

- current exercise;
- set count;
- reps;
- rest timer;
- video technique;
- next exercise;
- completion summary.

### Progress

Required:

- weight;
- waist/hips/chest/arms/legs;
- photos before/after;
- notes;
- charts;
- PDF/report export for trainer.

### Chat

Required:

- messages;
- unread;
- quick replies;
- file attachment up to 10 MB;
- photo/video for technique.

## Onboarding Flow

### Trainer Onboarding

Steps:

1. Create account
2. Profile and specialization
3. Add first client
4. Import or create program
5. Schedule first session
6. Add payment/package
7. Invite client

UX:

- progress indicator;
- skip allowed only for non-critical steps;
- template-first workflow;
- no empty dashboard after signup.

### Client Onboarding

Steps:

1. Login with trainer-created credentials
2. Confirm profile
3. See assigned program
4. Add baseline measurements
5. Open today's workout
6. Send first check-in

## Subscription And Payment UX

Trainer pricing:

- Basic
- Pro
- Studio/VIP

Payment module:

- manual payment record first;
- payment provider abstraction;
- future Stripe/YooKassa integration;
- package balance auto-update;
- payment reminders;
- finance export.

Client payment visibility:

- package balance;
- payment history;
- active subscription/package;
- next renewal if enabled.

## AI Assistant Widgets

AI must feel operational, not magical.

Trainer AI:

- risk detection;
- program adjustment suggestions;
- schedule optimization;
- payment follow-up;
- progress summary;
- message draft.

Client AI:

- form check prompt;
- recovery note;
- adherence nudge;
- nutrition reminder.

Rules:

- never replace trainer authority;
- always show reason/context;
- always provide a concrete next action.

## Production UX Requirements

Every data screen must include:

- loading state;
- empty state;
- error state;
- permission state;
- optimistic mutation only where safe;
- confirmation before destructive actions;
- toast feedback;
- keyboard-friendly controls;
- responsive behavior down to 320px.

Every form must include:

- labels;
- validation;
- disabled/loading submit;
- success/error toast;
- accessible focus states.

Every table must include:

- mobile fallback or horizontal scroll;
- search/filter;
- meaningful empty state;
- row hover;
- stable column alignment.

## Frontend Architecture Direction

Keep current structure:

```txt
src/app
src/components
src/features
src/features/api
src/lib
src/store
```

Add scalable product components:

```txt
src/components/product/
  metric-card.tsx
  client-row.tsx
  workout-card.tsx
  ai-insight.tsx
  notification-item.tsx
  empty-state.tsx
  chart-panel.tsx
```

API services stay domain-based:

```txt
src/features/api/
  clients-service.ts
  programs-service.ts
  calendar-service.ts
  payments-service.ts
  messages-service.ts
  notifications-service.ts
  analytics-service.ts
  client-cabinet-service.ts
  admin-service.ts
```

## Backend Direction

WordPress remains the headless/CMS backend.

Required REST domains:

- auth
- trainer profile
- clients
- exercises
- programs
- workouts
- calendar events
- payments
- messages
- notifications
- progress reports
- admin users/news/exercises

Ownership rules:

- trainer can only access owned clients/programs/payments/messages;
- client can only access their assigned program/progress/messages;
- admin can access platform-level management.

## Cursor Implementation Prompt

Use this prompt to continue implementation:

```md
You are an elite senior frontend architect and product engineer.

Task: implement the Premium Product Concept for Trenerka without rewriting the app.

Use:
- React/Vite
- Tailwind/shadcn UI
- Framer Motion
- TanStack Query
- WordPress REST backend

Rules:
- preserve current routing and architecture;
- keep premium dark product UI;
- replace mock data gradually with API services;
- implement loading/empty/error states;
- make trainer desktop dense and operational;
- make client mobile app Apple-level and touch-friendly;
- do not create generic SaaS cards;
- every widget must represent a real workflow from the ТЗ.

Implementation order:
1. Create reusable product components in `src/components/product`.
2. Normalize design tokens and component variants.
3. Finish landing sections: testimonials, onboarding, integrations.
4. Upgrade trainer CRM and client detail workflows.
5. Upgrade workout builder with templates and AI recommendations.
6. Upgrade analytics with realistic panels and heatmap.
7. Add onboarding flows for trainer and client.
8. Add production empty/loading/error states.
9. Wire all screens to API service layer.
10. Run `npm run build` and visual QA.

Reference `docs/PREMIUM_PRODUCT_CONCEPT.md`, `docs/API.md`, and `docs/ACCEPTANCE.md`.
```

## Acceptance Bar For Premium MVP

The product is visually acceptable only if:

- a user can identify the product category in 3 seconds;
- dashboards contain realistic entities and data;
- trainer workflow feels usable daily;
- client app feels like a real mobile fitness companion;
- tables/forms/charts are consistent;
- no screen looks like a generic Tailwind template;
- accent color appears intentional, not decorative;
- empty states and loading states exist;
- all critical ТЗ modules have a visible UX surface;
- build passes.

