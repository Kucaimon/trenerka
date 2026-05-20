import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Bell, Clock3, CreditCard, MessageSquare } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  AnalyticsWidget,
  DashboardContainer,
  DashboardGrid,
  DashboardGridItem,
  SaasPageHeader,
} from '@/components/saas'
import { useClients, useEvents, useTrainerAnalytics } from '@/features/api/hooks'
import { getRevenueChart } from '@/features/api/analytics-service'
import { mockActivityFeed, type ActivityFeedItem } from '@/lib/mock-data'
import { formatRub } from '@/lib/utils'
import { CHART } from '@/lib/chart-theme'
import { cn } from '@/lib/utils'
import { intlLocale } from '@/lib/i18n-format'
import type { ClientStatus } from '@/types'

const chartPeriods = [
  { id: '6m', labelKey: 'dashboard.period.d90', months: 6 },
  { id: '12m', labelKey: 'dashboard.period.year', months: 12 },
] as const

type ChartPeriodId = (typeof chartPeriods)[number]['id']

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
  const { data: clients = [], isLoading: clientsLoading } = useClients()
  const { data: analytics, isLoading: analyticsLoading } = useTrainerAnalytics()
  const { data: events = [] } = useEvents()
  const { data: revenueChart = [], isLoading: chartLoading } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: getRevenueChart,
  })
  const [chartPeriod, setChartPeriod] = useState<ChartPeriodId>('6m')
  const periodMonths = chartPeriods.find((p) => p.id === chartPeriod)?.months ?? 6
  const revenueData = useMemo(() => revenueChart.slice(-periodMonths), [revenueChart, periodMonths])
  const activityItems = useMemo(() => mockActivityFeed.slice(0, 14), [])

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
  const activeClients = clients.filter((c) => c.status === 'active').slice(0, 6)

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

      <div className="saas-metric-grid mb-3">
        {stats.map((stat) => (
          <div key={stat.label} className="saas-metric-cell">
            <p className="saas-metric-cell__label">{stat.label}</p>
            <p className="saas-metric-cell__value tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      {todayEvents.length > 0 ? (
        <DashboardContainer
          title={t('dashboard.schedule.title')}
          description={t('dashboard.schedule.subtitle')}
          flush
          className="saas-dash-today"
        >
          <div className="divide-y divide-[var(--border)]">
            {todayEvents.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--surface3)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface3)] text-[11px] font-semibold tabular-nums text-[var(--accent)]">
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
              </div>
            ))}
          </div>
        </DashboardContainer>
      ) : null}

      <DashboardGrid>
        <DashboardGridItem span={8}>
          <AnalyticsWidget
            title={t('dashboard.revenue.title')}
            height={220}
            actions={
              <div className="flex gap-0.5 rounded-[var(--radius-sm)] bg-[var(--surface3)] p-0.5">
                {chartPeriods.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setChartPeriod(p.id)}
                    className={cn(
                      'rounded-[var(--radius-sm)] px-2.5 py-1 text-xs transition-colors',
                      chartPeriod === p.id
                        ? 'bg-[var(--surface)] text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                    )}
                  >
                    {t(p.labelKey)}
                  </button>
                ))}
              </div>
            }
          >
            <div className="chart-mobile h-[200px] min-h-[180px]">
              {chartLoading ? (
                <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                  {t('common:actions.loading')}
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                  <LineChart data={revenueData}>
                    <CartesianGrid stroke={CHART.grid} vertical={false} />
                    <XAxis dataKey="month" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke={CHART.axis}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${Number(v) / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={CHART.tooltip}
                      formatter={(v) => [formatRub(Number(v)), t('dashboard.revenue.chart')]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={CHART.accent}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </AnalyticsWidget>
        </DashboardGridItem>

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
                <p className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{t('dashboard.activeClients.empty')}</p>
              ) : (
                activeClients.map((c) => (
                  <div key={c.id} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[var(--surface3)]">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--accent-dim)] text-[9px] font-bold text-[var(--accent)]">
                      {c.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{c.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {c.lastSession ?? t('dashboard.activeClients.noSessions')}
                      </p>
                    </div>
                    <Badge variant="success" className="shrink-0 px-1.5 py-0 text-[10px]">
                      {statusLabel(c.status)}
                    </Badge>
                  </div>
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
                <p className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{t('dashboard.schedule.empty')}</p>
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
