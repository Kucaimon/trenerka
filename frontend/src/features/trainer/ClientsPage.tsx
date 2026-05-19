import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/components/mobile'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Download, UserPlus, MessageSquare, CreditCard, CalendarCheck2, Dumbbell } from 'lucide-react'
import { exportClientsSpreadsheet, getClient, getClients } from '@/features/api/clients-service'
import { useCreateClient, usePayments, useUpdateClient } from '@/features/api/hooks'
import { ClientFormDialog, type ClientFormValues } from '@/components/trainer/ClientFormDialog'
import { AssignProgramDialog } from '@/components/trainer/AssignProgramDialog'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { Client, ClientStatus } from '@/types'
import { formatRub, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_VARIANTS: Record<ClientStatus, 'success' | 'warning' | 'secondary'> = {
  active: 'success',
  pause: 'warning',
  archive: 'secondary',
}

function avatarTone(name: string) {
  const tones = [
    'bg-[var(--surface3)] text-[var(--accent)]',
    'bg-[var(--accent-dim)] text-[var(--accent)]',
    'bg-[var(--surface2)] text-[var(--text-secondary)]',
  ]
  return tones[name.charCodeAt(0) % tones.length]
}


export function ClientsPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const filters = useMemo(
    () => [
      { id: 'all', label: t('clients.filters.all') },
      { id: 'active', label: t('clients.filters.active') },
      { id: 'pause', label: t('common:status.pause') },
      { id: 'archive', label: t('common:status.archive') },
    ],
    [t],
  )
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const isMobileCrm = useIsMobile()

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'all' || c.status === status
    return matchSearch && matchStatus
  })

  const activeId = selectedId ?? (!isMobileCrm ? filtered[0]?.id : null) ?? null
  const showCrmDetail = Boolean(activeId) && (!isMobileCrm || showDetail)

  return (
    <div
      className={cn(
        '-mx-4 -my-7 crm-layout md:-mx-6 lg:-mx-8',
        showCrmDetail && 'crm-show-detail',
      )}
    >
        <aside className="crm-list">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-[18px] py-4">
            <div>
              <h1 className="font-display text-base font-extrabold">{t('clients.title')}</h1>
              <p className="text-[11px] text-[var(--text-muted)]">{t('clients.inDatabase', { count: filtered.length })}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" title={t('common:actions.exportCsv')} onClick={() => exportClientsSpreadsheet(filtered)}>
                <Download className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8" onClick={() => setCreateOpen(true)}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-b border-[var(--border)] px-3.5 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                className="h-9 border-[var(--border)] bg-[var(--surface2)] pl-9 text-[13px]"
                placeholder={t('clients.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-[var(--border)] px-3.5 py-2.5">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatus(f.id)}
                className={cn('filter-pill', status === f.id && 'active')}
              >
                {f.label}
                {f.id === 'all' ? ` (${clients.length})` : ''}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="saas-empty m-4">
                <p className="saas-empty__title">{t('clients.empty')}</p>
                <p className="saas-empty__text">{t('clients.searchPlaceholder')}</p>
              </div>
            ) : (
              filtered.map((c) => (
                <ClientListItem
                  key={c.id}
                  client={c}
                  active={c.id === activeId}
                  onSelect={() => {
                    setSelectedId(c.id)
                    if (isMobileCrm) setShowDetail(true)
                  }}
                />
              ))
            )}
          </div>
        </aside>

        <main className="crm-main">
          {isMobileCrm && showDetail ? (
            <div className="border-b border-[var(--border)] px-4 py-3 lg:hidden">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="touch-target -ml-2 gap-2"
                onClick={() => setShowDetail(false)}
              >
                <ArrowLeft className="h-4 w-4" />
                {t('common:actions.backToList')}
              </Button>
            </div>
          ) : null}
          {activeId ? (
            <ClientProfilePanel
              clientId={activeId}
              onEdit={() => setEditOpen(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-10 text-sm text-[var(--text-muted)]">
              {t('clients.selectPrompt')}
            </div>
          )}
        </main>

      <ClientFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t('clients.create.title')}
        onSubmit={async (data: ClientFormValues) => {
          const { client, temporaryPassword } = await createClient.mutateAsync(data)
          toast.success(t('clients.toast.created'), {
            description: temporaryPassword ? t('clients.toast.tempPassword', { password: temporaryPassword }) : undefined,
          })
          setCreateOpen(false)
          setSelectedId(client.id)
        }}
        loading={createClient.isPending}
      />
      {activeId ? (
        <ClientFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          title={t('clients.edit.title')}
          initial={clients.find((c) => c.id === activeId)}
          onSubmit={async (data) => {
            await updateClient.mutateAsync({ id: activeId, data })
            toast.success(t('common:actions.saved'))
            setEditOpen(false)
          }}
          loading={updateClient.isPending}
        />
      ) : null}
    </div>
  )
}

function ClientListItem({
  client,
  active,
  onSelect,
}: {
  client: Client
  active: boolean
  onSelect: () => void
}) {
  const { t } = useTranslation(['trainer', 'common'])
  const variant = STATUS_VARIANTS[client.status]
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn('client-card', active && 'active')}
    >
      <div className="mb-1.5 flex items-center gap-2.5">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] text-[13px] font-semibold',
            avatarTone(client.name),
          )}
        >
          {client.name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{client.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">{client.goal ?? t('clients.fallback.program')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-[46px]">
        <Badge variant={variant} className="text-[10px]">
          {t(`common:status.${client.status}`)}
        </Badge>
        <span className="text-[11px] text-[var(--text-muted)]">{client.packageBalance} {t('common:units.sessionsShort')}</span>
      </div>
    </button>
  )
}

function ClientProfilePanel({ clientId, onEdit }: { clientId: string; onEdit: () => void }) {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: client } = useQuery({ queryKey: ['client', clientId], queryFn: () => getClient(clientId) })
  const { data: allPayments = [] } = usePayments()
  const updateClient = useUpdateClient()
  const [notes, setNotes] = useState('')
  const payments = allPayments.filter((p) => p.clientId === clientId)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync notes when switching client
    if (client?.notes !== undefined) setNotes(client.notes)
  }, [clientId, client?.notes])

  if (!client) return <p className="p-8 text-[var(--text-muted)]">{t('common:actions.loading')}</p>

  const statusVariant = STATUS_VARIANTS[client.status] ?? 'secondary'

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-5 sm:px-8 sm:py-7">
        <div className="flex flex-wrap items-start gap-5">
          <div
            className={cn(
              'flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] text-xl font-semibold',
              avatarTone(client.name),
            )}
          >
            {client.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-extrabold">{client.name}</h2>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
              {client.email} · {client.phone}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Badge variant={statusVariant}>{t(`common:status.${client.status}`)}</Badge>
              <span className="rounded-md border border-[var(--border)] bg-[var(--surface3)] px-2.5 py-0.5 text-[11px] text-[var(--text-secondary)]">
                {client.goal ?? t('clients.fallback.goal')}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/trainer/messages">
                <MessageSquare className="h-4 w-4" /> {t('clients.actions.message')}
              </Link>
            </Button>
            <AssignProgramDialog
              clientId={clientId}
              trigger={<Button size="sm">{t('clients.actions.assignProgram')}</Button>}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-muted)]">{t('clients.stats.balance')}</p>
            <p className="font-display mt-1.5 text-2xl font-extrabold tabular-nums">{client.packageBalance}</p>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{t('clients.stats.sessionsInPackage')}</p>
          </div>
          <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-muted)]">{t('clients.stats.lastSession')}</p>
            <p className="font-display mt-1.5 text-lg font-extrabold">{client.lastSession ?? '—'}</p>
            <CalendarCheck2 className="mt-2 h-4 w-4 text-[var(--accent)]" />
          </div>
          <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-[11px] uppercase tracking-[0.04em] text-[var(--text-muted)]">{t('clients.stats.focus')}</p>
            <p className="font-display mt-1.5 text-lg font-extrabold">{client.goal ?? '—'}</p>
            <Dumbbell className="mt-2 h-4 w-4 text-[var(--text-muted)]" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('clients.payments.title')}</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-[var(--border)] p-0">
            {payments.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-[var(--text-muted)]">{t('clients.payments.empty')}</p>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="flex items-center gap-2 font-medium tabular-nums">
                    <CreditCard className="h-3.5 w-3.5 text-[var(--accent)]" />
                    {formatRub(p.amount)}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {formatDate(p.date)} · {p.method}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('clients.notes.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('clients.notes.placeholder')}
              rows={4}
              className="bg-[var(--surface3)]"
            />
            <Button
              className="mt-3"
              size="sm"
              variant="secondary"
              disabled={updateClient.isPending}
              onClick={() => updateClient.mutate({ id: clientId, data: { notes } })}
            >
              {t('clients.notes.save')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
