import { useTranslation } from 'react-i18next'
import { ExternalLink, FolderOpen } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { config } from '@/lib/config'
import { useClients } from '@/features/api/hooks'

export function FilesPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: clients = [] } = useClients()

  return (
    <div className="page-container">
      <PageHeader title={t('filesPage.title')} description={t('filesPage.description')} />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{t('filesPage.clientsCount', { count: clients.length })}</Badge>
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

      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
        <FolderOpen className="h-8 w-8 text-[var(--text-muted)]" strokeWidth={1.5} />
        <p className="text-sm font-medium">{t('filesPage.emptyTitle')}</p>
        <p className="max-w-sm text-xs leading-relaxed text-[var(--text-muted)]">{t('filesPage.empty')}</p>
      </div>
    </div>
  )
}
