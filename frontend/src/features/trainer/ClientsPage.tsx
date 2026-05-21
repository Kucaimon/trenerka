import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/components/mobile'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Download, UserPlus, MessageSquare } from 'lucide-react'
import { exportClientsSpreadsheet, getClient, getClients } from '@/features/api/clients-service'
import { useCreateClient, useUpdateClient } from '@/features/api/hooks'
import { EmptyState, LoadingState, SaasPageHeader } from '@/components/saas'
import { ClientFormDialog, type ClientFormValues } from '@/components/trainer/ClientFormDialog'
import { ClientsDataTable } from '@/features/trainer/ClientsDataTable'
import { AssignProgramDialog } from '@/components/trainer/AssignProgramDialog'
import { ClientDetailTabs } from '@/components/trainer/ClientDetailTabs'
import { ClientInvitePanel } from '@/components/trainer/ClientInvitePanel'
import { ClientMemberBadges } from '@/components/trainer/ClientMemberBadges'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Client, ClientStatus, PaymentState } from '@/types'
import { effectiveCourseProgress, enrichClient } from '@/lib/client-crm'
import { cn } from '@/lib/utils'

const STATUS_VARIANTS: Record<ClientStatus, 'success' | 'warning' | 'secondary'> = {
  active: 'success',
  pause: 'warning',
  archive: 'secondary',
}

const PAYMENT_VARIANTS: Record<PaymentState, 'success' | 'warning' | 'destructive'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'destructive',
}

function avatarClass() {
  return 'border border-[var(--border-strong)] bg-[var(--accent-dim)] text-[var(--accent)]'
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
          <div className="crm-list__toolbar border-b border-[var(--border)] px-3 py-3 md:px-4">
            <SaasPageHeader
              className="!mb-0"
              title={t('clients.title')}
              description={t('clients.inDatabase', { count: filtered.length })}
              breadcrumbs={[
                { label: t('dashboard.breadcrumb.app'), href: '/trainer' },
                { label: t('clients.breadcrumb.clients') },
              ]}
              actions={
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title={t('common:actions.exportCsv')} onClick={() => void exportClientsSpreadsheet(filtered)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    title={t('clients.actions.addClient')}
                    aria-label={t('clients.actions.addClient')}
                    onClick={() => setCreateOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
          </div>

          <div className="border-b border-[var(--border)] px-3 py-3 md:px-4">
            <ClientInvitePanel />
          </div>

          <div className="crm-filter-bar border-b border-[var(--border)] px-3 py-2 md:px-4">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                className="h-8 border-[var(--border)] bg-[var(--surface2)] pl-8 text-[13px]"
                placeholder={t('clients.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex shrink-0 gap-1 overflow-x-auto">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatus(f.id)}
                  className={cn('filter-pill filter-pill--compact', status === f.id && 'active')}
                >
                  {f.label}
                  {f.id === 'all' ? ` (${clients.length})` : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={UserPlus}
                  title={t('clients.empty')}
                  description={t('clients.emptyDescription')}
                  action={
                    <Button size="sm" onClick={() => setCreateOpen(true)}>
                      {t('clients.emptyCta')}
                    </Button>
                  }
                />
              </div>
            ) : isMobileCrm ? (
              filtered.map((c) => (
                <ClientListItem
                  key={c.id}
                  client={c}
                  active={c.id === activeId}
                  onSelect={() => {
                    setSelectedId(c.id)
                    setShowDetail(true)
                  }}
                />
              ))
            ) : (
              <div className="hidden lg:block">
                <ClientsDataTable clients={filtered} activeId={activeId} onSelect={setSelectedId} />
              </div>
            )}
            {!isMobileCrm ? (
              <div className="lg:hidden">
                {filtered.map((c) => (
                  <ClientListItem
                    key={c.id}
                    client={c}
                    active={c.id === activeId}
                    onSelect={() => setSelectedId(c.id)}
                  />
                ))}
              </div>
            ) : null}
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
            <div className="flex h-full items-center justify-center p-6">
              <EmptyState
                icon={UserPlus}
                title={t('clients.selectPrompt')}
                description={t('clients.emptyDescription')}
                className="max-w-sm"
              />
            </div>
          )}
        </main>

      <ClientFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t('clients.create.title')}
        onSubmit={async (data: ClientFormValues) => {
          const { client, temporaryPassword, welcomeEmailSent } = await createClient.mutateAsync(data)
          const description = welcomeEmailSent
            ? t('clients.toast.welcomeEmailSent', { email: client.email })
            : temporaryPassword
              ? t('clients.toast.tempPasswordManual', { password: temporaryPassword })
              : undefined
          toast.success(t('clients.toast.created'), { description })
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
  const enriched = enrichClient(client)
  const variant = STATUS_VARIANTS[client.status]
  const paymentKey: PaymentState = enriched.paymentState ?? 'paid'
  const paymentVariant = PAYMENT_VARIANTS[paymentKey]
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn('client-card touch-target', active && 'active')}
    >
      <div className="mb-1.5 flex items-center gap-2.5">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
            avatarClass(),
          )}
        >
          {client.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{client.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">{client.goal ?? t('clients.fallback.program')}</p>
        </div>
        <Badge variant={paymentVariant} className="shrink-0 px-1.5 py-0 text-[10px]">
          {t(`clients.payment.${paymentKey}`)}
        </Badge>
      </div>
      <div className="flex items-center gap-2 pl-[46px]">
        <Badge variant={variant} className="px-1.5 py-0 text-[10px]">
          {t(`common:status.${client.status}`)}
        </Badge>
        <span className="text-[11px] text-[var(--text-muted)]">
          {client.packageBalance} {t('common:units.sessionsShort')}
          {effectiveCourseProgress(enriched) != null ? ` · ${effectiveCourseProgress(enriched)}%` : ''}
        </span>
      </div>
    </button>
  )
}

function ClientProfilePanel({ clientId, onEdit }: { clientId: string; onEdit: () => void }) {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: client } = useQuery({ queryKey: ['client', clientId], queryFn: () => getClient(clientId) })

  if (!client) return <LoadingState label={t('common:actions.loading')} className="min-h-[240px]" />

  const statusVariant = STATUS_VARIANTS[client.status] ?? 'secondary'

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-start gap-5">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold',
              avatarClass(),
            )}
          >
            {client.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="page-title">{client.name}</h2>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
              {client.email} · {client.phone}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant}>{t(`common:status.${client.status}`)}</Badge>
              <ClientMemberBadges client={client} />
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
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/trainer/clients/${clientId}`}>{t('clients.actions.fullProfile')}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <ClientDetailTabs key={client.id} client={client} />
      </div>
    </div>
  )
}
