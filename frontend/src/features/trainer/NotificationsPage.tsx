import { Bell, Check } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNotifications, queryKeys } from '@/features/api/hooks'
import { markNotificationRead } from '@/features/api/notifications-service'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications()
  const qc = useQueryClient()
  const unread = notifications.filter((n) => !n.read).length

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  })

  return (
    <div className="page-container">
      <PageHeader
        title="Уведомления"
        description="Сессии, оплаты, сообщения и системные события."
        actions={unread > 0 ? <Badge variant="accent">{unread} новых</Badge> : undefined}
      />

      {isLoading ? (
        <p className="text-sm text-[var(--text-muted)]">Загрузка…</p>
      ) : notifications.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center px-6 py-16 text-center">
          <Bell className="h-8 w-8 text-[var(--text-muted)]" />
          <p className="mt-4 text-sm text-[var(--text-secondary)]">Нет уведомлений</p>
        </div>
      ) : (
        <NotificationsList notifications={notifications} onMarkRead={(id) => markRead.mutate(id)} />
      )}
    </div>
  )
}

function NotificationsList({
  notifications,
  onMarkRead,
}: {
  notifications: { id: string; title: string; body: string; createdAt: string; read: boolean }[]
  onMarkRead: (id: string) => void
}) {
  return (
    <div className="divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={cn(
            'flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]',
            !n.read && 'bg-[var(--accent-glow)]',
          )}
        >
          <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border', n.read ? 'border-[var(--border)] bg-[var(--surface2)]' : 'border-[var(--accent)]/30 bg-[var(--accent-dim)]')}>
            <Bell className={cn('h-4 w-4', n.read ? 'text-[var(--text-muted)]' : 'text-[var(--accent)]')} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{n.title}</p>
              {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
            </div>
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{n.body}</p>
            <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">{formatDate(n.createdAt)}</p>
          </div>
          {!n.read && (
            <Button variant="ghost" size="sm" className="shrink-0 gap-1 text-xs" onClick={() => onMarkRead(n.id)}>
              <Check className="h-3.5 w-3.5" /> Прочитано
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
