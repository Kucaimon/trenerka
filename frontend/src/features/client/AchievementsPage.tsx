import { useTranslation } from 'react-i18next'
import { Award, Flame } from 'lucide-react'
import { useClientDashboard, useClientWorkouts } from '@/features/api/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/saas'

export function AchievementsPage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: dashboard, isLoading } = useClientDashboard()
  const { data: workouts = [] } = useClientWorkouts()

  if (isLoading) {
    return <LoadingState label={t('common:actions.loading')} />
  }

  const streak = dashboard?.streakDays ?? 0
  const completed = workouts.filter((w) => w.status === 'done').length
  const total = Math.max(workouts.length, 1)
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div>
        <p className="label-caps">{t('achievements.eyebrow')}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{t('achievements.title')}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('achievements.subtitle')}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4 text-[var(--accent)]" />
              {t('achievements.streak')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-[var(--accent)]">{streak}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{t('achievements.streakHint')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-[var(--accent)]" />
              {t('achievements.completedTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{completed}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {t('achievements.completedHint', { pct })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
