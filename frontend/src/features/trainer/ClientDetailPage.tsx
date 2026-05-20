import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarCheck2, CreditCard, Dumbbell, MessageSquare, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import {
  useClient,
  useClientAssignedProgram,
  useClientProgressReports,
  usePayments,
  useUpdateClient,
} from '@/features/api/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssignProgramDialog } from '@/components/trainer/AssignProgramDialog'
import { ClientFormDialog, type ClientFormValues } from '@/components/trainer/ClientFormDialog'
import { getClientRecentActivity } from '@/lib/client-activity-mock'
import { formatRelativeActivity } from '@/lib/client-crm'
import { formatRub, formatDate } from '@/lib/utils'
import type { ClientStatus } from '@/types'

const STATUS_VARIANTS: Record<ClientStatus, 'success' | 'warning' | 'secondary'> = {
  active: 'success',
  pause: 'warning',
  archive: 'secondary',
}

export function ClientDetailPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { id } = useParams<{ id: string }>()
  const { data: client } = useClient(id!)
  const { data: allPayments = [] } = usePayments()
  const { data: assigned } = useClientAssignedProgram(id!)
  const { data: progress = [] } = useClientProgressReports(id!)
  const updateClient = useUpdateClient()
  const [editOpen, setEditOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const payments = allPayments.filter((p) => p.clientId === id)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (client?.notes !== undefined) setNotes(client.notes)
  }, [client?.id, client?.notes])

  if (!client) return <p className="text-[var(--text-muted)]">{t('common:actions.loading')}</p>

  const statusVariant = STATUS_VARIANTS[client.status] ?? 'secondary'
  const program = assigned?.program

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
            <Badge variant={statusVariant} className="mt-2">
              {t(`common:status.${client.status}`)}
            </Badge>
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

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t('clients.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="programs">{t('clients.tabs.programs')}</TabsTrigger>
          <TabsTrigger value="progress">{t('clients.tabs.progress')}</TabsTrigger>
          <TabsTrigger value="payments">{t('clients.tabs.payments')}</TabsTrigger>
          <TabsTrigger value="notes">{t('clients.tabs.notes')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.overview.workProfile')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{client.goal ?? '—'}</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                {t('clients.overview.program', {
                  name: program?.name ?? t('clients.overview.programUnassigned'),
                })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.overview.lastMeasurement')}</CardTitle>
            </CardHeader>
            <CardContent>
              {progress.length ? (
                <p className="text-sm">
                  {progress[progress.length - 1]!.date}: {progress[progress.length - 1]!.weight} {t('common:units.kg')}
                </p>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">{t('clients.measurements.empty')}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.recentActivity.title')}</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[var(--border)] p-0">
              {getClientRecentActivity(client.id).map((item) => (
                <div key={item.id} className="flex justify-between px-5 py-2.5 text-sm">
                  <span>{t(`clients.recentActivity.${item.type}`)}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {formatRelativeActivity(
                      Math.max(1, Math.floor((Date.now() - new Date(item.at).getTime()) / 60000)),
                      t,
                    )}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.notesSnippet.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-4 text-sm text-[var(--text-secondary)]">
                {notes.trim().slice(0, 200) || t('clients.notesSnippet.empty')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardContent className="py-8 text-center text-sm">
              {program ? (
                <>
                  <p className="font-semibold">{program.name}</p>
                  <p className="mt-1 text-[var(--text-muted)]">
                    {t('clients.program.weeksFrom', {
                      weeks: program.weeks,
                      date: assigned?.startDate ?? '—',
                    })}
                  </p>
                  <Button className="mt-4" variant="secondary" size="sm" asChild>
                    <Link to={`/trainer/workouts/builder?id=${program.id}`}>{t('clients.program.openBuilder')}</Link>
                  </Button>
                </>
              ) : (
                <p className="text-[var(--text-muted)]">{t('clients.program.unassigned')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardContent className="divide-y divide-[var(--border)] p-0">
              {progress.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">{t('clients.measurements.empty')}</p>
              ) : (
                progress.map((m) => (
                  <div key={m.date} className="flex justify-between px-5 py-3 text-sm">
                    <span>{formatDate(m.date)}</span>
                    <span className="tabular-nums font-medium">{m.weight} {t('common:units.kg')}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.payments.title')}</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[var(--border)] p-0">
              {payments.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">{t('clients.payments.empty')}</p>
              ) : (
                payments.map((p) => (
                  <div key={p.id} className="flex justify-between px-5 py-3 text-sm">
                    <span className="font-medium tabular-nums">{formatRub(p.amount)}</span>
                    <span className="text-[var(--text-muted)]">
                      {formatDate(p.date)} · {p.method}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.notes.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('clients.notes.placeholder')}
                rows={6}
              />
              <Button
                className="mt-3"
                size="sm"
                disabled={updateClient.isPending}
                onClick={async () => {
                  await updateClient.mutateAsync({ id: client.id, data: { notes } })
                  toast.success(t('clients.notes.saved'))
                }}
              >
                {t('common:actions.save')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
