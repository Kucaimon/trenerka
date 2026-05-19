import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Clock3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useClients, useEvents, useTrainerAnalytics } from '@/features/api/hooks'
import { generateRevenueSeries } from '@/lib/mock-data'
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

export function TrainerDashboardPage() {
  const { t, i18n } = useTranslation(['trainer', 'common'])
  const { data: clients = [], isLoading: clientsLoading } = useClients()
  const { data: analytics } = useTrainerAnalytics()
  const { data: events = [] } = useEvents()
  const [chartPeriod, setChartPeriod] = useState<ChartPeriodId>('30d')
  const periodDays = chartPeriods.find((p) => p.id === chartPeriod)?.days ?? 30
  const revenueData = useMemo(() => generateRevenueSeries(periodDays), [periodDays])
  const periodTotal = useMemo(() => revenueData.reduce((s, p) => s + p.revenue, 0), [revenueData])

  const statusLabel = (status: ClientStatus) => t(`common:status.${status}`)

  const activeCount = analytics?.activeClients ?? clients.filter((c) => c.status === 'active').length
  const upcoming = [...events].sort((a, b) => a.start.localeCompare(b.start)).slice(0, 6)
  const activeClients = clients.filter((c) => c.status === 'active').slice(0, 5)

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
    { label: t('dashboard.stats.completion'), value: '91%', change: t('dashboard.change.completion') },
  ]

  return (
    <div className="page-container overflow-x-hidden">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 md:mb-7">
        <div className="min-w-0">
          <h1 className="page-title text-xl md:text-2xl">{t('dashboard.title')}</h1>
          <p className="page-sub max-w-full truncate capitalize md:whitespace-normal">{today} · {t('dashboard.greeting')}</p>
        </div>
      </div>

      <div className="trainer-mobile-stat-stack mb-5">
        {stats.map((stat) => (
          <div key={stat.label} className="trainer-mobile-stat-card">
            <div>
              <p className="stat-label">{stat.label}</p>
              <p className={cn('stat-value text-2xl', stat.accent && 'text-[var(--accent)]')}>{stat.value}</p>
            </div>
            <p className="stat-change text-right">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="dash-grid trainer-desktop-stat-grid mb-5 w-full">
        <div className="dash-grid-cell">
          <p className="stat-label">{t('dashboard.stats.clients')}</p>
          <p className="stat-value text-[var(--accent)]">{clientsLoading ? '…' : String(activeCount)}</p>
          <p className="stat-change">{t('dashboard.change.weekClients')}</p>
        </div>
        <div className="dash-grid-cell">
          <p className="stat-label">{t('dashboard.stats.revenueMay')}</p>
          <p className="stat-value">{formatRub(analytics?.monthlyRevenue ?? 0)}</p>
          <p className="stat-change">{t('dashboard.change.revenue')}</p>
        </div>
        <div className="dash-grid-cell">
          <p className="stat-label">{t('dashboard.stats.workouts')}</p>
          <p className="stat-value">{String(analytics?.weeklySessions ?? 0)}</p>
          <p className="stat-change">{t('dashboard.change.thisWeek')}</p>
        </div>
        <div className="dash-grid-cell">
          <p className="stat-label">{t('dashboard.stats.completion')}</p>
          <p className="stat-value">91%</p>
          <p className="stat-change">{t('dashboard.change.completion')}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{t('dashboard.revenue.title')}</CardTitle>
            <p className="font-display mt-1 text-2xl font-extrabold text-[var(--accent)] md:text-[28px]">
              {formatRub(periodTotal)}
            </p>
          </div>
          <div className="flex gap-0.5 rounded-md bg-[var(--surface3)] p-0.5">
            {chartPeriods.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setChartPeriod(p.id)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs transition-colors',
                  chartPeriod === p.id
                    ? 'bg-[var(--surface2)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                )}
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="chart-mobile h-[220px] min-h-[200px] pt-0 md:h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <LineChart data={revenueData}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="label" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Number(v) / 1000}k`} />
              <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [formatRub(Number(v)), t('dashboard.revenue.chart')]} />
              <Line type="monotone" dataKey="revenue" stroke={CHART.accent} strokeWidth={2.4} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t('dashboard.activeClients.title')}</CardTitle>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t('dashboard.activeClients.subtitle')}</p>
            </div>
            <Badge variant="secondary">{activeClients.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-[var(--border)] p-0 pt-0">
            {activeClients.length === 0 ? (
              <p className="px-5 py-4 text-sm text-[var(--text-muted)]">{t('dashboard.activeClients.empty')}</p>
            ) : (
              activeClients.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--surface3)]/50">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--accent-dim)] text-[10px] font-bold text-[var(--accent)]">
                    {c.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{c.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{c.lastSession ?? t('dashboard.activeClients.noSessions')}</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                    {statusLabel(c.status)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t('dashboard.schedule.title')}</CardTitle>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t('dashboard.schedule.subtitle')}</p>
            </div>
            <Clock3 className="h-4 w-4 text-[var(--text-muted)]" />
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-[var(--border)] p-0 pt-0">
            {upcoming.length === 0 ? (
              <p className="px-5 py-4 text-sm text-[var(--text-muted)]">{t('dashboard.schedule.empty')}</p>
            ) : (
              upcoming.slice(0, 5).map((e) => (
                <div key={e.id} className="flex gap-3 px-5 py-3 hover:bg-[var(--surface3)]/50">
                  <span className="min-w-[40px] pt-0.5 text-[11px] text-[var(--text-muted)]">
                    {new Date(e.start).toLocaleTimeString(intlLocale(i18n.language), { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{e.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{e.type ?? t('dashboard.eventTypeDefault')}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
