import { useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Clock3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useClients, useEvents, useTrainerAnalytics } from '@/features/api/hooks'
import { generateRevenueSeries } from '@/lib/mock-data'
import { formatRub } from '@/lib/utils'
import { CHART } from '@/lib/chart-theme'
import { cn } from '@/lib/utils'
import type { ClientStatus } from '@/types'

const statusLabels: Record<ClientStatus, string> = {
  active: 'Активен',
  pause: 'Пауза',
  archive: 'Архив',
}

const chartPeriods = [
  { id: '7d', label: '7д', days: 7 },
  { id: '30d', label: '30д', days: 30 },
  { id: '90d', label: '90д', days: 90 },
  { id: 'year', label: 'Год', days: 365 },
] as const

type ChartPeriodId = (typeof chartPeriods)[number]['id']

export function TrainerDashboardPage() {
  const { data: clients = [], isLoading: clientsLoading } = useClients()
  const { data: analytics } = useTrainerAnalytics()
  const { data: events = [] } = useEvents()
  const [chartPeriod, setChartPeriod] = useState<ChartPeriodId>('30d')
  const periodDays = chartPeriods.find((p) => p.id === chartPeriod)?.days ?? 30
  const revenueData = useMemo(() => generateRevenueSeries(periodDays), [periodDays])
  const periodTotal = useMemo(() => revenueData.reduce((s, p) => s + p.revenue, 0), [revenueData])

  const activeCount = analytics?.activeClients ?? clients.filter((c) => c.status === 'active').length
  const upcoming = [...events].sort((a, b) => a.start.localeCompare(b.start)).slice(0, 6)
  const activeClients = clients.filter((c) => c.status === 'active').slice(0, 5)

  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const stats = [
    { label: 'Клиенты', value: clientsLoading ? '…' : String(activeCount), change: '↑ +3 за неделю', accent: true },
    { label: 'Доход (май)', value: formatRub(analytics?.monthlyRevenue ?? 0), change: '↑ +18%' },
    { label: 'Тренировок', value: String(analytics?.weeklySessions ?? 0), change: 'за эту неделю' },
    { label: 'Выполнение', value: '91%', change: '↑ +4%' },
  ]

  return (
    <div className="page-container overflow-x-hidden">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 md:mb-7">
        <div className="min-w-0">
          <h1 className="page-title text-xl md:text-2xl">Дашборд</h1>
          <p className="page-sub max-w-full truncate capitalize md:whitespace-normal">{today} · Отличный день!</p>
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
          <p className="stat-label">Клиенты</p>
          <p className="stat-value text-[var(--accent)]">{clientsLoading ? '…' : String(activeCount)}</p>
          <p className="stat-change">↑ +3 за неделю</p>
        </div>
        <div className="dash-grid-cell">
          <p className="stat-label">Доход (май)</p>
          <p className="stat-value">{formatRub(analytics?.monthlyRevenue ?? 0)}</p>
          <p className="stat-change">↑ +18%</p>
        </div>
        <div className="dash-grid-cell">
          <p className="stat-label">Тренировок</p>
          <p className="stat-value">{String(analytics?.weeklySessions ?? 0)}</p>
          <p className="stat-change">за эту неделю</p>
        </div>
        <div className="dash-grid-cell">
          <p className="stat-label">Выполнение</p>
          <p className="stat-value">91%</p>
          <p className="stat-change">↑ +4%</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Выручка</CardTitle>
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
                {p.label}
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
              <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [formatRub(Number(v)), 'Выручка']} />
              <Line type="monotone" dataKey="revenue" stroke={CHART.accent} strokeWidth={2.4} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Активные клиенты</CardTitle>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Последняя активность</p>
            </div>
            <Badge variant="secondary">{activeClients.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-[var(--border)] p-0 pt-0">
            {activeClients.length === 0 ? (
              <p className="px-5 py-4 text-sm text-[var(--text-muted)]">Нет активных клиентов</p>
            ) : (
              activeClients.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--surface3)]/50">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--accent-dim)] text-[10px] font-bold text-[var(--accent)]">
                    {c.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{c.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{c.lastSession ?? 'Нет сессий'}</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                    {statusLabels[c.status]}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Расписание на сегодня</CardTitle>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Ближайшие сессии</p>
            </div>
            <Clock3 className="h-4 w-4 text-[var(--text-muted)]" />
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-[var(--border)] p-0 pt-0">
            {upcoming.length === 0 ? (
              <p className="px-5 py-4 text-sm text-[var(--text-muted)]">Нет событий</p>
            ) : (
              upcoming.slice(0, 5).map((e) => (
                <div key={e.id} className="flex gap-3 px-5 py-3 hover:bg-[var(--surface3)]/50">
                  <span className="min-w-[40px] pt-0.5 text-[11px] text-[var(--text-muted)]">
                    {new Date(e.start).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{e.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{e.type ?? 'тренировка'}</p>
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
