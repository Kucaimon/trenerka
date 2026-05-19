import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminStats } from '@/features/api/hooks'
import { formatRub } from '@/lib/utils'

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Админ-панель</h1>
      {isLoading ? (
        <p className="text-sm text-[var(--text-muted)]">Загрузка…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Тренеры</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats?.trainers ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Клиенты</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats?.clients ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Упражнения</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats?.exercises ?? 0}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Оплаты</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatRub(stats?.paymentsTotal ?? 0)}</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
