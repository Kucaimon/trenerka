import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAdminUsers, useSetUserBlocked, useSetUserEmailVerified } from '@/features/api/hooks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function UsersAdminPage() {
  const { t } = useTranslation('admin')
  const { data: users = [] } = useAdminUsers()
  const blockMut = useSetUserBlocked()
  const verifyMut = useSetUserEmailVerified()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('users.title')}</h1>
      <div className="admin-card-list">
        {users.map((u) => (
          <div key={u.id} className="flex flex-col gap-3 rounded-lg bg-[#111827] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <Badge>{u.role}</Badge>
                {u.emailVerified ? (
                  <Badge variant="success">{t('users.verified')}</Badge>
                ) : (
                  <Badge variant="warning">{t('users.unverified')}</Badge>
                )}
                {u.blocked ? <Badge variant="destructive">{t('users.blocked')}</Badge> : null}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {u.role === 'trainer' ? (
                u.emailVerified ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={verifyMut.isPending}
                    onClick={() =>
                      verifyMut.mutate(
                        { id: u.id, emailVerified: false },
                        { onSuccess: () => toast.success(t('users.toast.unverified')) },
                      )
                    }
                  >
                    {t('users.revokeVerify')}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={verifyMut.isPending}
                    onClick={() =>
                      verifyMut.mutate(
                        { id: u.id, emailVerified: true },
                        { onSuccess: () => toast.success(t('users.toast.verified')) },
                      )
                    }
                  >
                    {t('users.confirmVerify')}
                  </Button>
                )
              ) : null}
              {u.blocked ? (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={blockMut.isPending}
                  onClick={() =>
                    blockMut.mutate(
                      { id: u.id, blocked: false },
                      { onSuccess: () => toast.success(t('users.toast.unblocked')) },
                    )
                  }
                >
                  {t('users.unblock')}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={blockMut.isPending}
                  onClick={() =>
                    blockMut.mutate(
                      { id: u.id, blocked: true },
                      { onSuccess: () => toast.success(t('users.toast.blocked')) },
                    )
                  }
                >
                  {t('users.block')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
