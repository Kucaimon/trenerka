import { toast } from 'sonner'
import { useAdminUsers, useSetUserBlocked } from '@/features/api/hooks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function UsersAdminPage() {
  const { data: users = [] } = useAdminUsers()
  const blockMut = useSetUserBlocked()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Пользователи</h1>
      <div className="admin-card-list">
        {users.map((u) => (
          <div key={u.id} className="flex flex-col gap-3 rounded-lg bg-[#111827] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
              <Badge className="mt-1">{u.role}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {u.blocked ? (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={blockMut.isPending}
                  onClick={() =>
                    blockMut.mutate(
                      { id: u.id, blocked: false },
                      { onSuccess: () => toast.success('Пользователь разблокирован') },
                    )
                  }
                >
                  Разблокировать
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={blockMut.isPending}
                  onClick={() =>
                    blockMut.mutate(
                      { id: u.id, blocked: true },
                      { onSuccess: () => toast.success('Пользователь заблокирован') },
                    )
                  }
                >
                  Заблокировать
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
