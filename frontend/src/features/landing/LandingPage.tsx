import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockAttendanceData, mockCalendarEvents, mockClients, mockRetentionData } from '@/lib/mock-data'
import { formatLongDate } from '@/lib/i18n-format'
import { formatRub } from '@/lib/utils'
import { CHART } from '@/lib/chart-theme'

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
} as const

const FEATURE_EMOJIS = ['🏋️', '👥', '📊', '📅', '💬', '✦'] as const
const TESTIMONIAL_AVATARS = ['/testimonials/avatar-1.webp', '/testimonials/avatar-2.webp', '/testimonials/avatar-3.webp'] as const
const METRIC_KEYS = ['hours', 'trainers', 'satisfaction', 'income'] as const
const PREVIEW_STAT_KEYS = ['activeClients', 'monthlyIncome', 'sessions', 'retention'] as const
const PLAN_KEYS = ['basic', 'pro', 'vip'] as const
const PLAN_PRICES = { basic: 0, pro: 2490, vip: 5990 } as const

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

function asMetricTuple(value: unknown): [string, string] | null {
  if (!Array.isArray(value) || value.length < 2) return null
  return [String(value[0]), String(value[1])]
}

function asStatTuple(value: unknown): [string, string, string] | null {
  if (!Array.isArray(value) || value.length < 3) return null
  return [String(value[0]), String(value[1]), String(value[2])]
}

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--black)] text-[var(--text-primary)]">
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
  const { t } = useTranslation('landing')

  return (
    <>
      <section className="concept-hero">
        <motion.div {...fade}>
          <div className="concept-hero-badge">{t('hero.badge')}</div>
          <h1>
            {t('hero.title1')}
            <br />
            {t('hero.title2')}
            <br />
            <span className="accent">{t('hero.titleAccent')}</span>
          </h1>
          <p className="concept-hero-sub">{t('hero.subtitle')}</p>
          <div className="mt-11 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/register/trainer">{t('hero.ctaPrimary')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login/trainer">{t('hero.ctaSecondary')}</Link>
            </Button>
          </div>
          <p className="concept-hero-note">{t('hero.note')}</p>
        </motion.div>
      </section>

      <motion.div {...fade} className="metrics-row mx-5 sm:mx-10">
        {METRIC_KEYS.map((key) => {
          const metric = asMetricTuple(t(`metrics.${key}`, { returnObjects: true }))
          if (!metric) return null
          const [value, label] = metric
          return (
            <div key={key} className="metric-cell">
              <div className="metric-num">{value}</div>
              <div className="metric-label">{label}</div>
            </div>
          )
        })}
      </motion.div>
    </>
  )
}

function ProductDashboardPreview() {
  const { t } = useTranslation('landing')
  const sidebar = asStringArray(t('preview.sidebar', { returnObjects: true }))
  const previewDate = formatLongDate()

  return (
    <div className="mt-14 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface2)] px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto text-xs tracking-wide text-[var(--text-muted)]">{t('preview.windowTitle')}</span>
      </div>
      <div className="flex min-h-[480px]">
        <aside className="hidden w-[200px] shrink-0 border-r border-[var(--border)] p-4 lg:block">
          {sidebar.map((label, i) => (
            <div
              key={label}
              className={`px-5 py-2 text-[13px] ${i === 0 ? 'border-r-2 border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              {label}
            </div>
          ))}
        </aside>
        <div className="min-w-0 flex-1 p-6">
          <p className="font-display text-xl font-bold">{t('preview.greeting')}</p>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{t('preview.dateLine', { date: previewDate })}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {PREVIEW_STAT_KEYS.map((key, index) => {
              const stat = asStatTuple(t(`preview.stats.${key}`, { returnObjects: true }))
              if (!stat) return null
              const [label, val, hint] = stat
              return (
                <div key={key} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
                  <p className={`font-display mt-2 text-[26px] font-extrabold ${index < 2 ? 'text-[var(--accent)]' : ''}`}>{val}</p>
                  <p className="mt-1 text-[11px] text-[var(--accent)]">{hint}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] p-4">
              <p className="text-sm font-semibold">{t('preview.activeClientsTitle')}</p>
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
              <p className="text-sm font-semibold">{t('preview.scheduleTitle')}</p>
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
  const { t } = useTranslation('landing')
  const testimonials = t('testimonials', { returnObjects: true }) as Array<{ name: string; role: string; text: string }>

  return (
    <section className="border-y border-[var(--border)] bg-[var(--graphite)] px-5 py-12 sm:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-4 md:grid-cols-3">
        {testimonials.map((q, index) => (
          <motion.div key={q.name} {...fade} className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-6">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">«{q.text}»</p>
            <div className="mt-5 flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-[var(--border-strong)] ring-2 ring-[var(--accent)]/15">
                <AvatarImage src={TESTIMONIAL_AVATARS[index]} alt={q.name} className="object-cover" />
                <AvatarFallback className="bg-[var(--accent-dim)] text-sm font-bold text-[var(--accent)]">
                  {q.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{q.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{q.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ProductShowcase() {
  const { t } = useTranslation('landing')
  const features = t('product.features', { returnObjects: true }) as Array<{ title: string; text: string }>

  return (
    <section id="product" className="px-5 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <SectionIntro eyebrow={t('product.eyebrow')} title={t('product.title')} text={t('product.text')} />
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeaturePanel key={feature.title} emoji={FEATURE_EMOJIS[index] ?? '✦'} title={feature.title} text={feature.text} />
          ))}
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
  const { t } = useTranslation('landing')
  const days = asStringArray(t('workflow.days', { returnObjects: true }))
  const exercises = t('workflow.exercises', { returnObjects: true }) as string[][]
  const catalogItems = asStringArray(t('workflow.catalogItems', { returnObjects: true }))

  return (
    <section id="workouts" className="border-y border-[var(--border)] bg-[var(--graphite)] px-5 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionIntro eyebrow={t('workflow.eyebrow')} title={t('workflow.title')} text={t('workflow.text')} />
        <motion.div {...fade} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{t('workflow.programTitle')}</p>
              <p className="text-xs text-[var(--text-muted)]">{t('workflow.programMeta')}</p>
            </div>
            <Badge variant="accent">{t('workflow.assigned')}</Badge>
          </div>
          <div className="mb-4 grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={day} className={`rounded-md border border-[var(--border)] px-2 py-2 text-center text-xs font-semibold ${index === 0 ? 'bg-white/[0.08] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-2">
              {exercises.map(([name, meta, sets, reps, rest], index) => (
                <div key={name} className="grid items-center gap-3 rounded-lg border border-[var(--border)] bg-white/[0.035] p-3 sm:grid-cols-[28px_minmax(0,1fr)_repeat(3,64px)]">
                  <span className="text-xs text-[var(--text-muted)]">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{meta}</p>
                  </div>
                  <MiniField label={t('workflow.fields.sets')} value={sets} />
                  <MiniField label={t('workflow.fields.reps')} value={reps} />
                  <MiniField label={t('workflow.fields.rest')} value={rest} />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-black/20 p-3">
              <p className="text-sm font-semibold">{t('workflow.catalog')}</p>
              <div className="mt-3 space-y-2">
                {catalogItems.map((item) => (
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
  const { t } = useTranslation('landing')
  const insights = [
    { key: 'mrr', icon: Wallet },
    { key: 'active', icon: Users },
    { key: 'retention', icon: Activity },
    { key: 'week', icon: Calendar },
  ] as const

  return (
    <section id="analytics" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow={t('analytics.eyebrow')} title={t('analytics.title')} text={t('analytics.text')} />
        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {insights.map(({ key, icon }) => (
            <InsightCard
              key={key}
              icon={icon}
              label={t(`analytics.insights.${key}.label`)}
              value={t(`analytics.insights.${key}.value`)}
              trend={t(`analytics.insights.${key}.trend`)}
            />
          ))}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ChartPanel title={t('analytics.charts.retention.title')} subtitle={t('analytics.charts.retention.subtitle')}>
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
          <ChartPanel title={t('analytics.charts.attendance.title')} subtitle={t('analytics.charts.attendance.subtitle')}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={mockAttendanceData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="week" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [v, t('analytics.charts.attendance.tooltip')]} />
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
  const { t } = useTranslation('landing')
  const blocks = asStringArray(t('mobile.blocks', { returnObjects: true }))

  return (
    <section className="border-y border-[var(--border)] bg-[var(--graphite)] px-5 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionIntro eyebrow={t('mobile.eyebrow')} title={t('mobile.title')} text={t('mobile.text')} />
        <motion.div {...fade} className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <PhoneMock title={t('mobile.today')} primary={t('mobile.workoutA')} meta={t('mobile.workoutMeta')} progress="68%" blocks={blocks} />
          <PhoneMock title={t('mobile.progress')} primary={t('mobile.mockWeight')} meta={t('mobile.progressMeta')} progress="82%" blocks={blocks} secondary />
        </motion.div>
      </div>
    </section>
  )
}

function PhoneMock({ title, primary, meta, progress, blocks, secondary }: { title: string; primary: string; meta: string; progress: string; blocks: string[]; secondary?: boolean }) {
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
          {blocks.map((item, index) => (
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
  const { t } = useTranslation('landing')

  return (
    <section id="pricing" className="px-5 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-[1000px] text-center">
        <SectionIntro eyebrow={t('pricing.eyebrow')} title={t('pricing.title')} text={t('pricing.text')} center />
        <div className="mt-14 gap-grid grid-cols-1 lg:grid-cols-3">
          {PLAN_KEYS.map((key) => {
            const price = PLAN_PRICES[key]
            const popular = key === 'pro'
            const priceLabel = t(`pricing.plans.${key}.priceLabel`, { defaultValue: '' })
            const features = asStringArray(t(`pricing.plans.${key}.features`, { returnObjects: true }))
            const disabledRaw = t(`pricing.plans.${key}.disabled`, { returnObjects: true, defaultValue: [] })
            const disabled = asStringArray(disabledRaw)

            return (
              <motion.div
                key={key}
                {...fade}
                className={`gap-grid-cell relative p-9 text-left ${popular ? 'bg-[#0d1a07]' : ''}`}
              >
                {popular && (
                  <Badge variant="accent" className="absolute right-4 top-4 uppercase">
                    {t('pricing.popular')}
                  </Badge>
                )}
                <p className="font-display text-sm font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                  {t(`pricing.plans.${key}.name`)}
                </p>
                <p className="font-display mt-4 text-[48px] font-extrabold leading-none tracking-tight">
                  {priceLabel || formatRub(price)}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{t(`pricing.plans.${key}.period`)}</p>
                <ul className="mt-7 space-y-0">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 border-b border-[var(--border)] py-2 text-[13px] text-[var(--text-secondary)]">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                      {feature}
                    </li>
                  ))}
                  {disabled.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 border-b border-[var(--border)] py-2 text-[13px] text-[var(--text-muted)]">
                      <span className="text-[var(--text-muted)]">—</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-7 w-full" variant={popular ? 'default' : 'secondary'} asChild>
                  <Link to="/register/trainer">{t(`pricing.plans.${key}.cta`)}</Link>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  const { t } = useTranslation('landing')
  const features = asStringArray(t('cta.features', { returnObjects: true }))
  const featureIcons = [ShieldCheck, MessageSquare, CreditCard] as const

  return (
    <section className="px-5 pb-24 sm:px-6 lg:px-8">
      <motion.div
        {...fade}
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(184,245,61,0.12),rgba(22,22,22,0.72)_38%,rgba(8,8,8,0.95))] p-8 shadow-[var(--shadow-soft)] sm:p-10"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="label-caps">{t('cta.eyebrow')}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t('cta.title')}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{t('cta.text')}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button size="lg" asChild>
              <Link to="/register/trainer">{t('cta.create')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login/trainer">{t('cta.demo')}</Link>
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
          {features.map((label, index) => {
            const Icon = featureIcons[index] ?? ShieldCheck
            return (
              <div key={label} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Icon className="h-4 w-4 text-[var(--accent)]" />
                {label}
              </div>
            )
          })}
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
