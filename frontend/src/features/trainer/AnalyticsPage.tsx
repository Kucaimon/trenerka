import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  getAttendanceChart,
  getRetentionChart,
  getRevenueChart,
  getSubscriptionMixChart,
  getWeekdayActivityChart,
} from '@/features/api/analytics-service'
import { useTrainerAnalytics } from '@/features/api/hooks'
import { formatRub } from '@/lib/utils'
import { CHART } from '@/lib/chart-theme'
import { Activity, CalendarCheck2, Repeat2, Wallet } from 'lucide-react'

export function AnalyticsPage() {
  const [period, setPeriod] = useState('6m')
  const { data: analytics } = useTrainerAnalytics()
  const { data: mockRevenueData = [] } = useQuery({ queryKey: ['revenue-chart'], queryFn: getRevenueChart })
  const { data: mockRetentionData = [] } = useQuery({ queryKey: ['retention-chart'], queryFn: getRetentionChart })
  const { data: mockAttendanceData = [] } = useQuery({ queryKey: ['attendance-chart'], queryFn: getAttendanceChart })
  const { data: weekdayData = [] } = useQuery({ queryKey: ['weekday-chart'], queryFn: getWeekdayActivityChart })
  const { data: subscriptionData = [] } = useQuery({ queryKey: ['subscription-chart'], queryFn: getSubscriptionMixChart })

  return (
    <div className="page-container">
      <PageHeader
        title="Аналитика"
        description="Выручка, удержание, загрузка по дням недели и структура подписок."
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 мес.</SelectItem>
              <SelectItem value="6m">6 мес.</SelectItem>
              <SelectItem value="12m">12 мес.</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard label="MRR" value={formatRub(analytics?.monthlyRevenue ?? 0)} icon={Wallet} highlight />
        <StatCard label="Клиенты" value={String(analytics?.activeClients ?? 0)} icon={Repeat2} />
        <StatCard label="Сессии / нед." value={String(analytics?.weeklySessions ?? 0)} icon={CalendarCheck2} />
        <StatCard label="Непрочитанные" value={String(analytics?.unreadMessages ?? 0)} icon={Activity} />
      </div>

      <div className="grid gap-4 overflow-x-hidden xl:grid-cols-2">
        <Card className="metric-grid">
          <CardHeader>
            <CardTitle>Выручка по месяцам</CardTitle>
          </CardHeader>
          <CardContent className="chart-mobile h-64 min-h-[200px] pt-0 md:h-72">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <BarChart data={mockRevenueData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="month" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Number(v) / 1000}к`} />
                <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [formatRub(Number(v)), 'Выручка']} />
                <Bar dataKey="revenue" fill={CHART.accent} radius={[5, 5, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Удержание клиентов</CardTitle>
          </CardHeader>
          <CardContent className="chart-mobile h-64 min-h-[200px] pt-0 md:h-72">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <AreaChart data={mockRetentionData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="month" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={11} domain={[80, 100]} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}%`, 'Удержание']} />
                <Area type="monotone" dataKey="rate" stroke={CHART.emerald} fill="rgba(184,245,61,0.12)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Активность по дням недели</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="day" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}`, 'Сессии']} />
                <Bar dataKey="sessions" fill={CHART.line} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Структура подписок</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subscriptionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={2}>
                  {subscriptionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color ?? CHART.accent} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART.tooltip} formatter={(v, _n, item) => [`${v}%`, item.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {subscriptionData.map((s) => (
                <span key={s.name} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Посещаемость по неделям</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAttendanceData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="week" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}`, 'Сессии']} />
                <Bar dataKey="sessions" fill={CHART.accent} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
