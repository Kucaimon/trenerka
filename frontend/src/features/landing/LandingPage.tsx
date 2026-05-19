import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  Calendar,
  Check,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockAttendanceData, mockCalendarEvents, mockClients, mockRetentionData } from '@/lib/mock-data'
import { formatRub } from '@/lib/utils'
import { CHART } from '@/lib/chart-theme'

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
} as const

const plans = [
  {
    name: 'Базовый',
    price: 0,
    priceLabel: 'Бесплатно',
    period: 'До 10 клиентов',
    features: ['До 10 активных клиентов', 'Конструктор тренировок', 'Каталог упражнений', 'Базовый календарь'],
    disabled: ['Финансовый учёт', 'AI-ассистент'],
  },
  {
    name: 'Pro',
    price: 2490,
    period: 'в месяц · до 50 клиентов',
    popular: true,
    features: ['До 50 активных клиентов', 'Все функции конструктора', 'CRM полный доступ', 'Финансовый учёт', 'Аналитика и отчёты', 'AI-ассистент'],
  },
  {
    name: 'VIP',
    price: 5990,
    period: 'в месяц · неограничено',
    features: ['Неограниченно клиентов', 'White-label брендинг', 'Приоритетная поддержка', 'Групповые курсы', 'API доступ', 'Выделенный менеджер'],
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--black)] text-[var(--text-primary)]">
      <SiteHeader />
      <main className="pt-[60px]">
        <HeroSection />
        <SocialProofStrip />
        <ProductShowcase />
        <WorkflowSection />
        <AnalyticsSection />
        <MobileSection />
        <PricingSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}

function HeroSection() {
  return (
    <>
    <section className="concept-hero">
        <motion.div {...fade}>
          <div className="concept-hero-badge">AI Fitness SaaS Platform</div>
          <h1>
            Управляй тренировками
            <br />
            и клиентами
            <br />
            <span className="accent">в одном месте</span>
          </h1>
          <p className="concept-hero-sub">
            Платформа нового поколения для персональных тренеров. CRM, конструктор тренировок, аналитика и AI-помощник — всё в одном рабочем пространстве.
          </p>
          <div className="mt-11 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/register/trainer">Начать бесплатно →</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login/trainer">Смотреть демо</Link>
            </Button>
          </div>
          <p className="concept-hero-note">
            Бесплатно до 10 клиентов · Без кредитной карты · Настройка за 5 минут
          </p>
        </motion.div>
      </section>

      <motion.div {...fade} className="metrics-row mx-5 sm:mx-10">
        {[
          ['5ч', 'экономии в неделю'],
          ['2 700+', 'тренеров на платформе'],
          ['94%', 'довольны результатом'],
          ['₽48к', 'средний доход тренера'],
        ].map(([value, label]) => (
          <div key={label} className="metric-cell">
            <div className="metric-num">{value}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </motion.div>
    </>
  )
}

function ProductDashboardPreview() {
  return (
    <div className="mt-14 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface2)] px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto text-xs tracking-wide text-[var(--text-muted)]">Тренерка · Дашборд</span>
      </div>
      <div className="flex min-h-[480px]">
        <aside className="hidden w-[200px] shrink-0 border-r border-[var(--border)] p-4 lg:block">
          {['Дашборд', 'Клиенты', 'Тренировки', 'Календарь', 'Финансы', 'Чаты', 'Аналитика'].map((label, i) => (
            <div
              key={label}
              className={`px-5 py-2 text-[13px] ${i === 0 ? 'border-r-2 border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              {label}
            </div>
          ))}
        </aside>
        <div className="min-w-0 flex-1 p-6">
          <p className="font-display text-xl font-bold">Доброе утро, Мария 👋</p>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Среда, 19 мая 2026 · 9 тренировок сегодня</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Активных клиентов', '32', '+3 на неделе'],
              ['Доход за месяц', '₽127 400', '+18% vs прошлый'],
              ['Сессии', '52', 'на этой неделе'],
              ['Удержание', '94%', '+2 п.п.'],
            ].map(([label, val, hint]) => (
              <div key={label} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] p-4">
                <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
                <p className={`font-display mt-2 text-[26px] font-extrabold ${label.includes('Актив') || label.includes('Доход') ? 'text-[var(--accent)]' : ''}`}>{val}</p>
                <p className="mt-1 text-[11px] text-[var(--accent)]">{hint}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] p-4">
              <p className="text-sm font-semibold">Активные клиенты</p>
              <div className="mt-3 space-y-2">
                {mockClients.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-2 border-b border-[var(--border)] py-2 last:border-0">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--accent-dim)] text-[10px] font-bold">{c.name.slice(0, 1)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{c.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{c.goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] p-4">
              <p className="text-sm font-semibold">Расписание на сегодня</p>
              <div className="mt-3 space-y-2">
                {mockCalendarEvents.slice(0, 3).map((e) => (
                  <div key={e.id} className="flex gap-2 border-b border-[var(--border)] py-2 last:border-0">
                    <span className="text-[11px] text-[var(--text-muted)]">10:00</span>
                    <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <p className="text-[13px] font-medium">{e.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialProofStrip() {
  const quotes = [
    { name: 'Мария К.', role: 'персональный тренер', text: 'Перестала вести клиентов в Excel — всё в одном окне, экономлю 5+ часов в неделю.' },
    { name: 'Алексей Т.', role: 'студия functional', text: 'Клиенты реально пользуются приложением: тренировки, чат, замеры — без лишних мессенджеров.' },
    { name: 'Елена В.', role: 'онлайн-коуч', text: 'Аналитика и финансы наконец связаны с расписанием. Вижу риски оттока до того, как клиент уйдёт.' },
  ]
  return (
    <section className="border-y border-[var(--border)] bg-[var(--graphite)] px-5 py-12 sm:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <motion.div key={q.name} {...fade} className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-6">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">«{q.text}»</p>
            <p className="mt-4 text-sm font-semibold">{q.name}</p>
            <p className="text-xs text-[var(--text-muted)]">{q.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ProductShowcase() {
  return (
    <section id="product" className="px-5 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <SectionIntro
          eyebrow="Продукт"
          title="Профессиональный рабочий стол тренера"
          text="Всё, что нужно для ведения бизнеса — в одном окне. Никаких Excel-таблиц и потерянных чатов."
        />
        <div className="features-grid">
          <FeaturePanel emoji="🏋️" title="Конструктор тренировок" text="Drag-and-drop интерфейс. Более 30 базовых упражнений, создание собственных, AI-рекомендации и шаблоны программ." />
          <FeaturePanel emoji="👥" title="CRM для тренера" text="Полная карточка клиента с историей тренировок, прогрессом замеров, историей платежей и заметками тренера." />
          <FeaturePanel emoji="📊" title="Аналитика доходов" text="Графики выручки, удержание клиентов, статистика тренировок. Экспорт в Excel для налоговой." />
          <FeaturePanel emoji="📅" title="Умный календарь" text="Планирование тренировок и консультаций. Автоматические напоминания клиентам за 2ч и 30 мин до занятия." />
          <FeaturePanel emoji="💬" title="Встроенный чат" text="Асинхронное общение с клиентами, шаблоны сообщений, прикрепление файлов до 10 МБ." />
          <FeaturePanel emoji="✦" title="AI-ассистент" text="Генерация программ тренировок, анализ прогресса, рекомендации по питанию и автоматические отчёты." />
        </div>
        <ProductDashboardPreview />
      </div>
    </section>
  )
}

function FeaturePanel({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <motion.div {...fade} className="feature-card">
      <div className="feature-icon">{emoji}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  )
}

function WorkflowSection() {
  return (
    <section id="workouts" className="border-y border-[var(--border)] bg-[var(--graphite)] px-5 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionIntro
          eyebrow="Workout builder"
          title="Недельный план собирается за пару минут"
          text="Конструктор должен быть рабочим инструментом: упражнения из каталога, свои движения, подходы, повторы, отдых, видео и назначение клиенту на период."
        />
        <motion.div {...fade} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Программа: Силовая A</p>
              <p className="text-xs text-[var(--text-muted)]">Неделя 1 · Понедельник · 56 мин</p>
            </div>
            <Badge variant="accent">Назначена</Badge>
          </div>
          <div className="mb-4 grid grid-cols-7 gap-1">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
              <div key={day} className={`rounded-md border border-[var(--border)] px-2 py-2 text-center text-xs font-semibold ${index === 0 ? 'bg-white/[0.08] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-2">
              {[
                ['Жим лёжа', 'Грудь · штанга', '4', '8', '90 сек'],
                ['Приседания со штангой', 'Ноги · штанга', '5', '5', '120 сек'],
                ['Тяга штанги в наклоне', 'Спина · штанга', '4', '10', '90 сек'],
                ['Планка', 'Кор · собственный вес', '3', '45 сек', '60 сек'],
              ].map(([name, meta, sets, reps, rest], index) => (
                <div key={name} className="grid items-center gap-3 rounded-lg border border-[var(--border)] bg-white/[0.035] p-3 sm:grid-cols-[28px_minmax(0,1fr)_repeat(3,64px)]">
                  <span className="text-xs text-[var(--text-muted)]">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{meta}</p>
                  </div>
                  <MiniField label="Сеты" value={sets} />
                  <MiniField label="Повт." value={reps} />
                  <MiniField label="Отдых" value={rest} />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-black/20 p-3">
              <p className="text-sm font-semibold">Каталог</p>
              <div className="mt-3 space-y-2">
                {['Подтягивания', 'Жим стоя', 'Болгарские выпады', 'Тяга блока'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-white/[0.04]">
                    <span>{item}</span>
                    <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-black/20 px-2 py-1.5 text-center">
      <p className="text-[9px] font-semibold uppercase text-[var(--text-muted)]">{label}</p>
      <p className="mt-0.5 text-xs font-semibold">{value}</p>
    </div>
  )
}

function AnalyticsSection() {
  return (
    <section id="analytics" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Analytics"
          title="Отчёты, которые помогают управлять практикой"
          text="В ТЗ аналитика не декоративная: активные клиенты, доход за период, загрузка календаря, прогресс клиентов и PDF-отчёты."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          <InsightCard icon={Wallet} label="MRR" value="292 000 ₽" trend="+8.2%" />
          <InsightCard icon={Users} label="Активные" value="11" trend="2 на риске" />
          <InsightCard icon={Activity} label="Удержание" value="95%" trend="+5 п.п." />
          <InsightCard icon={Calendar} label="Неделя" value="52" trend="сессии" />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ChartPanel title="Удержание клиентов" subtitle="Когорты и риск паузы">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={mockRetentionData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="month" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={11} domain={[80, 100]} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}%`, 'Retention']} />
                <Area type="monotone" dataKey="rate" stroke={CHART.emerald} fill="rgba(52,211,153,0.12)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="Посещаемость" subtitle="Плановые и проведённые сессии">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={mockAttendanceData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="week" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [v, 'Сессии']} />
                <Bar dataKey="sessions" fill={CHART.line} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </div>
    </section>
  )
}

function InsightCard({ icon: Icon, label, value, trend }: { icon: typeof Wallet; label: string; value: string; trend: string }) {
  return (
    <motion.div {...fade} className="rounded-xl border border-[var(--border)] bg-white/[0.025] p-5">
      <div className="flex items-start justify-between">
        <p className="label-caps">{label}</p>
        <Icon className="h-4 w-4 text-[var(--text-muted)]" />
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-emerald-300">{trend}</p>
    </motion.div>
  )
}

function ChartPanel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <motion.div {...fade} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
      </div>
      <div className="h-72">{children}</div>
    </motion.div>
  )
}

function MobileSection() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--graphite)] px-5 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionIntro
          eyebrow="Client app"
          title="Клиент видит программу, прогресс и связь с тренером"
          text="Мобильная версия должна быть быстрой и понятной: сегодняшняя тренировка, неделя, замеры, фото прогресса, чат и история оплат."
        />
        <motion.div {...fade} className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <PhoneMock title="Сегодня" primary="Силовая A" meta="6 упражнений · 45 мин" progress="68%" />
          <PhoneMock title="Прогресс" primary="67.4 кг" meta="−4.6 кг за цикл" progress="82%" secondary />
        </motion.div>
      </div>
    </section>
  )
}

function PhoneMock({ title, primary, meta, progress, secondary }: { title: string; primary: string; meta: string; progress: string; secondary?: boolean }) {
  return (
    <div className={`w-[260px] rounded-[32px] border border-[var(--border-strong)] bg-[#0a0a0a] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.6)] ${secondary ? 'sm:mt-16' : ''}`}>
      <div className="rounded-[26px] border border-[var(--border)] bg-[var(--black)] p-4">
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-white/20" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">{title}</p>
          <Smartphone className="h-4 w-4 text-[var(--text-muted)]" />
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight">{primary}</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{meta}</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: progress }} />
        </div>
        <div className="mt-6 space-y-2">
          {['Разминка', 'Основной блок', 'Заминка'].map((item, index) => (
            <div key={item} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white/[0.035] px-3 py-3">
              <span className="text-sm">{item}</span>
              {index === 0 ? <Check className="h-4 w-4 text-[var(--accent)]" /> : <span className="text-xs text-[var(--text-muted)]">{index + 2}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="px-5 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-[1000px] text-center">
        <SectionIntro
          eyebrow="Тарифы"
          title="Простые и прозрачные цены"
          text="Начните бесплатно, переходите на Pro когда будете готовы. Без скрытых платежей."
          center
        />
        <div className="mt-14 gap-grid grid-cols-1 lg:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              {...fade}
              className={`gap-grid-cell relative p-9 text-left ${plan.popular ? 'bg-[#0d1a07]' : ''}`}
            >
              {plan.popular && (
                <Badge variant="accent" className="absolute right-4 top-4 uppercase">
                  Популярный
                </Badge>
              )}
              <p className="font-display text-sm font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">{plan.name}</p>
              <p className="font-display mt-4 text-[48px] font-extrabold leading-none tracking-tight">
                {'priceLabel' in plan && plan.priceLabel ? plan.priceLabel : formatRub(plan.price)}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{plan.period}</p>
              <ul className="mt-7 space-y-0">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 border-b border-[var(--border)] py-2 text-[13px] text-[var(--text-secondary)]">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                    {feature}
                  </li>
                ))}
                {'disabled' in plan &&
                  plan.disabled?.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 border-b border-[var(--border)] py-2 text-[13px] text-[var(--text-muted)]">
                      <span className="text-[var(--text-muted)]">—</span>
                      {feature}
                    </li>
                  ))}
              </ul>
              <Button className="mt-7 w-full" variant={plan.popular ? 'default' : 'secondary'} asChild>
                <Link to="/register/trainer">{plan.price === 0 ? 'Начать бесплатно' : plan.popular ? 'Попробовать Pro →' : 'Обсудить VIP'}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="px-5 pb-24 sm:px-6 lg:px-8">
      <motion.div
        {...fade}
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(184,245,61,0.12),rgba(22,22,22,0.72)_38%,rgba(8,8,8,0.95))] p-8 shadow-[var(--shadow-soft)] sm:p-10"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="label-caps">Start in 10 minutes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Перенеси клиентов, программы и оплаты в один рабочий контур</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              14 дней бесплатно, без карты. Демо-аккаунт тренера уже подключен, чтобы оценить реальный workflow.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button size="lg" asChild>
              <Link to="/register/trainer">Создать аккаунт</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login/trainer">Посмотреть демо</Link>
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
          {[
            [ShieldCheck, 'Безопасная авторизация'],
            [MessageSquare, 'Чат и уведомления'],
            [CreditCard, 'Финансовые отчёты'],
          ].map(([Icon, label]) => (
            <div key={label as string} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Icon className="h-4 w-4 text-[var(--accent)]" />
              {label as string}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function SectionIntro({ eyebrow, title, text, center }: { eyebrow: string; title: string; text: string; center?: boolean }) {
  return (
    <motion.div {...fade} className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="section-tag">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <p className={`section-sub ${center ? 'mx-auto' : ''}`}>{text}</p>
    </motion.div>
  )
}
