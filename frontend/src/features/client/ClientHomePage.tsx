import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Dumbbell,
  Flame,
  Menu,
  Search,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useClientDashboard, useClientWorkouts } from '@/features/api/hooks'
import { getClientPayments } from '@/features/api/client-cabinet-service'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MobileListItem, MobileListStagger } from '@/components/mobile'

export function ClientHomePage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: dashboard } = useClientDashboard()
  const { data: workouts = [] } = useClientWorkouts()
  useQuery({ queryKey: ['client-payments'], queryFn: getClientPayments })
  const profile = dashboard?.profile
  const firstName = profile?.name?.split(' ')[0] ?? t('home.defaultName')

  const progressCards = [
    {
      title: dashboard?.currentProgram ?? t('home.fallback.program'),
      subtitle: t('home.cards.currentProgram'),
      icon: Dumbbell,
      to: '/client/workouts',
    },
    {
      title: t('home.cards.weekCompletion'),
      subtitle: t('home.cards.weekCompletionSubtitle'),
      icon: TrendingUp,
      to: '/client/progress',
    },
    {
      title: t('home.cards.packageBalance', { count: profile?.packageBalance ?? 0 }),
      subtitle: t('home.cards.packageBalanceSubtitle'),
      icon: Target,
      to: '/client/profile',
    },
    {
      title: workouts[0]?.title ?? t('home.fallback.program'),
      subtitle: workouts[0]?.duration
        ? `${workouts[0].duration} ${t('common:units.min')}`
        : t('home.cards.today'),
      icon: Flame,
      to: '/client/workouts/session',
    },
  ]

  return (
    <MobileListStagger className="mobile-home">
      <MobileListItem>
        <header className="mobile-home-header">
          <Avatar className="h-12 w-12 border border-[var(--border-strong)]">
            <AvatarFallback className="bg-[var(--surface2)] text-base font-bold text-[var(--accent)]">
              {firstName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[1.625rem] font-extrabold leading-tight tracking-tight">
              {t('home.greeting', { name: firstName })}
            </h1>
          </div>
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface2)] text-[var(--text-secondary)]"
            aria-label={t('common:aria.menu')}
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>
      </MobileListItem>

      <MobileListItem>
        <label className="mobile-search-bar">
          <Search className="h-5 w-5 shrink-0" aria-hidden />
          <input
            type="search"
            placeholder={t('home.searchPlaceholder')}
            aria-label={t('common:aria.search')}
          />
        </label>
      </MobileListItem>

      <MobileListItem>
        <section className="mobile-section">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-xl font-bold tracking-tight">{t('home.progress.title')}</h2>
            <Link
              to="/client/progress"
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-[var(--accent)]"
            >
              {t('common:actions.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="horizontal-scroll-cards">
            {progressCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to={card.to} className="progress-scroll-card block">
                  <p className="relative z-10 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                    {card.subtitle}
                  </p>
                  <p className="relative z-10 mt-2 max-w-[12rem] font-display text-xl font-extrabold leading-tight tracking-tight">
                    {card.title}
                  </p>
                  <card.icon className="progress-scroll-card__icon h-28 w-28 text-[var(--accent)]" strokeWidth={1.25} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </MobileListItem>

      <MobileListItem>
        <section className="mobile-section">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-xl font-bold tracking-tight">{t('home.recent.title')}</h2>
            <Link
              to="/client/workouts"
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-[var(--accent)]"
            >
              {t('common:actions.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mobile-recent-list">
            {(workouts.length ? workouts : [{ id: 'w1', title: t('home.fallback.program'), day: t('common:days.mon'), exercises: [] }]).map(
              (workout, index) => (
                <Link
                  key={workout.id}
                  to="/client/workouts"
                  className="mobile-recent-row hover:bg-white/[0.03]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-dim)]">
                    <Dumbbell className="h-5 w-5 text-[var(--accent)]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{workout.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {workout.exercises?.[0]?.name ?? t('home.fallback.exercise')} · {workout.duration ?? 45}{' '}
                      {t('common:units.min')}
                    </p>
                  </div>
                  <span className="mobile-recent-row__date">
                    {index === 0 ? t('home.fallback.dateSample') : `${workout.day}`}
                  </span>
                </Link>
              ),
            )}
          </div>
        </section>
      </MobileListItem>
    </MobileListStagger>
  )
}
