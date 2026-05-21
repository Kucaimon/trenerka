import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarCheck2, CreditCard, Dumbbell, MessageSquare, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useClient, useUpdateClient } from '@/features/api/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AssignProgramDialog } from '@/components/trainer/AssignProgramDialog'
import { ClientDetailTabs } from '@/components/trainer/ClientDetailTabs'
import { ClientMemberBadges } from '@/components/trainer/ClientMemberBadges'
import { ClientFormDialog, type ClientFormValues } from '@/components/trainer/ClientFormDialog'
import type { ClientStatus } from '@/types'

const STATUS_VARIANTS: Record<ClientStatus, 'success' | 'warning' | 'secondary'> = {
  active: 'success',
  pause: 'warning',
  archive: 'secondary',
}

export function ClientDetailPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { id } = useParams<{ id: string }>()
  const { data: client, isLoading: clientLoading, isError: clientError, refetch: refetchClient } = useClient(id!)
  const updateClient = useUpdateClient()
  const [editOpen, setEditOpen] = useState(false)

  if (clientError) {
    return (
      <div className="page-container space-y-3">
        <p className="text-sm text-[var(--text-secondary)]">{t('clients.loadError')}</p>
        <Button variant="secondary" size="sm" onClick={() => void refetchClient()}>
          {t('common:actions.retry')}
        </Button>
      </div>
    )
  }
  if (clientLoading || !client) {
    return <p className="text-[var(--text-muted)]">{t('common:actions.loading')}</p>
  }

  const statusVariant = STATUS_VARIANTS[client.status] ?? 'secondary'

  return (
    <div className="page-container">
      <Link
        to="/trainer/clients"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" /> {t('clients.back')}
      </Link>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{client.name}</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {client.email} · {client.phone}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant}>{t(`common:status.${client.status}`)}</Badge>
              <ClientMemberBadges client={client} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/trainer/messages">
                <MessageSquare className="h-4 w-4" /> {t('clients.actions.message')}
              </Link>
            </Button>
            <AssignProgramDialog
              clientId={client.id}
              trigger={<Button size="sm">{t('clients.actions.assignProgram')}</Button>}
            />
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] bg-black/15 p-3">
            <CreditCard className="h-4 w-4 text-[var(--accent)]" />
            <p className="mt-2 text-2xl font-semibold tabular-nums">{client.packageBalance}</p>
            <p className="text-xs text-[var(--text-muted)]">{t('clients.stats.sessionsInPackage')}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-black/15 p-3">
            <CalendarCheck2 className="h-4 w-4 text-emerald-400" />
            <p className="mt-2 text-sm font-semibold">{client.lastSession ?? '—'}</p>
            <p className="text-xs text-[var(--text-muted)]">{t('clients.statsDetail.lastSessionLower')}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-black/15 p-3">
            <Dumbbell className="h-4 w-4 text-[var(--text-secondary)]" />
            <p className="mt-2 text-sm font-semibold">{client.goal ?? t('clients.fallback.goal')}</p>
            <p className="text-xs text-[var(--text-muted)]">{t('clients.statsDetail.programFocus')}</p>
          </div>
        </div>
      </div>

      <ClientDetailTabs key={client.id} client={client} />

      <ClientFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title={t('clients.edit.title')}
        initial={client}
        onSubmit={async (data: ClientFormValues) => {
          await updateClient.mutateAsync({ id: client.id, data })
          toast.success(t('common:actions.saved'))
          setEditOpen(false)
        }}
        loading={updateClient.isPending}
      />
    </div>
  )
}
