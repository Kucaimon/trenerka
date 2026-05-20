import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Layers, ChevronRight } from 'lucide-react'
import { SaasPageHeader } from '@/components/saas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePrograms } from '@/features/api/hooks'
import { ProgramShareMenu } from '@/features/trainer/ProgramShareMenu'
import { programShareFromProgram } from '@/lib/program-share'

export function ProgramsPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: programs = [], isLoading } = usePrograms()

  return (
    <div className="page-container">
      <SaasPageHeader
        title={t('programs.title')}
        description={t('programs.description')}
        breadcrumbs={[
          { label: t('dashboard.breadcrumb.app'), href: '/trainer' },
          { label: t('programs.title') },
        ]}
        actions={
          <Button variant="secondary" size="sm" asChild>
            <Link to="/trainer/workouts/builder">{t('programs.builderLink')}</Link>
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
      ) : programs.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center px-6 py-16 text-center">
          <Layers className="h-8 w-8 text-[var(--text-muted)]" />
          <p className="mt-4 text-sm text-[var(--text-secondary)]">{t('programs.empty')}</p>
          <Button className="mt-4" asChild>
            <Link to="/trainer/workouts/builder">{t('programs.createInBuilder')}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.id}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface2)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--accent)]/20 bg-[var(--accent-dim)]">
                  <Layers className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div className="flex items-center gap-1">
                  <ProgramShareMenu variant="icon" input={programShareFromProgram(program)} />
                  <Badge variant="secondary">
                    {program.weeks} {t('common:units.weeksShort')}
                  </Badge>
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">{program.name}</h3>
              {program.description && (
                <p className="mt-1.5 line-clamp-2 text-sm text-[var(--text-secondary)]">{program.description}</p>
              )}
              <Button variant="ghost" size="sm" className="mt-4 w-full justify-between gap-2" asChild>
                <Link to={`/trainer/workouts/builder?id=${program.id}`}>
                  {t('common:actions.open')} <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
