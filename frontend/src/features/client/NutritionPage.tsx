import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, FileText, UtensilsCrossed } from 'lucide-react'
import { useClientDashboard, useClientAttachments } from '@/features/api/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/saas'

export function NutritionPage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: dashboard, isLoading: dashLoading } = useClientDashboard()
  const { data: attachments = [], isLoading: filesLoading } = useClientAttachments()

  const mealPlans = useMemo(
    () => attachments.filter((a) => a.category === 'meal_plan'),
    [attachments],
  )
  const coachNotes = dashboard?.profile?.coachNotes?.trim() ?? ''

  if (dashLoading || filesLoading) {
    return <LoadingState label={t('common:actions.loading')} />
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div>
        <p className="label-caps">{t('nutrition.eyebrow')}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{t('nutrition.title')}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('nutrition.subtitle')}</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <UtensilsCrossed className="h-4 w-4 text-[var(--accent)]" />
            {t('nutrition.mealPlanTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mealPlans.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t('nutrition.emptyMealPlan')}</p>
          ) : (
            mealPlans.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="shrink-0 gap-1" asChild>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t('nutrition.openFile')}
                  </a>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('nutrition.coachNotesTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {coachNotes ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">{coachNotes}</p>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">{t('nutrition.emptyNotes')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
