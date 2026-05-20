import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Flame,
  MessageCircle,
  Play,
  Wallet,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useClientDashboard, useClientProgress, useClientWorkouts } from '@/features/api/hooks'
import { pickTodayWorkout, todayDayKey, weekCompletionPercent } from '@/lib/client-workouts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/i18n-format'
import { CHART } from '@/lib/chart-theme'
import { cn } from '@/lib/utils'

export function ClientHomePage() {
  const { t } = useTranslation(['client', 'common'])
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isError: dashboardError,
    refetch: refetchDashboard,
  } = useClientDashboard()
  const { data: workouts = [], isLoading: workoutsLoading } = useClientWorkouts()
  const { data: progressData = [] } = useClientProgress()

  const profile = dashboard?.profile
  const firstName = profile?.name?.split(' ')[0] ?? t('home.defaultName')
  const trainerName = profile?.trainer ?? t('chat.defaultTrainer')
  const todayLabel = t(`common:days.${todayDayKey()}`)
  const todayWorkout = pickTodayWorkout(workouts, todayLabel)
  const measurementSeries = progressData.filter((m) => m.weight > 0)
  const notifications = dashboard?.notifications?.slice(0, 3) ?? []
  const nextSession = dashboard?.nextSession
  const history = workouts.filter((w) => w.status === 'done').slice(-5).reverse()
  const weekProgress = {
    completed: workouts.filter((w) => w.status === 'done').length,
    planned: Math.max(workouts.length, 1),
    streakDays: dashboard?.streakDays ?? 0,
  }
  const weekPct = weekCompletionPercent(workouts)
  const packageBalance = profile?.packageBalance ?? 0
  const lastMessage = notifications.find((n) => n.type === 'message') ?? notifications[0]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-4xl space-y-4 pb-6 md:max-w-6xl lg:max-w-none"
    >
      <header className="flex items-center gap-3 px-1 lg:col-span-2">
        <Avatar className="h-11 w-11 border border-[var(--border-strong)]">
          <AvatarFallback className="bg-[var(--surface2)] text-base font-bold text-[var(--accent)]">
            {firstName.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="ds-h2 truncate">{t('home.greeting', { name: firstName })}</h1>
          <p className="ds-caption text-[var(--text-muted)]">
            {dashboard?.currentProgram?.trim() || t('workouts.empty')}
          </p>
        </div>
      </header>

      {dashboardLoading || workoutsLoading ? (
        <div className="flex items-center gap-2 px-1 text-sm text-[var(--text-muted)] lg:col-span-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('common:actions.loading')}
        </div>
      ) : null}

      {dashboardError ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm lg:col-span-2">
          <span>{t('home.loadError')}</span>
          <Button type="button" variant="secondary" size="sm" onClick={() => void refetchDashboard()}>
            {t('common:actions.retry')}
          </Button>
        </div>
      ) : null}

      <div className="contents lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
      <div className="contents space-y-4 lg:block lg:space-y-4">
      <Card className="border-[var(--border)] bg-[var(--surface2)]">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-[var(--accent)]" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                {t('home.packageBalance.label')}
              </p>
              <p className="text-lg font-semibold tabular-nums">
                {packageBalance} {t('common:units.sessionsShort')}
              </p>
            </div>
          </div>
          <Link to="/client/payments" className="text-xs font-medium text-[var(--accent)]">
            {t('home.packageBalance.view')}
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[var(--border-strong)] bg-[var(--surface)]">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
            <div>
              <p className="ds-label text-[var(--text-muted)]">{t('home.todayWorkout.label')}</p>
              <CardTitle className="mt-1 text-lg">
                {todayWorkout?.title ?? t('home.upcoming.empty')}
              </CardTitle>
              {todayWorkout ? (
                <p className="ds-caption mt-1 text-[var(--text-secondary)]">
                  {t('home.todayWorkout.meta', {
                    count: todayWorkout.exercises?.length ?? 0,
                    min: todayWorkout.duration ?? 45,
                  })}
                </p>
              ) : null}
            </div>
            <Dumbbell className="h-5 w-5 text-[var(--accent)]" aria-hidden />
          </CardHeader>
          <CardContent className="pt-4">
            {todayWorkout ? (
              <Button asChild className="w-full">
                <Link to={`/client/workouts/${todayWorkout.id}/session`}>
                  <Play className="mr-2 h-4 w-4" />
                  {t('home.todayWorkout.start')}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="secondary" className="w-full">
                <Link to="/client/workouts">{t('home.todayWorkout.viewPlan')}</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t('home.upcoming.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {nextSession ? (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface3)]">
                  <CalendarDays className="h-4 w-4 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{nextSession.title}</p>
                  <p className="ds-caption mt-0.5 text-[var(--text-secondary)]">
                    {formatDateTime(nextSession.start)}
                  </p>
                  <p className="ds-caption mt-1 text-[var(--text-muted)]">
                    {t('home.upcoming.withTrainer', { name: trainerName })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="ds-body text-[var(--text-muted)]">{t('home.upcoming.empty')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {history.length > 0 ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">{t('home.history.title')}</CardTitle>
            <Link to="/client/workouts" className="text-xs font-medium text-[var(--accent)]">
              {t('common:actions.viewAll')}
            </Link>
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            {history.map((workout, index) => (
              <Link
                key={workout.id}
                to={`/client/workouts/${workout.id}/session`}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface3)]',
                  index < history.length - 1 && 'border-b border-[var(--border)]',
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--accent-dim)]">
                  <Dumbbell className="h-4 w-4 text-[var(--accent)]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{workout.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {workout.day}
                    {workout.status === 'done' ? ` · ${t('home.history.done')}` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}
      </div>

      <div className="contents space-y-4 lg:block lg:space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1">
        <Card className="border-[var(--border)] bg-[var(--surface2)]">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                {t('home.weekStrip.label')}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {t('home.weekProgress.done', {
                  done: weekProgress.completed,
                  total: weekProgress.planned,
                })}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{weekPct}%</p>
            </div>
            <div className="h-2 max-w-[140px] flex-1 overflow-hidden rounded-full bg-[var(--surface3)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${weekPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--surface2)]">
          <CardContent className="flex items-center gap-3 p-4">
            <Flame className="h-5 w-5 text-[var(--accent)]" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                {t('home.streak.label')}
              </p>
              <p className="text-lg font-semibold">
                {t('home.weekProgress.streak', { count: weekProgress.streakDays })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {measurementSeries.length > 0 ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">{t('home.weightChart.title')}</CardTitle>
            <Link to="/client/progress" className="text-xs font-medium text-[var(--accent)]">
              {t('home.measurements.view')}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-28 lg:h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={measurementSeries}>
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke={CHART.emerald}
                    fill="rgba(52,211,153,0.1)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">{t('home.chat.title')}</CardTitle>
            <MessageCircle className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">
              {lastMessage?.body ?? t('home.chat.empty')}
            </p>
            <Link
              to="/client/chat"
              className="mt-3 inline-flex items-center gap-0.5 text-sm font-medium text-[var(--accent)]"
            >
              {t('home.chat.open')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t('home.notifications.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length ? (
              notifications.map((n) => (
                <div key={n.id} className="flex gap-2">
                  <span
                    className={cn(
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      n.read ? 'bg-[var(--text-muted)]' : 'bg-[var(--accent)]',
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="line-clamp-2 text-xs text-[var(--text-secondary)]">{n.body}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="ds-body text-[var(--text-muted)]">{t('common:empty.noData')}</p>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
      </div>
    </motion.div>
  )
}
