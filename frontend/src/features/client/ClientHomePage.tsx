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
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useClientDashboard, useClientProgress, useClientWorkouts } from '@/features/api/hooks'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  clientCalendarMini,
  clientCoachMessages,
  completedWorkouts,
  measurements,
  weekProgress,
  weeklyWorkouts,
} from '@/features/client/client-mock'
import { formatDateTime } from '@/lib/i18n-format'
import { CHART } from '@/lib/chart-theme'
import { cn } from '@/lib/utils'

export function ClientHomePage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: dashboard } = useClientDashboard()
  const { data: workouts = [] } = useClientWorkouts()
  const { data: progressData = [] } = useClientProgress()

  const profile = dashboard?.profile
  const firstName = profile?.name?.split(' ')[0] ?? t('home.defaultName')
  const trainerName = profile?.trainer ?? t('chat.defaultTrainer')

  const todayWorkout =
    workouts.find((w) => w.status === 'today') ??
    weeklyWorkouts.find((w) => w.status === 'today') ??
    workouts[0] ??
    weeklyWorkouts[0]

  const measurementSeries = progressData.length ? progressData : measurements
  const notifications = dashboard?.notifications?.slice(0, 3) ?? []
  const lastMessage = clientCoachMessages[clientCoachMessages.length - 1]
  const nextSession = dashboard?.nextSession
  const history = completedWorkouts.slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl space-y-4 pb-6"
    >
      <header className="flex items-center gap-3 px-1">
        <Avatar className="h-11 w-11 border border-[var(--border-strong)]">
          <AvatarFallback className="bg-[var(--surface2)] text-base font-bold text-[var(--accent)]">
            {firstName.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="ds-h2 truncate">{t('home.greeting', { name: firstName })}</h1>
          <p className="ds-caption text-[var(--text-muted)]">
            {dashboard?.currentProgram ?? t('home.fallback.program')}
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[var(--border-strong)] bg-[var(--surface)]">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
            <div>
              <p className="ds-label text-[var(--text-muted)]">{t('home.todayWorkout.label')}</p>
              <CardTitle className="mt-1 text-lg">{todayWorkout?.title ?? t('home.fallback.program')}</CardTitle>
              <p className="ds-caption mt-1 text-[var(--text-secondary)]">
                {t('home.todayWorkout.meta', {
                  count: todayWorkout?.exercises?.length ?? 4,
                  min: todayWorkout?.duration ?? 45,
                })}
              </p>
            </div>
            <Dumbbell className="h-5 w-5 text-[var(--accent)]" aria-hidden />
          </CardHeader>
          <CardContent className="pt-4">
            <Button asChild className="w-full">
              <Link to="/client/workouts/session">
                <Play className="mr-2 h-4 w-4" />
                {t('home.todayWorkout.start')}
              </Link>
            </Button>
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

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
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
            </div>
            <div className="h-2 max-w-[140px] flex-1 overflow-hidden rounded-full bg-[var(--surface3)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${(weekProgress.completed / weekProgress.planned) * 100}%` }}
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

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold">{t('home.weightChart.title')}</CardTitle>
          <Link to="/client/progress" className="text-xs font-medium text-[var(--accent)]">
            {t('home.measurements.view')}
          </Link>
        </CardHeader>
        <CardContent>
          <div className="h-28">
            <ResponsiveContainer width="100%" height={112}>
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
              to="/client/workouts"
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
                  {workout.date} · {workout.duration} {t('common:units.min')}
                </p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">{t('home.chat.title')}</CardTitle>
            <MessageCircle className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{lastMessage?.text}</p>
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{t('home.calendar.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {clientCalendarMini.map((day) => (
              <div
                key={day.date}
                className={cn(
                  'rounded-[8px] border p-3 text-center',
                  day.hasEvent ? 'border-[var(--accent)]/40 bg-[var(--accent-dim)]' : 'border-[var(--border)]',
                )}
              >
                <p className="text-[10px] font-semibold uppercase text-[var(--text-muted)]">{day.day}</p>
                <p className="mt-1 text-lg font-bold">{day.date}</p>
                {day.hasEvent ? (
                  <Badge variant="secondary" className="mt-2 w-full justify-center text-[10px]">
                    {day.label}
                  </Badge>
                ) : (
                  <p className="mt-2 text-[10px] text-[var(--text-muted)]">—</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
