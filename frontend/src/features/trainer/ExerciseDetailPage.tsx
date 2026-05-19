import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Wind } from 'lucide-react'
import { useExercise } from '@/features/api/hooks'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const muscleTone: Record<string, string> = {
  Грудь: 'text-[var(--danger)] bg-[rgba(255,77,77,0.1)]',
  Ноги: 'text-[#4d9eff] bg-[rgba(77,158,255,0.1)]',
  Спина: 'text-[#a78bfa] bg-[rgba(167,139,250,0.1)]',
  Кор: 'text-[var(--warning)] bg-[rgba(255,140,66,0.1)]',
  Плечи: 'text-[var(--accent)] bg-[var(--accent-dim)]',
}

export function ExerciseDetailPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { id } = useParams<{ id: string }>()
  const { data: exercise, isLoading } = useExercise(id)

  if (isLoading) {
    return <p className="p-10 text-center text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
  }

  if (!exercise) {
    return (
      <div className="page-container">
        <p className="text-[var(--text-muted)]">{t('exerciseDetail.notFound')}</p>
        <Link to="/trainer/exercises" className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--accent)]">
          <ArrowLeft className="h-4 w-4" /> {t('exerciseDetail.backToCatalog')}
        </Link>
      </div>
    )
  }

  const steps = exercise.steps?.length
    ? exercise.steps
    : exercise.technique
      ? [exercise.technique]
      : exercise.description
        ? [exercise.description]
        : []

  return (
    <div className="page-container">
      <Link
        to="/trainer/exercises"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" /> {t('exercisesPage.title')}
      </Link>

      <article className="exercise-detail">
        <div className="exercise-detail__media">
          {exercise.imageUrl ? (
            <img src={exercise.imageUrl} alt={exercise.name} className="exercise-detail__image" />
          ) : (
            <div className="exercise-detail__image-placeholder">
              <span className="font-display text-4xl font-extrabold text-[var(--text-muted)]">
                {exercise.name.slice(0, 1)}
              </span>
            </div>
          )}
        </div>

        <div className="exercise-detail__body">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={cn('text-[10px] uppercase', muscleTone[exercise.muscleGroup])}>
              {exercise.muscleGroup}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {exercise.equipment}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {t(`exercisesPage.difficulty.${exercise.difficulty}`)}
            </Badge>
          </div>

          <h1 className="exercise-detail__title">{exercise.name}</h1>

          {exercise.trainerName ? (
            <p className="exercise-detail__trainer">{t('exerciseDetail.trainer', { name: exercise.trainerName })}</p>
          ) : null}

          {exercise.level ? <p className="exercise-detail__level">{exercise.level}</p> : null}

          {steps.length > 0 ? (
            <ol className="exercise-detail__steps">
              {steps.map((step, index) => (
                <li key={index} className="exercise-detail__step">
                  <span className="exercise-detail__step-num">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {exercise.breathingTip ? (
            <div className="exercise-detail__breathing">
              <Wind className="h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">{t('exerciseDetail.breathing')}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{exercise.breathingTip}</p>
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </div>
  )
}
