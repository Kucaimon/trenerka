import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(['trainer', 'common'])
  const [period, setPeriod] = useState('6m')
  const { data: analytics } = useTrainerAnalytics()
  const { data: revenueData = [], isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: getRevenueChart,
  })
  const { data: retentionData = [], isLoading: retentionLoading } = useQuery({
    queryKey: ['retention-chart'],
    queryFn: getRetentionChart,
  })
  const { data: attendanceData = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance-chart'],
    queryFn: getAttendanceChart,
  })
  const { data: weekdayData = [], isLoading: weekdayLoading } = useQuery({
    queryKey: ['weekday-chart'],
    queryFn: getWeekdayActivityChart,
  })
  const { data: subscriptionData = [], isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription-chart'],
    queryFn: getSubscriptionMixChart,
  })
  const subscriptionHasData = subscriptionData.some((s) => s.value > 0)

  return (
    <div className="page-container">
      <PageHeader
        title={t('analytics.title')}
        description={t('analytics.description')}
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">{t('analytics.period.m3')}</SelectItem>
              <SelectItem value="6m">{t('analytics.period.m6')}</SelectItem>
              <SelectItem value="12m">{t('analytics.period.m12')}</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard label={t('analytics.stats.mrr')} value={formatRub(analytics?.monthlyRevenue ?? 0)} icon={Wallet} highlight />
        <StatCard label={t('analytics.stats.clients')} value={String(analytics?.activeClients ?? 0)} icon={Repeat2} />
        <StatCard label={t('analytics.stats.sessionsPerWeek')} value={String(analytics?.weeklySessions ?? 0)} icon={CalendarCheck2} />
        <StatCard label={t('analytics.stats.unread')} value={String(analytics?.unreadMessages ?? 0)} icon={Activity} />
      </div>

      <div className="grid gap-4 overflow-x-hidden xl:grid-cols-2">
        <Card className="chart-grid-bg">
          <CardHeader>
            <CardTitle>{t('analytics.charts.revenueByMonth')}</CardTitle>
          </CardHeader>
          <CardContent className="chart-mobile h-64 min-h-[200px] pt-0 md:h-72">
            {revenueLoading ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:actions.loading')}
              </p>
            ) : revenueData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:empty.noData')}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <BarChart data={revenueData}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="month" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Number(v) / 1000}k`} />
                  <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [formatRub(Number(v)), t('analytics.tooltip.revenue')]} />
                  <Bar dataKey="revenue" fill={CHART.accent} radius={[5, 5, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.charts.retention')}</CardTitle>
          </CardHeader>
          <CardContent className="chart-mobile h-64 min-h-[200px] pt-0 md:h-72">
            {retentionLoading ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:actions.loading')}
              </p>
            ) : retentionData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:empty.noData')}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <AreaChart data={retentionData}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="month" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={CHART.axis} fontSize={11} domain={[80, 100]} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}%`, t('analytics.tooltip.retention')]} />
                  <Area type="monotone" dataKey="rate" stroke={CHART.emerald} fill="rgba(184,245,61,0.12)" strokeWidth={2} dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.charts.weekdayActivity')}</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-0">
            {weekdayLoading ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:actions.loading')}
              </p>
            ) : weekdayData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:empty.noData')}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayData}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="day" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}`, t('analytics.tooltip.sessions')]} />
                  <Bar dataKey="sessions" fill={CHART.line} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.charts.subscriptionMix')}</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-0">
            {subscriptionLoading ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:actions.loading')}
              </p>
            ) : !subscriptionHasData ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:empty.noData')}
              </p>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t('analytics.charts.attendance')}</CardTitle>
          </CardHeader>
          <CardContent className="h-56 pt-0">
            {attendanceLoading ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:actions.loading')}
              </p>
            ) : attendanceData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:empty.noData')}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="week" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}`, t('analytics.tooltip.sessions')]} />
                  <Bar dataKey="sessions" fill={CHART.accent} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
