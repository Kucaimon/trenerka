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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockCalendarEvents } from '@/lib/mock-data'
import { formatLongDate } from '@/lib/i18n-format'
import { cn, formatRub } from '@/lib/utils'

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
} as const

const SECTION_PY = 'px-5 py-16 md:py-20 sm:px-10'
const WORKFLOW_ICONS = [Users, Activity, Calendar, BarChart3, TrendingUp] as const
const BENEFIT_ICONS = [Calendar, TrendingUp, Wallet, MessageSquare] as const
const PLAN_KEYS = ['basic', 'pro', 'vip'] as const
const PLAN_PRICES = { basic: 0, pro: 2490, vip: 5990 } as const
const PREVIEW_STAT_KEYS = ['activeClients', 'monthlyIncome', 'sessions', 'retention'] as const

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

function asStatTuple(value: unknown): [string, string] | null {
  if (!Array.isArray(value) || value.length < 2) return null
  return [String(value[0]), String(value[1])]
}

type CrmRow = { name: string; payment: string; paymentKey: string; next: string }

export function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen overflow-x-hidden bg-[var(--black)] text-[var(--text-primary)]"
    >
      <SiteHeader />
      <main className="pt-[60px]">
        <HeroSection />
        <BenefitsSection />
        <WorkflowSection />
        <TrainerExperienceSection />
        <ClientExperienceSection />
        <PricingSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </motion.div>
  )
}

function HeroSection() {
  const { t } = useTranslation('landing')

  return (
    <section className={cn('concept-hero', SECTION_PY, 'pt-10 sm:pt-14')}>
      <motion.div {...fade} className="mx-auto max-w-[1200px]">
        <h1 className="ds-h1 max-w-3xl">
          {t('hero.headline')}{' '}
          <span className="text-[var(--accent)]">{t('hero.headlineAccent')}</span>
        </h1>
        <p className="ds-body mt-4 max-w-xl text-[var(--text-secondary)]">{t('hero.subtitle')}</p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" asChild>
            <Link to="/register/trainer">{t('hero.ctaPrimary')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login/trainer">{t('hero.ctaSecondary')}</Link>
          </Button>
        </motion.div>
        <p className="ds-caption mt-3 text-[var(--text-muted)]">{t('hero.note')}</p>
        <HeroProductMock />
      </motion.div>
    </section>
  )
}

function HeroProductMock() {
  const { t } = useTranslation('landing')
  const sidebar = asStringArray(t('preview.sidebar', { returnObjects: true }))
  const previewDate = formatLongDate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.45 }}
      className="saas-product-mock saas-product-mock--hero mt-8"
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
        transition={{ delay: 0.28, duration: 0.4 }}
        className="saas-product-mock__body"
      >
        <aside className="saas-product-mock__sidebar">
          {sidebar.slice(0, 5).map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32 + i * 0.04 }}
              className={cn('saas-product-mock__nav-item', i === 0 && 'saas-product-mock__nav-item--active')}
            >
              {label}
            </motion.div>
          ))}
        </aside>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="saas-product-mock__content"
        >
          <p className="font-display text-base font-bold">{t('preview.greeting')}</p>
          <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">{t('preview.dateLine', { date: previewDate })}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PREVIEW_STAT_KEYS.map((key) => {
              const stat = asStatTuple(t(`preview.stats.${key}`, { returnObjects: true }))
              if (!stat) return null
              const [label, val] = stat
              return (
                <motion.div key={key} className="rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
                  <p className="font-display mt-1 text-lg font-extrabold">{val}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function BenefitsSection() {
  const { t } = useTranslation('landing')
  const cards = t('benefits.cards', { returnObjects: true }) as Array<{ title: string; text: string }>

  return (
    <section id="benefits" className={SECTION_PY}>
      <motion.div {...fade} className="mx-auto max-w-[1200px]">
        <SectionIntro eyebrow={t('benefits.eyebrow')} title={t('benefits.title')} text={t('benefits.text')} />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = BENEFIT_ICONS[index] ?? Activity
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface2)]">
                  <Icon className="h-4 w-4 text-[var(--accent)]" />
                </div>
                <p className="text-sm font-semibold">{card.title}</p>
                <p className="ds-caption mt-1 text-[var(--text-secondary)]">{card.text}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

function PricingSection() {
  const { t } = useTranslation('landing')

  return (
    <section id="pricing" className={cn('border-y border-[var(--border)] bg-[var(--graphite)]', SECTION_PY)}>
      <motion.div {...fade} className="mx-auto max-w-[1000px] text-center">
        <SectionIntro
          eyebrow={t('pricing.eyebrow')}
          title={t('pricing.title')}
          text={t('pricing.text')}
          center
        />
        <div className="mt-10 grid gap-3 text-left lg:grid-cols-3">
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
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  'relative rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-6',
                  popular && 'border-[var(--border-strong)] bg-[#0d1a07]',
                )}
              >
                {popular ? (
                  <Badge variant="accent" className="absolute right-4 top-4 uppercase">
                    {t('pricing.popular')}
                  </Badge>
                ) : null}
                <p className="text-sm font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                  {t(`pricing.plans.${key}.name`)}
                </p>
                <p className="font-display mt-4 text-4xl font-extrabold leading-none tracking-tight">
                  {priceLabel || formatRub(price)}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{t(`pricing.plans.${key}.period`)}</p>
                <ul className="mt-6 space-y-0">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 border-b border-[var(--border)] py-2 text-[13px] text-[var(--text-secondary)]"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                      {feature}
                    </li>
                  ))}
                  {disabled.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 border-b border-[var(--border)] py-2 text-[13px] text-[var(--text-muted)]"
                    >
                      <span>—</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={popular ? 'default' : 'secondary'} asChild>
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

function WorkflowSection() {
  const { t } = useTranslation('landing')
  const steps = t('workflow.steps', { returnObjects: true }) as Array<{ title: string; text: string }>

  return (
    <section id="product" className={cn('border-y border-[var(--border)] bg-[var(--graphite)]', SECTION_PY)}>
      <motion.div {...fade} className="mx-auto max-w-[1200px]">
        <SectionIntro eyebrow={t('workflow.eyebrow')} title={t('workflow.title')} text={t('workflow.text')} />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {steps.map((step, index) => {
            const Icon = WORKFLOW_ICONS[index] ?? Activity
            return (
              <motion.div
                key={step.title}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="relative rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                {index < steps.length - 1 ? (
                  <span
                    className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-[var(--border-strong)] lg:block"
                    aria-hidden
                  />
                ) : null}
                <motion.div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface2)]">
                  <Icon className="h-4 w-4 text-[var(--accent)]" />
                </motion.div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="ds-caption mt-1 text-[var(--text-secondary)]">{step.text}</p>
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
  const paymentVariant = (key: string) =>
    key === 'paid' ? 'success' : key === 'overdue' ? 'destructive' : ('warning' as const)

  return (
    <section className={SECTION_PY}>
      <motion.div {...fade} className="mx-auto max-w-[1200px]">
        <SectionIntro eyebrow={t('trainerPreview.eyebrow')} title={t('trainerPreview.title')} text={t('trainerPreview.text')} />
        <div className="saas-product-mock mt-8">
          <div className="saas-product-mock__chrome">
            <span className="saas-product-mock__dot" style={{ background: '#ff5f57' }} />
            <span className="saas-product-mock__dot" style={{ background: '#febc2e' }} />
            <span className="saas-product-mock__dot" style={{ background: '#28c840' }} />
            <span className="saas-product-mock__title">{t('trainerPreview.windowTitle')}</span>
          </div>
          <div className="saas-product-mock__body min-h-[280px]">
            <div className="saas-product-mock__content grid gap-4 p-4 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-3"
              >
                <p className="text-sm font-semibold">{t('trainerPreview.crmTitle')}</p>
                <div className="mt-2 divide-y divide-[var(--border)]">
                  {rows.map((row) => (
                    <motion.div
                      key={row.name}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-between gap-2 py-2 text-[13px] first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{row.name}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{row.next}</p>
                      </div>
                      <Badge variant={paymentVariant(row.paymentKey)} className="shrink-0 text-[10px]">
                        {row.payment}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="space-y-3"
              >
                <motion.div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-3">
                  <p className="text-sm font-semibold">{t('preview.scheduleTitle')}</p>
                  <div className="mt-2 space-y-1.5">
                    {mockCalendarEvents.slice(0, 3).map((e) => (
                      <div key={e.id} className="flex gap-2 border-b border-[var(--border)] py-2 last:border-0">
                        <span className="text-[11px] text-[var(--text-muted)]">10:00</span>
                        <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
                        <p className="text-[13px] font-medium">{e.title}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-3">
                  <p className="text-sm font-semibold">{t('trainerPreview.analyticsTitle')}</p>
                  <motion.div className="mt-3 grid grid-cols-2 gap-2">
                    {PREVIEW_STAT_KEYS.slice(2, 4).map((key) => {
                      const stat = asStatTuple(t(`preview.stats.${key}`, { returnObjects: true }))
                      if (!stat) return null
                      const [label, val] = stat
                      return (
                        <motion.div key={key} className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-2.5">
                          <p className="text-[9px] uppercase text-[var(--text-muted)]">{label}</p>
                          <p className="mt-0.5 text-base font-bold">{val}</p>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </motion.div>
              </motion.div>
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
    <section className={cn('border-y border-[var(--border)] bg-[var(--graphite)]', SECTION_PY)}>
      <motion.div {...fade} className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1fr_auto]">
        <SectionIntro eyebrow={t('clientPreview.eyebrow')} title={t('clientPreview.title')} text={t('clientPreview.text')} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-[272px] rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface)] p-2"
        >
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--black)] p-4">
            <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-white/20" />
            <p className="text-sm font-semibold">{t('clientPreview.greeting')}</p>
            <div className="mt-3 flex gap-2">
              {widgets.map((label) => (
                <span
                  key={label}
                  className="flex-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface2)] px-2 py-1.5 text-center text-[10px] font-medium text-[var(--text-secondary)]"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] px-3 py-2">
              <Flame className="h-4 w-4 text-[var(--accent)]" />
              <div>
                <p className="text-[10px] uppercase text-[var(--text-muted)]">{t('clientPreview.streakLabel')}</p>
                <p className="text-sm font-bold">{t('clientPreview.streakValue')}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] uppercase text-[var(--text-muted)]">{t('clientPreview.weekLabel')}</p>
                <p className="text-sm font-bold">{t('clientPreview.weekValue')}</p>
              </div>
            </div>
            <div className="mt-3 rounded-[8px] border border-[var(--border-strong)] bg-[var(--accent-dim)]/30 p-3">
              <p className="text-[10px] uppercase text-[var(--text-muted)]">{t('clientPreview.today')}</p>
              <p className="mt-1 text-base font-bold">{t('clientPreview.workoutTitle')}</p>
              <p className="text-[12px] text-[var(--text-secondary)]">{t('clientPreview.workoutMeta')}</p>
            </div>
            <div className="mt-2 space-y-1.5">
              {exercises.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-[6px] border border-[var(--border)] px-2.5 py-2 text-[12px]"
                >
                  <span>{item}</span>
                  {index === 0 ? <Check className="h-3.5 w-3.5 text-[var(--accent)]" /> : null}
                </div>
              ))}
            </div>
            <motion.div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <MessageSquare className="h-3.5 w-3.5" />
              {t('clientPreview.chatHint')}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function CtaSection() {
  const { t } = useTranslation('landing')

  return (
    <section className={cn(SECTION_PY, 'pb-20')}>
      <motion.div
        {...fade}
        className="mx-auto max-w-3xl rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-6 py-8 text-center sm:px-10"
      >
        <h2 className="ds-h2">{t('cta.title')}</h2>
        <p className="ds-body mx-auto mt-2 max-w-lg text-[var(--text-secondary)]">{t('cta.text')}</p>
        <motion.div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/register/trainer">{t('cta.create')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login/trainer">{t('cta.demo')}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}

function SectionIntro({ eyebrow, title, text, center }: { eyebrow: string; title: string; text: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="ds-label text-[var(--text-muted)]">{eyebrow}</p>
      <h2 className="ds-h2 mt-2">{title}</h2>
      <p className={cn('ds-body mt-2 text-[var(--text-secondary)]', center && 'mx-auto')}>{text}</p>
    </div>
  )
}
