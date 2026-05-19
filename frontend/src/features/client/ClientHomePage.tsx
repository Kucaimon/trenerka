import { Link } from 'react-router-dom'
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

const recentDates = ['20 дек, чт', '18 дек, вт', '15 дек, сб']

export function ClientHomePage() {
  const { data: dashboard } = useClientDashboard()
  const { data: workouts = [] } = useClientWorkouts()
  useQuery({ queryKey: ['client-payments'], queryFn: getClientPayments })
  const profile = dashboard?.profile
  const firstName = profile?.name?.split(' ')[0] ?? 'Клиент'

  const progressCards = [
    {
      title: dashboard?.currentProgram ?? 'Силовая A',
      subtitle: 'Текущая программа',
      icon: Dumbbell,
      to: '/client/workouts',
    },
    {
      title: '86% недели',
      subtitle: 'Выполнение плана',
      icon: TrendingUp,
      to: '/client/progress',
    },
    {
      title: `${profile?.packageBalance ?? 0} занятий`,
      subtitle: 'Баланс пакета',
      icon: Target,
      to: '/client/profile',
    },
    {
      title: workouts[0]?.title ?? 'Силовая A',
      subtitle: workouts[0]?.duration ? `${workouts[0].duration} мин` : 'Сегодня',
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
              Привет, {firstName}!
            </h1>
          </div>
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface2)] text-[var(--text-secondary)]"
            aria-label="Меню"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>
      </MobileListItem>

      <MobileListItem>
        <label className="mobile-search-bar">
          <Search className="h-5 w-5 shrink-0" aria-hidden />
          <input type="search" placeholder="Поиск тренировок и упражнений…" aria-label="Поиск" />
        </label>
      </MobileListItem>

      <MobileListItem>
        <section className="mobile-section">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-xl font-bold tracking-tight">Ваш прогресс</h2>
            <Link
              to="/client/progress"
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-[var(--accent)]"
            >
              Все
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
            <h2 className="font-display text-xl font-bold tracking-tight">Последние тренировки</h2>
            <Link
              to="/client/workouts"
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-[var(--accent)]"
            >
              Все
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mobile-recent-list">
            {(workouts.length ? workouts : [{ id: 'w1', title: 'Силовая A', day: 'Пн', exercises: [] }]).map(
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
                      {workout.exercises?.[0]?.name ?? 'Жим лёжа'} · {workout.duration ?? 45} мин
                    </p>
                  </div>
                  <span className="mobile-recent-row__date">
                    {recentDates[index] ?? `${workout.day}, сегодня`}
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
