import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  ChevronRight,
  Dumbbell,
  MessageCircle,
  Play,
  Ruler,
  Scale,
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
  const latest = measurementSeries[measurementSeries.length - 1]
  const prev = measurementSeries[measurementSeries.length - 2]

  const notifications = dashboard?.notifications?.slice(0, 3) ?? []
  const lastMessage = clientCoachMessages[clientCoachMessages.length - 1]
  const nextSession = dashboard?.nextSession
  const completed = completedWorkouts

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl pb-6"
    >
      <header className="mb-5 flex items-center gap-3 px-1">
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

      <div className="ds-stack-16">
        <Card className="border-[var(--border-strong)] bg-[var(--surface)]">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <p className="ds-label text-[var(--text-muted)]">{t('home.todayWorkout.label')}</p>
              <CardTitle className="mt-1 text-lg">{todayWorkout?.title ?? t('home.fallback.program')}</CardTitle>
              <p className="ds-caption mt-1 text-[var(--text-secondary)]">
                {t('home.todayWorkout.meta', {
                  count: todayWorkout?.exercises?.length ?? 4,
                  min: todayWorkout?.duration ?? 45,
                })}
              </p>
            </motion.div>
            <Dumbbell className="h-5 w-5 text-[var(--accent)]" aria-hidden />
          </CardHeader>
          <CardContent className="pt-4">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/client/workouts/session">
                <Play className="mr-2 h-4 w-4" />
                {t('home.todayWorkout.start')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
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

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">{t('home.weekProgress.title')}</CardTitle>
              <Link to="/client/progress" className="text-xs font-medium text-[var(--accent)]">
                {t('home.measurements.view')}
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight">
                {t('home.weekProgress.done', {
                  done: weekProgress.completed,
                  total: weekProgress.planned,
                })}
              </p>
              <p className="ds-caption mt-1 text-[var(--text-muted)]">
                {t('home.weekProgress.streak', { count: weekProgress.streakDays })}
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="mt-3 flex h-2 overflow-hidden rounded-full bg-[var(--surface3)]"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(weekProgress.completed / weekProgress.planned) * 100}%` }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-[var(--accent)]"
                />
              </motion.div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">{t('home.measurements.title')}</CardTitle>
              <Link to="/client/progress" className="text-xs font-medium text-[var(--accent)]">
                {t('home.measurements.view')}
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface3)] p-3">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Scale className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium uppercase">{t('home.measurements.weight')}</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold">
                    {latest?.weight ?? measurements[measurements.length - 1]?.weight}{' '}
                    {t('common:units.kg')}
                  </p>
                  {prev?.weight && latest?.weight ? (
                    <p className="text-[11px] text-[var(--accent)]">
                      {(latest.weight - prev.weight).toFixed(1)} {t('common:units.kg')}
                    </p>
                  ) : null}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-[8px] border border-[var(--border)] bg-[var(--surface3)] p-3"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="h-14"
                  >
                    <ResponsiveContainer width="100%" height={56}>
                      <AreaChart data={measurementSeries.slice(-4)}>
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke={CHART.emerald}
                          fill="rgba(52,211,153,0.12)"
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Ruler className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium uppercase">{t('home.measurements.waist')}</span>
                  </div>
                  <p className="mt-0.5 text-lg font-semibold">
                    {latest?.waist ?? measurements[measurements.length - 1]?.waist} {t('common:units.cm')}
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">{t('home.chat.title')}</CardTitle>
              <MessageCircle className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{lastMessage?.text}</p>
              <p className="ds-caption mt-2 text-[var(--text-muted)]">{lastMessage?.time}</p>
              <Link
                to="/client/chat"
                className="mt-3 inline-flex items-center gap-0.5 text-sm font-medium text-[var(--accent)]"
              >
                {t('home.chat.open')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">{t('home.completed.title')}</CardTitle>
              <Link to="/client/workouts" className="text-xs font-medium text-[var(--accent)]">
                {t('common:actions.viewAll')}
              </Link>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              {completed.map((workout, index) => (
                <Link
                  key={workout.id}
                  to="/client/workouts"
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface3)]',
                    index < completed.length - 1 && 'border-b border-[var(--border)]',
                  )}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--accent-dim)]">
                    <Dumbbell className="h-4 w-4 text-[var(--accent)]" />
                  </span>
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium">{workout.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {workout.date} · {workout.duration} {t('common:units.min')}
                    </p>
                  </motion.div>
                </Link>
              ))}
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
      </div>
    </motion.div>
  )
}
