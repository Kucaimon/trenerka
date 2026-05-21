import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminStats } from '@/features/api/hooks'
import { formatRub } from '@/lib/utils'

export function AdminDashboardPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { data: stats, isLoading } = useAdminStats()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
      <p className="text-sm text-[var(--text-secondary)]">{t('dashboard.platformNote')}</p>
      {isLoading ? (
        <p className="text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.trainers')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.trainers ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.clients')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.clients ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.exercises')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.exercises ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.payments')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatRub(stats?.paymentsTotal ?? 0)}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
