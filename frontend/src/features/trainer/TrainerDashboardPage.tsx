import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Clock3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SaasPageHeader } from '@/components/saas'
import { useClients, useEvents, useTrainerAnalytics } from '@/features/api/hooks'
import { generateRevenueSeries, mockActivityFeed } from '@/lib/mock-data'
import { formatRub } from '@/lib/utils'
import { CHART } from '@/lib/chart-theme'
import { cn } from '@/lib/utils'
import { intlLocale } from '@/lib/i18n-format'
import type { ClientStatus } from '@/types'

const chartPeriods = [
  { id: '7d', labelKey: 'dashboard.period.d7', days: 7 },
  { id: '30d', labelKey: 'dashboard.period.d30', days: 30 },
  { id: '90d', labelKey: 'dashboard.period.d90', days: 90 },
  { id: 'year', labelKey: 'dashboard.period.year', days: 365 },
] as const

type ChartPeriodId = (typeof chartPeriods)[number]['id']

function formatActivityTime(iso: string, locale: string) {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  return date.toLocaleDateString(intlLocale(locale), { day: 'numeric', month: 'short' })
}

export function TrainerDashboardPage() {
  const { t, i18n } = useTranslation(['trainer', 'common'])
  const { data: clients = [], isLoading: clientsLoading } = useClients()
  const { data: analytics } = useTrainerAnalytics()
  const { data: events = [] } = useEvents()
  const [chartPeriod, setChartPeriod] = useState<ChartPeriodId>('30d')
  const periodDays = chartPeriods.find((p) => p.id === chartPeriod)?.days ?? 30
  const revenueData = useMemo(() => generateRevenueSeries(periodDays), [periodDays])
  const periodTotal = useMemo(() => revenueData.reduce((s, p) => s + p.revenue, 0), [revenueData])
  const activityItems = useMemo(() => mockActivityFeed.slice(0, 12), [])

  const statusLabel = (status: ClientStatus) => t(`common:status.${status}`)

  const activeCount = analytics?.activeClients ?? clients.filter((c) => c.status === 'active').length
  const unreadCount = analytics?.unreadMessages ?? 0
  const upcoming = [...events].sort((a, b) => a.start.localeCompare(b.start)).slice(0, 6)
  const activeClients = clients.filter((c) => c.status === 'active').slice(0, 6)

  const today = new Date().toLocaleDateString(intlLocale(i18n.language), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const stats = [
    { label: t('dashboard.stats.clients'), value: clientsLoading ? '…' : String(activeCount), change: t('dashboard.change.weekClients'), accent: true },
    { label: t('dashboard.stats.revenueMay'), value: formatRub(analytics?.monthlyRevenue ?? 0), change: t('dashboard.change.revenue') },
    { label: t('dashboard.stats.workouts'), value: String(analytics?.weeklySessions ?? 0), change: t('dashboard.change.thisWeek') },
    { label: t('dashboard.stats.unread'), value: String(unreadCount), change: t('dashboard.change.unread') },
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

      <div className="saas-metric-grid mb-4">
        {stats.map((stat) => (
          <div key={stat.label} className="saas-metric-cell">
            <p className="saas-metric-cell__label">{stat.label}</p>
            <p className={cn('saas-metric-cell__value', stat.accent && 'text-[var(--accent)]')}>{stat.value}</p>
            <p className="saas-metric-cell__hint">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="saas-dash-layout">
        <div className="saas-dash-main">
          <section className="saas-panel saas-dash-chart">
            <div className="saas-panel__header">
              <div>
                <h2 className="saas-panel__title">{t('dashboard.revenue.title')}</h2>
                <p className="saas-panel__sub tabular-nums">{t('dashboard.revenue.periodTotal', { amount: formatRub(periodTotal) })}</p>
              </div>
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
            </div>
            <div className="saas-panel__body chart-mobile h-[200px] min-h-[180px] pt-0 md:h-[220px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <LineChart data={revenueData}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="label" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Number(v) / 1000}k`} />
                  <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [formatRub(Number(v)), t('dashboard.revenue.chart')]} />
                  <Line type="monotone" dataKey="revenue" stroke={CHART.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="saas-panel saas-dash-side-a">
            <div className="saas-panel__header">
              <div>
                <h2 className="saas-panel__title">{t('dashboard.activeClients.title')}</h2>
                <p className="saas-panel__sub">{t('dashboard.activeClients.subtitle')}</p>
              </div>
              <Badge variant="secondary">{activeClients.length}</Badge>
            </div>
            <div className="saas-panel__body saas-panel__body--flush divide-y divide-[var(--border)]">
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
                      <p className="text-[11px] text-[var(--text-muted)]">{c.lastSession ?? t('dashboard.activeClients.noSessions')}</p>
                    </div>
                    <Badge variant="success" className="shrink-0 px-1.5 py-0 text-[10px]">
                      {statusLabel(c.status)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="saas-panel saas-dash-side-b">
            <div className="saas-panel__header">
              <div>
                <h2 className="saas-panel__title">{t('dashboard.schedule.title')}</h2>
                <p className="saas-panel__sub">{t('dashboard.schedule.subtitle')}</p>
              </div>
              <Clock3 className="h-4 w-4 text-[var(--text-muted)]" />
            </div>
            <div className="saas-panel__body saas-panel__body--flush divide-y divide-[var(--border)]">
              {upcoming.length === 0 ? (
                <p className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{t('dashboard.schedule.empty')}</p>
              ) : (
                upcoming.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex gap-2.5 px-3 py-1.5 hover:bg-[var(--surface3)]">
                    <span className="min-w-[40px] pt-0.5 text-[11px] tabular-nums text-[var(--text-muted)]">
                      {new Date(e.start).toLocaleTimeString(intlLocale(i18n.language), { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{e.title}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{e.type ?? t('dashboard.eventTypeDefault')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="saas-panel saas-dash-activity flex flex-col md:flex">
          <div className="saas-panel__header">
            <div>
              <h2 className="saas-panel__title">{t('dashboard.activity.title')}</h2>
              <p className="saas-panel__sub">{t('dashboard.activity.subtitle')}</p>
            </div>
          </div>
          <div className="saas-panel__body saas-panel__body--flush max-h-[420px] flex-1 overflow-y-auto p-0 md:max-h-none">
            {activityItems.length === 0 ? (
              <p className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{t('dashboard.activity.empty')}</p>
            ) : (
              activityItems.map((item) => (
                <div key={item.id} className="saas-activity-item">
                  <time className="saas-activity-item__time" dateTime={item.createdAt}>
                    {formatActivityTime(item.createdAt, i18n.language)}
                  </time>
                  <div className="min-w-0">
                    <p className="saas-activity-item__title">{item.title}</p>
                    <p className="saas-activity-item__body line-clamp-1">{item.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}