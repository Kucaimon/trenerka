import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { config } from '@/lib/config'
import { useAuthStorageReady } from '@/hooks/use-auth-ready'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/types'

export function ProtectedRoute({ children, role }: { children: ReactNode; role: UserRole }) {
  const { t } = useTranslation('common')
  const storageReady = useAuthStorageReady()
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const sessionChecking = useAuthStore((s) => s.sessionChecking)

  const loginPath =
    role === 'trainer' ? '/login/trainer' : role === 'client' ? '/login/client' : '/login/admin'

  if (!storageReady || (!config.useMockData && token && sessionChecking)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t('actions.loading')}
      </div>
    )
  }

  if (!user || !token) {
    return <Navigate to={loginPath} replace />
  }
  if (user.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}
