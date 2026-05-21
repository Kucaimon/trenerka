import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  Calendar,
  Check,
  Flame,
  MessageSquare,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatLongDate } from '@/lib/i18n-format'
import { cn, formatRub } from '@/lib/utils'

const fade = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
} as const

const WORKFLOW_ICONS = [Users, Activity, Calendar, BarChart3, TrendingUp] as const
const BENEFIT_ICONS = [Calendar, TrendingUp, Wallet, MessageSquare] as const
const PLAN_KEYS = ['basic', 'pro', 'vip'] as const
const PLAN_PRICES = { basic: 0, pro: 2490, vip: 5990 } as const
function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

type CrmRow = { name: string; payment: string; paymentKey: string; next: string }
type ScheduleEvent = { time: string; title: string }

export function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen overflow-x-hidden bg-[var(--black)] text-[var(--text-primary)]"
    >
      <SiteHeader />
      <main className="pt-[54px]">
        <HeroSection />
        <ProblemsSection />
        <WorkflowSection />
        <BenefitsSection />
        <TestimonialsSection />
        <TrainerExperienceSection />
        <ClientExperienceSection />
        <PricingSection />
        <CtaSection />
      </main>
      <SiteFooter />
      <ScrollToTop />
    </motion.div>
  )
}

function HeroSection() {
  const { t } = useTranslation('landing')

  return (
    <section className="concept-hero concept-landing-section">
      <div className="concept-landing-inner">
        <div className="concept-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="concept-hero-copy"
          >
            <h1 className="ds-h1 max-w-xl text-[clamp(1.75rem,4vw,2.25rem)]">
              {t('hero.headline')}{' '}
              <span className="text-[var(--accent)]">{t('hero.headlineAccent')}</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              {t('hero.subtitle')}
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="mt-5 flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button size="default" className="touch-target h-11 flex-1 px-4 text-sm font-semibold sm:flex-none sm:h-9" asChild>
                  <Link to="/login/client">{t('hero.entryClient')}</Link>
                </Button>
                <Button
                  size="default"
                  variant="secondary"
                  className="touch-target h-11 flex-1 px-4 text-sm font-semibold sm:flex-none sm:h-9"
                  asChild
                >
                  <Link to="/login/trainer">{t('hero.entryTrainer')}</Link>
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="touch-target h-11 flex-1 border-[var(--accent)]/35 px-4 text-sm font-semibold text-[var(--accent)] sm:flex-none sm:h-9"
                  asChild
                >
                  <Link to="/login/smart-fitness">{t('hero.entrySmartFitness')}</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="default" className="h-9 px-4 text-sm font-semibold" asChild>
                  <Link to="/register/trainer">{t('hero.ctaPrimary')}</Link>
                </Button>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {t('hero.ctaSecondary')} →
                </Link>
              </div>
            </motion.div>
            <p className="mt-2.5 text-xs text-[var(--text-muted)]">{t('hero.note')}</p>
          </motion.div>
          <HeroProductMock />
        </div>
      </div>
    </section>
  )
}

function HeroProductMock() {
  const { t } = useTranslation('landing')
  const sidebar = asStringArray(t('preview.sidebar', { returnObjects: true }))
  const previewDate = formatLongDate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.4 }}
      className="saas-product-mock saas-product-mock--hero concept-hero-mock"
    >
      <div className="saas-product-mock__chrome">
        <span className="saas-product-mock__dot" style={{ background: '#ff5f57' }} />
        <span className="saas-product-mock__dot" style={{ background: '#febc2e' }} />
        <span className="saas-product-mock__dot" style={{ background: '#28c840' }} />
        <span className="saas-product-mock__title">{t('preview.windowTitle')}</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="saas-product-mock__body"
      >
        <aside className="saas-product-mock__sidebar">
          {sidebar.slice(0, 5).map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 + i * 0.03 }}
              className={cn('saas-product-mock__nav-item', i === 0 && 'saas-product-mock__nav-item--active')}
            >
              {label}
            </motion.div>
          ))}
        </aside>
        <div className="saas-product-mock__content">
          <p className="font-display text-sm font-bold">{t('preview.greeting')}</p>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {t('preview.dateLine', { date: previewDate })}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">{t('preview.summary')}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProblemsSection() {
  const { t } = useTranslation('landing')
  const items = t('problems.items', { returnObjects: true }) as Array<{ title: string; text: string }>

  return (
    <section className="concept-landing-section border-b border-[var(--border)]">
      <motion.div {...fade} className="concept-landing-inner">
        <SectionIntro eyebrow={t('problems.eyebrow')} title={t('problems.title')} text={t('problems.text')} />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function TestimonialsSection() {
  const { t } = useTranslation('landing')
  const items = t('testimonials.items', { returnObjects: true }) as Array<{
    quote: string
    author: string
    role: string
  }>

  return (
    <section className="concept-landing-section border-y border-[var(--border)] bg-[var(--graphite)]">
      <motion.div {...fade} className="concept-landing-inner">
        <SectionIntro
          eyebrow={t('testimonials.eyebrow')}
          title={t('testimonials.title')}
          text={t('testimonials.betaLabel')}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <figure key={item.author} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
              <Badge variant="secondary" className="mb-3 text-[10px]">
                {t('testimonials.betaLabel')}
              </Badge>
              <blockquote className="text-sm leading-relaxed text-[var(--text-secondary)]">
                «{item.quote}»
              </blockquote>
              <figcaption className="mt-4 text-xs">
                <p className="font-semibold text-[var(--text-primary)]">{item.author}</p>
                <p className="text-[var(--text-muted)]">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function WorkflowSection() {
  const { t } = useTranslation('landing')
  const steps = t('workflow.steps', { returnObjects: true }) as Array<{ title: string; text: string }>

  return (
    <section id="product" className="concept-landing-section border-y border-[var(--border)] bg-[var(--graphite)]">
      <motion.div {...fade} className="concept-landing-inner">
        <SectionIntro eyebrow={t('workflow.eyebrow')} title={t('workflow.title')} text={t('workflow.text')} />
        <ol className="concept-workflow-rail mt-8">
          {steps.map((step, index) => {
            const Icon = WORKFLOW_ICONS[index] ?? Activity
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className="concept-workflow-step"
              >
                <motion.div className="concept-workflow-step__icon" aria-hidden>
                  <Icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                </motion.div>
                <p className="concept-workflow-step__title">{step.title}</p>
                <p className="concept-workflow-step__text">{step.text}</p>
              </motion.li>
            )
          })}
        </ol>
      </motion.div>
    </section>
  )
}

function BenefitsSection() {
  const { t } = useTranslation('landing')
  const cards = t('benefits.cards', { returnObjects: true }) as Array<{ title: string; text: string }>

  return (
    <section id="benefits" className="concept-landing-section">
      <motion.div {...fade} className="concept-landing-inner">
        <SectionIntro eyebrow={t('benefits.eyebrow')} title={t('benefits.title')} text={t('benefits.text')} />
        <motion.div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = BENEFIT_ICONS[index] ?? Activity
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className="flex gap-3 bg-[var(--surface)] p-4 sm:p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface2)]">
                  <Icon className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={2} />
                </div>
                <motion.div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug">{card.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{card.text}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}

function TrainerExperienceSection() {
  const { t } = useTranslation('landing')
  const rows = t('trainerPreview.rows', { returnObjects: true }) as CrmRow[]
  const scheduleEvents = t('preview.scheduleEvents', { returnObjects: true }) as ScheduleEvent[]
  const paymentVariant = (key: string) =>
    key === 'paid' ? 'success' : key === 'overdue' ? 'destructive' : ('warning' as const)

  return (
    <section className="concept-landing-section border-t border-[var(--border)]">
      <motion.div {...fade} className="concept-landing-inner">
        <SectionIntro
          eyebrow={t('trainerPreview.eyebrow')}
          title={t('trainerPreview.title')}
          text={t('trainerPreview.text')}
        />
        <div className="saas-product-mock saas-product-mock--compact mt-6 max-w-3xl">
          <div className="saas-product-mock__chrome">
            <span className="saas-product-mock__dot" style={{ background: '#ff5f57' }} />
            <span className="saas-product-mock__dot" style={{ background: '#febc2e' }} />
            <span className="saas-product-mock__dot" style={{ background: '#28c840' }} />
            <span className="saas-product-mock__title">{t('trainerPreview.windowTitle')}</span>
          </div>
          <div className="grid divide-y divide-[var(--border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-3 sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {t('trainerPreview.crmTitle')}
              </p>
              <div className="mt-2 divide-y divide-[var(--border)]">
                {rows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between gap-2 py-2 text-[13px] first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{row.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{row.next}</p>
                    </div>
                    <Badge variant={paymentVariant(row.paymentKey)} className="shrink-0 text-[10px]">
                      {row.payment}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {t('preview.scheduleTitle')}
              </p>
              <div className="mt-2 space-y-0">
                {scheduleEvents.slice(0, 4).map((e) => (
                  <motion.div
                    key={`${e.time}-${e.title}`}
                    className="flex items-center gap-2 border-b border-[var(--border)] py-2 last:border-0"
                  >
                    <span className="w-9 shrink-0 text-[11px] tabular-nums text-[var(--text-muted)]">
                      {e.time}
                    </span>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <p className="truncate text-[13px] font-medium">{e.title}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function ClientExperienceSection() {
  const { t } = useTranslation('landing')
  const exercises = asStringArray(t('clientPreview.exercises', { returnObjects: true }))
  const widgets = asStringArray(t('clientPreview.widgets', { returnObjects: true }))

  return (
    <section
      id="client-preview"
      className="concept-landing-section border-y border-[var(--border)] bg-[var(--graphite)]"
    >
      <motion.div {...fade} className="concept-landing-inner">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
          <SectionIntro
            eyebrow={t('clientPreview.eyebrow')}
            title={t('clientPreview.title')}
            text={t('clientPreview.text')}
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="concept-client-phone mx-auto w-full max-w-[240px]"
          >
            <div className="concept-client-phone__frame">
              <motion.div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-white/15" />
              <p className="text-sm font-semibold">{t('clientPreview.greeting')}</p>
              <div className="mt-2.5 flex gap-1.5">
                {widgets.map((label) => (
                  <span
                    key={label}
                    className="flex-1 rounded border border-[var(--border)] bg-[var(--surface2)] px-1.5 py-1 text-center text-[9px] font-medium text-[var(--text-secondary)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-2.5 flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface2)] px-2.5 py-2">
                <Flame className="h-3.5 w-3.5 text-[var(--accent)]" />
                <div>
                  <p className="text-[9px] uppercase text-[var(--text-muted)]">{t('clientPreview.streakLabel')}</p>
                  <p className="text-xs font-bold">{t('clientPreview.streakValue')}</p>
                </div>
                <motion.div className="ml-auto text-right">
                  <p className="text-[9px] uppercase text-[var(--text-muted)]">{t('clientPreview.weekLabel')}</p>
                  <p className="text-xs font-bold">{t('clientPreview.weekValue')}</p>
                </motion.div>
              </div>
              <div className="mt-2.5 rounded-md border border-[var(--border)] bg-[var(--accent-dim)]/20 px-2.5 py-2">
                <p className="text-[9px] uppercase text-[var(--text-muted)]">{t('clientPreview.today')}</p>
                <p className="mt-0.5 text-sm font-bold">{t('clientPreview.workoutTitle')}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{t('clientPreview.workoutMeta')}</p>
              </div>
              <div className="mt-2 space-y-1">
                {exercises.slice(0, 3).map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded border border-[var(--border)] px-2 py-1.5 text-[11px]"
                  >
                    <span>{item}</span>
                    {index === 0 ? <Check className="h-3 w-3 text-[var(--accent)]" /> : null}
                  </div>
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                <MessageSquare className="h-3 w-3" />
                {t('clientPreview.chatHint')}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function PricingSection() {
  const { t } = useTranslation('landing')

  return (
    <section id="pricing" className="concept-landing-section">
      <motion.div {...fade} className="concept-landing-inner max-w-[1000px]">
        <SectionIntro
          eyebrow={t('pricing.eyebrow')}
          title={t('pricing.title')}
          text={t('pricing.text')}
          center
        />
        <div className="mt-8 grid gap-3 lg:grid-cols-3">
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
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5',
                  popular && 'border-[var(--border-strong)] ring-1 ring-[var(--accent)]/15',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {t(`pricing.plans.${key}.name`)}
                  </p>
                  {popular ? (
                    <span className="rounded-full border border-[var(--accent)]/25 bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                      {t('pricing.popular')}
                    </span>
                  ) : null}
                </div>
                <p className="font-display mt-3 text-3xl font-extrabold leading-none tracking-tight">
                  {priceLabel || formatRub(price)}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{t(`pricing.plans.${key}.period`)}</p>
                <ul className="mt-4 flex-1 space-y-0 border-t border-[var(--border)] pt-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 py-1.5 text-xs text-[var(--text-secondary)]"
                    >
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-[var(--accent)]" />
                      {feature}
                    </li>
                  ))}
                  {disabled.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 py-1.5 text-xs text-[var(--text-muted)]">
                      <span className="mt-0.5 w-3 shrink-0 text-center">—</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 h-9 w-full text-sm"
                  variant={popular ? 'default' : 'secondary'}
                  asChild
                >
                  <Link to="/register/trainer">{t(`pricing.plans.${key}.cta`)}</Link>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

function CtaSection() {
  const { t } = useTranslation('landing')

  return (
    <section className="concept-landing-cta">
      <motion.div
        {...fade}
        className="concept-landing-inner flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:text-left"
      >
        <div>
          <h2 className="ds-h2 text-lg">{t('cta.title')}</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('cta.text')}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button size="default" className="h-9 px-4 text-sm" asChild>
            <Link to="/register/trainer">{t('cta.create')}</Link>
          </Button>
          <Button size="default" variant="outline" className="h-9 px-4 text-sm" asChild>
            <Link to="/login">{t('cta.login')}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

function SectionIntro({
  eyebrow,
  title,
  text,
  center,
}: {
  eyebrow: string
  title: string
  text: string
  center?: boolean
}) {
  return (
    <motion.div className={cn('max-w-xl', center && 'mx-auto text-center')}>
      <p className="ds-label">{eyebrow}</p>
      <h2 className="ds-h2 mt-1.5">{title}</h2>
      <p className={cn('mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]', center && 'mx-auto')}>
        {text}
      </p>
    </motion.div>
  )
}
