import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SaasPageHeader } from '@/components/saas'
import { StatCard } from '@/components/shared/stat-card'
import { useClients, usePayments, queryKeys } from '@/features/api/hooks'
import { createPayment, exportPaymentsCsv, getPaymentProviderConfig, getPaymentReport } from '@/features/api/payments-service'
import { formatRub, formatDate } from '@/lib/utils'
import { Download } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getRevenueChart } from '@/features/api/analytics-service'
import { CHART } from '@/lib/chart-theme'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function FinancePage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: payments = [] } = usePayments()
  const { data: clients = [] } = useClients()
  const qc = useQueryClient()
  const [clientId, setClientId] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [sessions, setSessions] = useState('8')
  const [reportFrom, setReportFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10))
  const [reportTo, setReportTo] = useState(new Date().toISOString().slice(0, 10))

  const defaultMethod = t('finance.defaultMethod')
  const paymentMethod = method || defaultMethod

  const { data: periodReport } = useQuery({
    queryKey: ['payment-report', reportFrom, reportTo],
    queryFn: () => getPaymentReport(reportFrom, reportTo),
  })
  const { data: revenueChart = [] } = useQuery({
    queryKey: ['finance-revenue-chart'],
    queryFn: getRevenueChart,
  })

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const monthPrefix = new Date().toISOString().slice(0, 7)
  const thisMonth = payments.filter((p) => p.date.startsWith(monthPrefix)).reduce((s, p) => s + p.amount, 0)
  const provider = getPaymentProviderConfig()

  const createMut = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.payments })
      qc.invalidateQueries({ queryKey: queryKeys.clients })
      toast.success(t('finance.toast.saved'))
      setAmount('')
    },
    onError: () => toast.error(t('common:saveError')),
  })

  const clientMap = new Map(clients.map((c) => [c.id, c.name]))

  return (
    <div className="page-container">
      <SaasPageHeader
        title={t('finance.title')}
        description={
          provider.enabled
            ? t('finance.provider', { name: provider.provider })
            : t('finance.integrationStub')
        }
        breadcrumbs={[
          { label: t('dashboard.breadcrumb.app'), href: '/trainer' },
          { label: t('finance.title') },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportPaymentsCsv(payments, clientMap)}
          >
            <Download className="h-4 w-4" /> {t('common:actions.exportCsv')}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label={t('finance.stats.total')} value={formatRub(total)} />
        <StatCard label={t('finance.stats.currentMonth')} value={formatRub(thisMonth)} highlight />
        <StatCard label={t('finance.stats.period')} value={formatRub(periodReport?.total ?? 0)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.charts.revenueByMonth')}</CardTitle>
        </CardHeader>
        <CardContent className="chart-mobile h-56 pt-0">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <BarChart data={revenueChart}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="month" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${Number(v) / 1000}k`} />
              <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [formatRub(Number(v)), t('dashboard.revenue.chart')]} />
              <Bar dataKey="revenue" fill={CHART.accent} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('finance.report.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label>{t('finance.report.from')}</Label>
            <Input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('finance.report.to')}</Label>
            <Input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {t('finance.report.total')} <strong className="text-[var(--accent)]">{formatRub(periodReport?.total ?? 0)}</strong>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('common:actions.addPayment')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5 lg:col-span-2">
            <Label>{t('finance.fields.client')}</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder={t('finance.fields.clientPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t('finance.fields.amount')}</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('finance.fields.method')}</Label>
            <Input value={method} placeholder={defaultMethod} onChange={(e) => setMethod(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('finance.fields.sessionsInPackage')}</Label>
            <Input type="number" value={sessions} onChange={(e) => setSessions(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button
              className="w-full"
              disabled={createMut.isPending || !clientId || !amount}
              onClick={() =>
                createMut.mutate({
                  clientId,
                  amount: Number(amount),
                  date: new Date().toISOString().slice(0, 10),
                  method: paymentMethod,
                  sessionsAdded: Number(sessions) || 0,
                })
              }
            >
              {t('common:actions.save')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mobile-table-cards">
        {payments.map((p) => (
          <div key={p.id} className="mobile-table-card">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{clientMap.get(p.clientId) ?? p.clientId}</p>
              <p className="font-display text-lg font-bold tabular-nums text-[var(--accent)]">{formatRub(p.amount)}</p>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">{formatDate(p.date)} · {p.method}</p>
            {p.note ? <p className="mt-1 text-xs text-[var(--text-secondary)]">{p.note}</p> : null}
          </div>
        ))}
      </div>

      <div className="mobile-table-desktop overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface2)]">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              <th className="px-5 py-3.5">{t('finance.table.client')}</th>
              <th className="px-5 py-3.5">{t('finance.table.amount')}</th>
              <th className="px-5 py-3.5">{t('finance.table.date')}</th>
              <th className="px-5 py-3.5">{t('finance.table.method')}</th>
              <th className="px-5 py-3.5">{t('finance.table.note')}</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-[var(--border)] transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-medium">{clientMap.get(p.clientId) ?? p.clientId}</td>
                <td className="px-5 py-3.5 font-display text-[15px] font-bold tabular-nums text-[var(--accent)]">{formatRub(p.amount)}</td>
                <td className="px-5 py-3.5 text-[var(--text-secondary)]">{formatDate(p.date)}</td>
                <td className="px-5 py-3.5 text-[var(--text-muted)]">{p.method}</td>
                <td className="px-5 py-3.5 text-[var(--text-muted)]">{p.note ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
