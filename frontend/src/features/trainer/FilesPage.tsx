import { useTranslation } from 'react-i18next'
import { FolderOpen } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { SkillsButton } from '@/components/shared/SkillsButton'
import { Badge } from '@/components/ui/badge'
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
        <p className="text-sm font-semibold">{t('filesPage.training')}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{t('filesPage.trainingHint')}</p>
        <SkillsButton className="mt-3" fullWidth />
      </section>

      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
        <FolderOpen className="h-8 w-8 text-[var(--text-muted)]" strokeWidth={1.5} />
        <p className="text-sm font-medium">{t('filesPage.emptyTitle')}</p>
        <p className="max-w-sm text-xs leading-relaxed text-[var(--text-muted)]">{t('filesPage.empty')}</p>
      </div>
    </div>
  )
}
