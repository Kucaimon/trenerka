import { FileText, Image, Upload } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { SkillsButton } from '@/components/shared/SkillsButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useClients } from '@/features/api/hooks'

const demoFiles = [
  { id: 'f1', name: 'Анкета_Анна.pdf', client: 'Анна Смирнова', size: '240 КБ', type: 'pdf' as const },
  { id: 'f2', name: 'Прогресс_май.jpg', client: 'Анна Смирнова', size: '1.2 МБ', type: 'image' as const },
  { id: 'f3', name: 'Договор_Иван.pdf', client: 'Иван Петров', size: '180 КБ', type: 'pdf' as const },
]

export function FilesPage() {
  const { data: clients = [] } = useClients()

  return (
    <div className="page-container">
      <PageHeader
        title="Файлы"
        description="Документы и медиа клиентов. Загрузка до 10 МБ — через API /upload (MVP: демо-список)."
        actions={
          <Button size="sm" disabled>
            <Upload className="mr-2 h-4 w-4" />
            Загрузить
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{clients.length} клиентов</Badge>
        <Badge variant="accent">{demoFiles.length} файлов</Badge>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-semibold">Обучение</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Курсы и материалы Фитнес Академии</p>
        <SkillsButton className="mt-3" fullWidth />
      </section>

      <div className="gap-grid">
        {demoFiles.map((file) => {
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
                <p className="truncate text-sm font-semibold">{file.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {file.client} · {file.size}
                </p>
              </div>
              <Badge variant="secondary">Демо</Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
