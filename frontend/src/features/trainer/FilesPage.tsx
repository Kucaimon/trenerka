import { useTranslation } from 'react-i18next'
import { FileText, Image, Upload } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { SkillsButton } from '@/components/shared/SkillsButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useClients } from '@/features/api/hooks'

const DEMO_FILE_KEYS = [
  { id: 'f1', nameKey: 'filesPage.demo.name1', client: 'Анна Смирнова', sizeKey: 'filesPage.demo.size1', type: 'pdf' as const },
  { id: 'f2', nameKey: 'filesPage.demo.name2', client: 'Анна Смирнова', sizeKey: 'filesPage.demo.size2', type: 'image' as const },
  { id: 'f3', nameKey: 'filesPage.demo.name3', client: 'Иван Петров', sizeKey: 'filesPage.demo.size3', type: 'pdf' as const },
]

export function FilesPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: clients = [] } = useClients()

  return (
    <div className="page-container">
      <PageHeader
        title={t('filesPage.title')}
        description={t('filesPage.description')}
        actions={
          <Button size="sm" disabled>
            <Upload className="mr-2 h-4 w-4" />
            {t('common:actions.upload')}
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{t('filesPage.clientsCount', { count: clients.length })}</Badge>
        <Badge variant="accent">{t('filesPage.filesCount', { count: DEMO_FILE_KEYS.length })}</Badge>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-semibold">{t('filesPage.training')}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{t('filesPage.trainingHint')}</p>
        <SkillsButton className="mt-3" fullWidth />
      </section>

      <div className="gap-grid">
        {DEMO_FILE_KEYS.map((file) => {
          const Icon = file.type === 'image' ? Image : FileText
          return (
            <div
              key={file.id}
              className="gap-grid-cell flex items-center gap-4 p-4 transition-colors hover:bg-[var(--surface2)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t(file.nameKey)}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {file.client} · {t(file.sizeKey)}
                </p>
              </div>
              <Badge variant="secondary">{t('common:actions.demo')}</Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
