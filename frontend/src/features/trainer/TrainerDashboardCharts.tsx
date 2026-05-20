import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticsWidget, DashboardGridItem } from '@/components/saas'
import { CHART } from '@/lib/chart-theme'
import { formatRub } from '@/lib/utils'
import { cn } from '@/lib/utils'

const chartPeriods = [
  { id: '6m', labelKey: 'dashboard.period.d90', months: 6 },
  { id: '12m', labelKey: 'dashboard.period.year', months: 12 },
] as const

export type ChartPeriodId = (typeof chartPeriods)[number]['id']

type Props = {
  attendanceChart: { week: string; sessions: number }[]
  revenueData: { month: string; revenue: number }[]
  chartLoading: boolean
  chartPeriod: ChartPeriodId
  onChartPeriodChange: (id: ChartPeriodId) => void
}

export function TrainerDashboardCharts({
  attendanceChart,
  revenueData,
  chartLoading,
  chartPeriod,
  onChartPeriodChange,
}: Props) {
  const { t } = useTranslation(['trainer', 'common'])

  return (
    <>
      <DashboardGridItem span={4}>
        <AnalyticsWidget title={t('dashboard.preview.attendance')} height={200}>
          <div className="chart-mobile h-[180px] min-h-[160px]">
            {attendanceChart.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                {t('common:empty.noData')}
              </p>
            ) : (
            <ResponsiveContainer width="100%" height="100%" minHeight={160}>
              <BarChart data={attendanceChart}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="week" stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART.axis} fontSize={10} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={CHART.tooltip} />
                <Bar dataKey="sessions" fill={CHART.accent} radius={[3, 3, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </AnalyticsWidget>
      </DashboardGridItem>

      <DashboardGridItem span={4}>
        <AnalyticsWidget
          title={t('dashboard.revenue.title')}
          height={220}
          actions={
            <div className="flex gap-0.5 rounded-[var(--radius-sm)] bg-[var(--surface3)] p-0.5">
              {chartPeriods.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChartPeriodChange(p.id)}
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
    </>
  )
}
