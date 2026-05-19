import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { useClients, usePayments, queryKeys } from '@/features/api/hooks'
import { createPayment, exportPaymentsCsv, getPaymentProviderConfig, getPaymentReport } from '@/features/api/payments-service'
import { formatRub, formatDate } from '@/lib/utils'
import { Download } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function FinancePage() {
  const { data: payments = [] } = usePayments()
  const { data: clients = [] } = useClients()
  const qc = useQueryClient()
  const [clientId, setClientId] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('Карта')
  const [sessions, setSessions] = useState('8')
  const [reportFrom, setReportFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10))
  const [reportTo, setReportTo] = useState(new Date().toISOString().slice(0, 10))

  const { data: periodReport } = useQuery({
    queryKey: ['payment-report', reportFrom, reportTo],
    queryFn: () => getPaymentReport(reportFrom, reportTo),
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
      toast.success('Оплата сохранена, баланс обновлён')
      setAmount('')
    },
    onError: () => toast.error('Ошибка сохранения'),
  })

  const clientMap = new Map(clients.map((c) => [c.id, c.name]))

  return (
    <div className="page-container">
      <PageHeader
        title="Финансы"
        description={provider.enabled ? `Провайдер: ${provider.provider}` : 'Интеграция оплаты: заглушка (Stripe/YooKassa)'}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportPaymentsCsv(payments, clientMap)}
          >
            <Download className="h-4 w-4" /> Экспорт CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Всего получено" value={formatRub(total)} />
        <StatCard label="Текущий месяц" value={formatRub(thisMonth)} highlight />
        <StatCard label="За период" value={formatRub(periodReport?.total ?? 0)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Отчёт за период</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label>С</Label>
            <Input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>По</Label>
            <Input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Итого: <strong className="text-[var(--accent)]">{formatRub(periodReport?.total ?? 0)}</strong>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Добавить оплату</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5 lg:col-span-2">
            <Label>Клиент</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите клиента" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Сумма</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Метод</Label>
            <Input value={method} onChange={(e) => setMethod(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Занятий в пакет</Label>
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
                  method,
                  sessionsAdded: Number(sessions) || 0,
                })
              }
            >
              Сохранить
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
              <th className="px-5 py-3.5">Клиент</th>
              <th className="px-5 py-3.5">Сумма</th>
              <th className="px-5 py-3.5">Дата</th>
              <th className="px-5 py-3.5">Метод</th>
              <th className="px-5 py-3.5">Примечание</th>
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
