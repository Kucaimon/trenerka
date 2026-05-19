import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  Calendar,
  Check,
  Dumbbell,
  MessageSquare,
  Users,
} from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Button } from '@/components/ui/button'
import { mockCalendarEvents, mockClients } from '@/lib/mock-data'
import { formatLongDate } from '@/lib/i18n-format'
import { cn } from '@/lib/utils'

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
} as const

const WORKFLOW_ICONS = [Users, Dumbbell, Calendar, BarChart3] as const
const PREVIEW_STAT_KEYS = ['activeClients', 'monthlyIncome', 'sessions', 'retention'] as const

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

function asStatTuple(value: unknown): [string, string] | null {
  if (!Array.isArray(value) || value.length < 2) return null
  return [String(value[0]), String(value[1])]
}

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
        <WorkflowSection />
        <DashboardShowcaseSection />
        <EcosystemSection />
        <MobileSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </motion.div>
  )
}

function HeroSection() {
  const { t } = useTranslation('landing')

  return (
    <section className="concept-hero px-5 pb-12 pt-10 sm:px-10 sm:pb-16 sm:pt-14">
      <motion.div {...fade} className="mx-auto max-w-[1200px]">
        <p className="ds-label text-[var(--text-muted)]">{t('hero.badge')}</p>
        <h1 className="ds-h1 mt-3 max-w-3xl">
          {t('hero.title1')} {t('hero.title2')}{' '}
          <span className="text-[var(--accent)]">{t('hero.titleAccent')}</span>
        </h1>
        <p className="ds-body mt-4 max-w-xl text-[var(--text-secondary)]">{t('hero.subtitle')}</p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" asChild>
            <Link to="/register/trainer">{t('hero.ctaPrimary')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login/trainer">{t('hero.ctaSecondary')}</Link>
          </Button>
        </motion.div>
        <p className="ds-caption mt-4 text-[var(--text-muted)]">{t('hero.note')}</p>
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
      className="saas-product-mock saas-product-mock--hero mt-10"
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
        <div className="saas-product-mock__content">
          <p className="font-display text-base font-bold">{t('preview.greeting')}</p>
          <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">{t('preview.dateLine', { date: previewDate })}</p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
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
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function WorkflowSection() {
  const { t } = useTranslation('landing')
  const steps = t('workflow.steps', { returnObjects: true }) as Array<{ title: string; text: string }>

  return (
    <section id="product" className="border-y border-[var(--border)] bg-[var(--graphite)] px-5 py-12 sm:px-10 sm:py-16">
      <motion.div {...fade} className="mx-auto max-w-[1200px]">
        <SectionIntro eyebrow={t('workflow.eyebrow')} title={t('workflow.title')} text={t('workflow.text')} />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = WORKFLOW_ICONS[index] ?? Activity
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                className="relative rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                {index < steps.length - 1 ? (
                  <span
                    className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-[var(--border-strong)] lg:block"
                    aria-hidden
                  />
                ) : null}
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface2)]">
                  <Icon className="h-4 w-4 text-[var(--accent)]" />
                </div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="ds-caption mt-1 text-[var(--text-secondary)]">{step.text}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

function DashboardShowcaseSection() {
  const { t } = useTranslation('landing')
  const sidebar = asStringArray(t('preview.sidebar', { returnObjects: true }))
  const previewDate = formatLongDate()

  return (
    <section className="px-5 py-12 sm:px-10 sm:py-16">
      <motion.div {...fade} className="mx-auto max-w-[1200px]">
        <SectionIntro eyebrow={t('showcase.eyebrow')} title={t('showcase.title')} text={t('showcase.text')} />
        <div className="saas-product-mock mt-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="saas-product-mock__chrome"
          >
            <span className="saas-product-mock__dot" style={{ background: '#ff5f57' }} />
            <span className="saas-product-mock__dot" style={{ background: '#febc2e' }} />
            <span className="saas-product-mock__dot" style={{ background: '#28c840' }} />
            <span className="saas-product-mock__title">{t('preview.windowTitle')}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="saas-product-mock__body min-h-[360px]"
          >
            <aside className="saas-product-mock__sidebar">
              {sidebar.map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                  className={cn('saas-product-mock__nav-item', i === 0 && 'saas-product-mock__nav-item--active')}
                >
                  {label}
                </motion.div>
              ))}
            </aside>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="saas-product-mock__content"
            >
              <p className="font-display text-lg font-bold">{t('preview.greeting')}</p>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{t('preview.dateLine', { date: previewDate })}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {PREVIEW_STAT_KEYS.map((key) => {
                  const stat = asStatTuple(t(`preview.stats.${key}`, { returnObjects: true }))
                  if (!stat) return null
                  const [label, val] = stat
                  return (
                    <div key={key} className="rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-3">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
                      <p className="font-display mt-1 text-xl font-extrabold">{val}</p>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-3">
                  <p className="text-sm font-semibold">{t('preview.activeClientsTitle')}</p>
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                    className="mt-2 space-y-1.5"
                  >
                    {mockClients.slice(0, 3).map((c) => (
                      <motion.div
                        key={c.id}
                        variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
                        className="flex items-center gap-2 border-b border-[var(--border)] py-2 last:border-0"
                      >
                        <motion.div
                          initial={{ scale: 0.8 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--accent-dim)] text-[10px] font-bold"
                        >
                          {c.name.slice(0, 1)}
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{c.name}</p>
                          <p className="text-[11px] text-[var(--text-muted)]">{c.goal}</p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-3"
                >
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
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function EcosystemSection() {
  const { t } = useTranslation('landing')
  const [tab, setTab] = useState<'trainer' | 'client'>('trainer')

  return (
    <section className="border-y border-[var(--border)] bg-[var(--graphite)] px-5 py-12 sm:px-10 sm:py-16">
      <motion.div {...fade} className="mx-auto max-w-[1200px]">
        <SectionIntro eyebrow={t('ecosystem.eyebrow')} title={t('ecosystem.title')} text={t('ecosystem.text')} />
        <motion.div className="mt-8 flex gap-2 lg:hidden">
          {(['trainer', 'client'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'rounded-[8px] border px-4 py-2 text-sm font-medium transition-colors',
                tab === key
                  ? 'border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--text-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              )}
            >
              {t(`ecosystem.${key}Tab`)}
            </button>
          ))}
        </motion.div>
        <div className="mt-6 hidden gap-4 lg:grid lg:grid-cols-2">
          <MiniTrainerMock />
          <MiniClientMock />
        </div>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-6 lg:hidden"
        >
          {tab === 'trainer' ? <MiniTrainerMock /> : <MiniClientMock />}
        </motion.div>
      </motion.div>
    </section>
  )
}

function MiniTrainerMock({ className }: { className?: string }) {
  const { t } = useTranslation('landing')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('saas-product-mock', className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="saas-product-mock__chrome"
      >
        <span className="saas-product-mock__dot" style={{ background: '#ff5f57' }} />
        <span className="saas-product-mock__dot" style={{ background: '#febc2e' }} />
        <span className="saas-product-mock__dot" style={{ background: '#28c840' }} />
        <span className="saas-product-mock__title">{t('preview.windowTitle')}</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.06 }}
        className="saas-product-mock__body min-h-[220px]"
      >
        <div className="saas-product-mock__content p-4">
          <p className="text-sm font-semibold">{t('ecosystem.trainerGreeting')}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {PREVIEW_STAT_KEYS.slice(0, 2).map((key) => {
              const stat = asStatTuple(t(`preview.stats.${key}`, { returnObjects: true }))
              if (!stat) return null
              const [label, val] = stat
              return (
                <div key={key} className="rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-2.5">
                  <p className="text-[9px] uppercase text-[var(--text-muted)]">{label}</p>
                  <p className="mt-0.5 text-base font-bold">{val}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-2.5">
            <p className="text-xs font-semibold">{t('preview.scheduleTitle')}</p>
            <p className="mt-1 text-[12px] text-[var(--text-secondary)]">{mockCalendarEvents[0]?.title}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MiniClientMock({ className }: { className?: string }) {
  const { t } = useTranslation('landing')
  const exercises = asStringArray(t('mobile.exercises', { returnObjects: true }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('saas-product-mock', className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="saas-product-mock__chrome"
      >
        <span className="saas-product-mock__dot" style={{ background: '#ff5f57' }} />
        <span className="saas-product-mock__dot" style={{ background: '#febc2e' }} />
        <span className="saas-product-mock__dot" style={{ background: '#28c840' }} />
        <span className="saas-product-mock__title">{t('ecosystem.clientTab')}</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.06 }}
        className="saas-product-mock__body min-h-[220px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="saas-product-mock__content p-4"
        >
          <p className="text-sm font-semibold">{t('ecosystem.clientGreeting')}</p>
          <div className="mt-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-3">
            <p className="text-[10px] uppercase text-[var(--text-muted)]">{t('mobile.today')}</p>
            <p className="mt-1 text-base font-bold">{t('mobile.workoutTitle')}</p>
            <p className="text-[12px] text-[var(--text-secondary)]">{t('mobile.workoutMeta')}</p>
          </div>
          <div className="mt-2 space-y-1.5">
            {exercises.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + index * 0.04 }}
                className="flex items-center justify-between rounded-[6px] border border-[var(--border)] px-2.5 py-2 text-[12px]"
              >
                <span>{item}</span>
                {index === 0 ? <Check className="h-3.5 w-3.5 text-[var(--accent)]" /> : null}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function MobileSection() {
  const { t } = useTranslation('landing')
  const exercises = asStringArray(t('mobile.exercises', { returnObjects: true }))

  return (
    <section className="px-5 py-12 sm:px-10 sm:py-16">
      <motion.div {...fade} className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1fr_auto]">
        <SectionIntro eyebrow={t('mobile.eyebrow')} title={t('mobile.title')} text={t('mobile.text')} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-[260px] rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface)] p-2"
        >
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--black)] p-4">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="mx-auto mb-4 h-1 w-14 origin-center rounded-full bg-white/20"
            />
            <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{t('mobile.today')}</p>
            <p className="mt-2 text-xl font-semibold">{t('mobile.workoutTitle')}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('mobile.workoutMeta')}</p>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="mt-5 space-y-2"
            >
              {exercises.map((item, index) => (
                <motion.div
                  key={item}
                  variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                  className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] px-3 py-2.5 text-sm"
                >
                  <span>{item}</span>
                  {index === 0 ? <Check className="h-4 w-4 text-[var(--accent)]" /> : null}
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <MessageSquare className="h-3.5 w-3.5" />
              {t('ecosystem.clientTab')}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function CtaSection() {
  const { t } = useTranslation('landing')

  return (
    <section className="px-5 pb-16 sm:px-10">
      <motion.div
        {...fade}
        className="mx-auto max-w-3xl rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center sm:px-10"
      >
        <p className="ds-label text-[var(--text-muted)]">{t('cta.eyebrow')}</p>
        <h2 className="ds-h2 mt-2">{t('cta.title')}</h2>
        <p className="ds-body mx-auto mt-3 max-w-lg text-[var(--text-secondary)]">{t('cta.text')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/register/trainer">{t('cta.create')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login/trainer">{t('cta.demo')}</Link>
          </Button>
        </div>
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
