import { lazy, Suspense, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Bell, CalendarDays, CalendarPlus, Clock3, CreditCard, MessageSquare, UserPlus, Dumbbell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DashboardContainer,
  DashboardGrid,
  DashboardGridItem,
  EmptyState,
  LoadingState,
  SaasPageHeader,
} from '@/components/saas'
import { Skeleton } from '@/components/ui/skeleton'
import { useClients, useEvents, useNotifications, usePayments, useTrainerAnalytics } from '@/features/api/hooks'
import { getAttendanceChart, getRevenueChart } from '@/features/api/analytics-service'
import type { ChartPeriodId } from '@/features/trainer/TrainerDashboardCharts'
import { buildTrainerActivityFeed, type ActivityFeedItem } from '@/lib/activity-feed'
import { enrichClient } from '@/lib/client-crm'
import { formatRub } from '@/lib/utils'
import { intlLocale } from '@/lib/i18n-format'
import type { ClientStatus, PaymentState } from '@/types'

const chartPeriods = [
  { id: '6m', labelKey: 'dashboard.period.d90', months: 6 },
  { id: '12m', labelKey: 'dashboard.period.year', months: 12 },
] as const

const LazyTrainerDashboardCharts = lazy(() =>
  import('@/features/trainer/TrainerDashboardCharts').then((m) => ({
    default: m.TrainerDashboardCharts,
  })),
)

const ACTIVITY_ICONS: Record<ActivityFeedItem['type'], LucideIcon> = {
  payment: CreditCard,
  message: MessageSquare,
  notification: Bell,
}

function formatActivityTime(iso: string, locale: string) {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  return date.toLocaleDateString(intlLocale(locale), { day: 'numeric', month: 'short' })
}

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function TrainerDashboardPage() {
  const { t, i18n } = useTranslation(['trainer', 'common'])
  const { data: clients = [], isLoading: clientsLoading, isError: clientsError, refetch: refetchClients } = useClients()
  const { data: analytics, isLoading: analyticsLoading, isError: analyticsError, refetch: refetchAnalytics } =
    useTrainerAnalytics()
  const { data: events = [], isLoading: eventsLoading } = useEvents()
  const { data: notifications = [] } = useNotifications()
  const { data: payments = [] } = usePayments()
  const { data: revenueChart = [], isLoading: chartLoading } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: getRevenueChart,
  })
  const { data: attendanceChart = [] } = useQuery({
    queryKey: ['attendance-chart-dashboard'],
    queryFn: getAttendanceChart,
  })
  const [chartPeriod, setChartPeriod] = useState<ChartPeriodId>('6m')
  const periodMonths = chartPeriods.find((p) => p.id === chartPeriod)?.months ?? 6
  const revenueData = useMemo(() => revenueChart.slice(-periodMonths), [revenueChart, periodMonths])
  const activityItems = useMemo(
    () => buildTrainerActivityFeed(notifications, payments, 14),
    [notifications, payments],
  )

  const statusLabel = (status: ClientStatus) => t(`common:status.${status}`)

  const activeCount = analytics?.activeClients ?? clients.filter((c) => c.status === 'active').length
  const unreadCount = analytics?.unreadMessages ?? 0
  const todayEvents = useMemo(
    () => [...events].filter((e) => isToday(e.start)).sort((a, b) => a.start.localeCompare(b.start)),
    [events],
  )
  const upcomingLater = useMemo(
    () =>
      [...events]
        .filter((e) => !isToday(e.start))
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, 4),
    [events],
  )
  const activeClients = useMemo(
    () => clients.filter((c) => c.status === 'active').map(enrichClient).slice(0, 6),
    [clients],
  )

  const paymentLabel = (state: PaymentState | undefined) => {
    const key = state ?? 'paid'
    return t(`clients.payment.${key}`)
  }

  const quickActions = [
    { to: '/trainer/clients', icon: UserPlus, label: t('dashboard.quickActions.addClient') },
    { to: '/trainer/workouts/builder', icon: Dumbbell, label: t('dashboard.quickActions.workout') },
    { to: '/trainer/calendar', icon: CalendarPlus, label: t('dashboard.quickActions.session') },
    { to: '/trainer/messages', icon: MessageSquare, label: t('dashboard.quickActions.message') },
  ]

  const today = new Date().toLocaleDateString(intlLocale(i18n.language), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const stats = [
    {
      label: t('dashboard.stats.clients'),
      value: clientsLoading || analyticsLoading ? '…' : String(activeCount),
    },
    {
      label: t('dashboard.stats.revenueMay'),
      value: analyticsLoading ? '…' : formatRub(analytics?.monthlyRevenue ?? 0),
    },
    {
      label: t('dashboard.stats.workouts'),
      value: analyticsLoading ? '…' : String(analytics?.weeklySessions ?? 0),
    },
    {
      label: t('dashboard.stats.unread'),
      value: analyticsLoading ? '…' : String(unreadCount),
    },
  ]

  return (
    <div className="page-container page-container--dense overflow-x-hidden">
      <SaasPageHeader
        title={t('dashboard.title')}
        description={`${today} · ${t('dashboard.greeting')}`}
        breadcrumbs={[
          { label: t('dashboard.breadcrumb.app'), href: '/trainer' },
          { label: t('dashboard.breadcrumb.dashboard') },
        ]}
      />

      {(clientsError || analyticsError) && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-sm">
          <span className="text-[var(--text-secondary)]">{t('dashboard.loadError')}</span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              if (clientsError) void refetchClients()
              if (analyticsError) void refetchAnalytics()
            }}
          >
            {t('common:actions.retry')}
          </Button>
        </div>
      )}

      <div className="saas-metric-grid mb-3">
        {stats.map((stat) => (
          <div key={stat.label} className="saas-metric-cell">
            <p className="saas-metric-cell__label">{stat.label}</p>
            {clientsLoading || analyticsLoading ? (
              <Skeleton className="mt-1 h-7 w-16" />
            ) : (
              <p className="saas-metric-cell__value tabular-nums">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mb-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {t('dashboard.quickActions.title')}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button key={action.to} variant="secondary" size="sm" className="touch-target gap-2" asChild>
              <Link to={action.to}>
                <action.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <DashboardContainer
        title={t('dashboard.todayFocus.title')}
        description={today}
        flush
        className="saas-dash-today mb-3"
        actions={
          <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
            <Link to="/trainer/calendar">{t('dashboard.todayFocus.cta')}</Link>
          </Button>
        }
      >
        {eventsLoading ? (
          <LoadingState variant="skeleton" rows={2} className="px-4 py-3" />
        ) : todayEvents.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {todayEvents.map((e) => (
              <Link
                key={e.id}
                to="/trainer/calendar"
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface3)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface3)] text-[11px] font-semibold tabular-nums text-[var(--accent)]">
                  {new Date(e.start).toLocaleTimeString(intlLocale(i18n.language), {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{e.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{e.type ?? t('dashboard.eventTypeDefault')}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {t('dashboard.today.badge')}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title={t('dashboard.todayFocus.empty')}
            description={t('dashboard.schedule.emptyToday')}
            className="mx-3 my-3 border-none bg-transparent"
            action={
              <Button size="sm" asChild>
                <Link to="/trainer/calendar">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  {t('dashboard.todayFocus.cta')}
                </Link>
              </Button>
            }
          />
        )}
      </DashboardContainer>

      <DashboardGrid>
        <Suspense
          fallback={
            <DashboardGridItem span={8}>
              <LoadingState label={t('common:actions.loading')} className="h-[200px]" />
            </DashboardGridItem>
          }
        >
          <LazyTrainerDashboardCharts
            attendanceChart={attendanceChart}
            revenueData={revenueData}
            chartLoading={chartLoading}
            chartPeriod={chartPeriod}
            onChartPeriodChange={setChartPeriod}
          />
        </Suspense>

        <DashboardGridItem span={4}>
          <DashboardContainer title={t('dashboard.activity.title')} description={t('dashboard.activity.subtitle')} flush>
            <div className="max-h-[320px] overflow-y-auto">
              {activityItems.length === 0 ? (
                <p className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{t('dashboard.activity.empty')}</p>
              ) : (
                activityItems.map((item) => {
                  const Icon = ACTIVITY_ICONS[item.type]
                  return (
                    <div key={item.id} className="saas-activity-item">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface3)] text-[var(--text-muted)]">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                      <time className="saas-activity-item__time" dateTime={item.createdAt}>
                        {formatActivityTime(item.createdAt, i18n.language)}
                      </time>
                      <div className="min-w-0 flex-1">
                        <p className="saas-activity-item__title">{item.title}</p>
                        <p className="saas-activity-item__body line-clamp-1">{item.body}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </DashboardContainer>
        </DashboardGridItem>

        <DashboardGridItem span={4}>
          <DashboardContainer
            title={t('dashboard.activeClients.title')}
            description={t('dashboard.activeClients.subtitle')}
            flush
            actions={<Badge variant="secondary">{activeClients.length}</Badge>}
          >
            <div className="divide-y divide-[var(--border)]">
              {activeClients.length === 0 ? (
                <div className="p-3">
                  <EmptyState
                    icon={UserPlus}
                    title={t('dashboard.activeClients.empty')}
                    action={
                      <Button size="sm" variant="secondary" asChild>
                        <Link to="/trainer/clients">{t('dashboard.quickActions.addClient')}</Link>
                      </Button>
                    }
                    className="py-8"
                  />
                </div>
              ) : (
                activeClients.map((c) => (
                  <Link
                    key={c.id}
                    to={`/trainer/clients/${c.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 transition-colors hover:bg-[var(--surface3)]"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--accent-dim)] text-[10px] font-bold text-[var(--accent)]">
                      {c.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{c.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {c.goal ?? t('clients.fallback.goal')}
                        {c.workoutCompletionPct != null
                          ? ` · ${c.workoutCompletionPct}% ${t('dashboard.activeClients.progress')}`
                          : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <Badge
                        variant={c.paymentState === 'overdue' ? 'destructive' : c.paymentState === 'pending' ? 'warning' : 'success'}
                        className="px-1.5 py-0 text-[10px]"
                      >
                        {paymentLabel(c.paymentState)}
                      </Badge>
                      <span className="text-[10px] text-[var(--text-muted)]">{statusLabel(c.status)}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </DashboardContainer>
        </DashboardGridItem>

        <DashboardGridItem span={4}>
          <DashboardContainer
            title={t('dashboard.schedule.upcoming')}
            description={t('dashboard.schedule.subtitle')}
            flush
            actions={<Clock3 className="h-4 w-4 text-[var(--text-muted)]" />}
          >
            <div className="divide-y divide-[var(--border)]">
              {upcomingLater.length === 0 ? (
                <p className="px-4 py-4 text-center text-sm text-[var(--text-muted)]">{t('dashboard.schedule.empty')}</p>
              ) : (
                upcomingLater.map((e) => (
                  <div key={e.id} className="flex gap-2.5 px-3 py-1.5 hover:bg-[var(--surface3)]">
                    <span className="min-w-[52px] pt-0.5 text-[11px] tabular-nums text-[var(--text-muted)]">
                      {new Date(e.start).toLocaleDateString(intlLocale(i18n.language), {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {' · '}
                      {new Date(e.start).toLocaleTimeString(intlLocale(i18n.language), {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{e.title}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{e.type ?? t('dashboard.eventTypeDefault')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardContainer>
        </DashboardGridItem>
      </DashboardGrid>
    </div>
  )
}
