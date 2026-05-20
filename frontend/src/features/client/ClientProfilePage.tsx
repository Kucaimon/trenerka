import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight, LogOut, Wallet } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useClientDashboard } from '@/features/api/hooks'
import { SkillsButton } from '@/components/shared/SkillsButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function ClientProfilePage() {
  const { t } = useTranslation(['client', 'common'])
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { data: dashboard } = useClientDashboard()
  const balance = dashboard?.profile.packageBalance ?? 0

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">{t('profile.title')}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{user?.name ?? t('profile.defaultName')}</h1>
        <p className="mt-2 text-base text-[var(--text-secondary)]">{user?.email}</p>
        {dashboard?.profile.trainer ? (
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {t('workouts.trainer', { name: dashboard.profile.trainer })}
          </p>
        ) : null}
      </div>

      <Link
        to="/client/payments"
        className="mobile-card flex items-center justify-between transition-colors hover:bg-white/[0.04]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--accent-dim)]">
            <Wallet className="h-5 w-5 text-[var(--accent)]" />
          </span>
          <div>
            <p className="text-sm font-semibold">{t('profile.paymentsLink')}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {balance} {t('common:units.sessionsShort')}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
      </Link>

      <div className="glass-panel space-y-4 p-5">
        <p className="label-caps">{t('profile.filesTitle')}</p>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">{t('profile.filesHint')}</p>
        <SkillsButton fullWidth />
        <Badge variant="accent">{t('profile.premium')}</Badge>
        <Button
          variant="outline"
          className="mt-4 w-full gap-2"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          <LogOut className="h-4 w-4" />
          {t('common:actions.logout')}
        </Button>
      </div>
    </div>
  )
}
