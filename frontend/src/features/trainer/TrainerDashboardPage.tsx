import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Clock3, CreditCard, Dumbbell, MessageSquare } from 'lucide-react'
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
    {
      label: t('dashboard.stats.clients'),
      value: clientsLoading ? '…' : String(activeCount),
      change: t('dashboard.change.weekClients'),
      accent: true,
    },
    {
      label: t('dashboard.stats.revenueMay'),
      value: formatRub(analytics?.monthlyRevenue ?? 0),
      change: t('dashboard.change.revenue'),
    },
    {
      label: t('dashboard.stats.workouts'),
      value: String(analytics?.weeklySessions ?? 0),
      change: t('dashboard.change.thisWeek'),
    },
    {
      label: t('dashboard.stats.completion'),
      value: '91%',
      change: t('dashboard.change.completion'),
    },
  ]

  const activityItems = useMemo(() => {
    const items: { id: string; icon: typeof CreditCard; label: string; time: string }[] = []
    clients.slice(0, 2).forEach((c, i) => {
      items.push({
        id: `pay-${c.id}`,
        icon: CreditCard,
        label: t('dashboard.activity.payment', { amount: formatRub(3500 + i * 500) }),
        time: c.name,
      })
    })
    clients.slice(2, 4).forEach((c) => {
      items.push({
        id: `sess-${c.id}`,
        icon: Dumbbell,
        label: t('dashboard.activity.session'),
        time: c.name,
      })
    })
    if (analytics?.unreadMessages) {
      items.push({
        id: 'msg',
        icon: MessageSquare,
        label: t('dashboard.activity.message'),
        time: clients[0]?.name ?? '',
      })
    }
    return items.slice(0, 5)
  }, [clients, analytics?.unreadMessages, t])

  return (
    <div className="page-container overflow-x-hidden">
      <header className="saas-page-header">
        <div className="min-w-0">
          <h1 className="saas-page-header__title">{t('dashboard.title')}</h1>
          <p className="saas-page-header__sub capitalize md:normal-case">{today} · {t('dashboard.greeting')}</p>
        </div>
      </header>

      <div className="saas-metrics mb-5">
        {stats.map((stat) => (
          <div key={stat.label} className="saas-metric">
            <p className="saas-metric__label">{stat.label}</p>
            <p className={cn('saas-metric__value', stat.accent && 'saas-metric__value--accent')}>{stat.value}</p>
            <p className={cn('saas-metric__change', stat.accent && 'saas-metric__change--up')}>{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="saas-dash-grid">
        <Card className="saas-dash-grid__chart">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>{t('dashboard.revenue.title')}</CardTitle>
              <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-[var(--text-primary)]">
                {formatRub(periodTotal)}
              </p>
            </div>
            <div className="flex gap-0.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-0.5">
              {chartPeriods.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setChartPeriod(p.id)}
                  className={cn(
                    'rounded-[var(--radius-sm)] px-2.5 py-1 text-xs transition-colors',
                    chartPeriod === p.id
                      ? 'bg-[var(--surface3)] text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                  )}
                >
                  {t(p.labelKey)}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="chart-mobile h-[200px] min-h-[180px] pt-0 md:h-[220px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={180}>
              <LineChart data={revenueData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="label" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Number(v) / 1000}k`} />
                <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [formatRub(Number(v)), t('dashboard.revenue.chart')]} />
                <Line type="monotone" dataKey="revenue" stroke={CHART.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t('dashboard.activeClients.title')}</CardTitle>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{t('dashboard.activeClients.subtitle')}</p>
            </div>
            <Badge variant="secondary">{activeClients.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-[var(--border)] p-0 pt-0">
            {activeClients.length === 0 ? (
              <p className="px-4 py-4 text-sm text-[var(--text-muted)]">{t('dashboard.activeClients.empty')}</p>
            ) : (
              activeClients.map((c) => (
                <div key={c.id} className="saas-list-row">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface3)] text-[10px] font-semibold text-[var(--accent)]">
                    {c.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{c.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{c.lastSession ?? t('dashboard.activeClients.noSessions')}</p>
                  </div>
                  <span className="rounded-[var(--radius-sm)] border border-[var(--accent-soft)] bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]">
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
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{t('dashboard.schedule.subtitle')}</p>
            </div>
            <Clock3 className="h-4 w-4 text-[var(--text-muted)]" />
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-[var(--border)] p-0 pt-0">
            {upcoming.length === 0 ? (
              <p className="px-4 py-4 text-sm text-[var(--text-muted)]">{t('dashboard.schedule.empty')}</p>
            ) : (
              upcoming.slice(0, 5).map((e) => (
                <div key={e.id} className="saas-list-row">
                  <span className="min-w-[40px] text-[11px] tabular-nums text-[var(--text-muted)]">
                    {new Date(e.start).toLocaleTimeString(intlLocale(i18n.language), { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{e.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{e.type ?? t('dashboard.eventTypeDefault')}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t('dashboard.activity.title')}</CardTitle>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{t('dashboard.activity.subtitle')}</p>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-[var(--border)] p-0 pt-0">
            {activityItems.length === 0 ? (
              <p className="px-4 py-4 text-sm text-[var(--text-muted)]">{t('dashboard.activity.empty')}</p>
            ) : (
              activityItems.map((item) => (
                <div key={item.id} className="saas-list-row">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface3)]">
                    <item.icon className="h-3.5 w-3.5 text-[var(--text-secondary)]" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{item.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{item.time}</p>
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
