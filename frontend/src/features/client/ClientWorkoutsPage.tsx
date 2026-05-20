import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/shared/progress-bar'
import { useClientDashboard, useClientWorkouts } from '@/features/api/hooks'
import { weekCompletionPercent } from '@/lib/client-workouts'
import { MobileCard, MobileListItem, MobileListStagger } from '@/components/mobile'

export function ClientWorkoutsPage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: dashboard } = useClientDashboard()
  const { data: workouts = [], isLoading } = useClientWorkouts()
  const weekPct = weekCompletionPercent(workouts)

  return (
    <MobileListStagger className="space-y-5">
      <MobileListItem>
        <section>
          <p className="label-caps">{t('workouts.label')}</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
            {dashboard?.currentProgram ?? '—'}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {t('workouts.trainer', { name: dashboard?.profile.trainer ?? '—' })}
          </p>
        </section>
      </MobileListItem>

      <MobileListItem>
        <MobileCard className="!py-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">{t('workouts.weekProgress')}</p>
            <span className="text-sm font-semibold tabular-nums">{weekPct}%</span>
          </div>
          <Progress value={weekPct} />
        </MobileCard>
      </MobileListItem>

      {isLoading ? (
        <p className="text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
      ) : workouts.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">{t('workouts.empty')}</p>
      ) : (
        workouts.map((workout) => (
          <MobileListItem key={workout.id}>
            <Link
              to={`/client/workouts/${workout.id}/session`}
              className="mobile-card flex items-center justify-between transition-colors hover:bg-white/[0.04]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={workout.status === 'done' ? 'secondary' : 'accent'}>{workout.day}</Badge>
                  <p className="font-semibold">{workout.title}</p>
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {t('workouts.exerciseCount', { count: workout.exercises.length })}
                  {workout.status === 'done' ? ` · ${t('workouts.completed')}` : ''}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
            </Link>
          </MobileListItem>
        ))
      )}
    </MobileListStagger>
  )
}
