import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useClientDashboard, useClientPayments } from '@/features/api/hooks'
import { formatRub } from '@/lib/i18n-format'
import { MobileListItem, MobileListStagger } from '@/components/mobile'

export function ClientPaymentsPage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: dashboard } = useClientDashboard()
  const { data: payments = [], isLoading } = useClientPayments()
  const balance = dashboard?.profile?.packageBalance ?? 0

  return (
    <MobileListStagger className="space-y-5">
      <MobileListItem>
        <Link
          to="/client/profile"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[var(--text-secondary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('payments.back')}
        </Link>
      </MobileListItem>

      <MobileListItem>
        <section className="mobile-card !py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--accent-dim)]">
              <Wallet className="h-5 w-5 text-[var(--accent)]" />
            </span>
            <div>
              <p className="label-caps">{t('payments.balanceLabel')}</p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                {balance} {t('common:units.sessionsShort')}
              </p>
            </div>
          </div>
        </section>
      </MobileListItem>

      <MobileListItem>
        <p className="label-caps">{t('payments.history')}</p>
        {isLoading ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
        ) : payments.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">{t('payments.empty')}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {payments.map((p) => (
              <li key={p.id} className="mobile-card flex items-center justify-between gap-3 !py-3">
                <div className="min-w-0">
                  <p className="font-semibold tabular-nums">{formatRub(p.amount)}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {p.date} · {p.method}
                  </p>
                  {p.note ? <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">{p.note}</p> : null}
                </div>
                {p.sessionsAdded ? (
                  <Badge variant="accent">+{p.sessionsAdded}</Badge>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </MobileListItem>
    </MobileListStagger>
  )
}
