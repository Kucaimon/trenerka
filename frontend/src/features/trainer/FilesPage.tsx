import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, FileText, FolderOpen } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { config } from '@/lib/config'
import { useClients } from '@/features/api/hooks'
import { mockApi } from '@/lib/mock-api/store'

export function FilesPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: clients = [] } = useClients()
  const [clientId, setClientId] = useState<string | null>(null)
  const activeClientId = clientId ?? clients[0]?.id ?? ''

  const files = useMemo(() => {
    if (!activeClientId || !config.useMockData) return []
    return mockApi.files.byClient(activeClientId)
  }, [activeClientId])

  const activeClient = clients.find((c) => c.id === activeClientId)

  return (
    <div className="page-container">
      <PageHeader title={t('filesPage.title')} description={t('filesPage.description')} />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{t('filesPage.clientsCount', { count: clients.length })}</Badge>
        {clients.length > 0 ? (
          <Select value={activeClientId} onValueChange={setClientId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder={t('filesPage.selectClient')} />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{t('filesPage.training')}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{t('filesPage.trainingHint')}</p>
          </div>
          <a
            href={config.skillsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            {t('common:skills')}
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </a>
        </div>
      </section>

      {files.length > 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-sm font-semibold">
              {activeClient?.name ?? t('filesPage.clientFiles')}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{t('filesPage.filesCount', { count: files.length })}</p>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                <FileText className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  {t('common:actions.open')}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
          <FolderOpen className="h-8 w-8 text-[var(--text-muted)]" strokeWidth={1.5} />
          <p className="text-sm font-medium">{t('filesPage.emptyTitle')}</p>
          <p className="max-w-sm text-xs leading-relaxed text-[var(--text-muted)]">{t('filesPage.empty')}</p>
        </div>
      )}
    </div>
  )
}
