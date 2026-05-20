import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, ExternalLink, Timer, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/shared/progress-bar'
import { useClientWorkouts, useCompleteClientWorkout } from '@/features/api/hooks'
import { toast } from 'sonner'

function RestCountdown({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (left <= 0) return
    const id = window.setInterval(() => setLeft((v) => v - 1), 1000)
    return () => window.clearInterval(id)
  }, [left])

  const mm = Math.floor(Math.max(left, 0) / 60)
  const ss = Math.max(left, 0) % 60

  return (
    <p className="mt-3 tabular-nums text-4xl font-semibold">
      {mm}:{String(ss).padStart(2, '0')}
    </p>
  )
}

export function WorkoutSessionPage() {
  const { t } = useTranslation(['client', 'common'])
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: workouts = [], isLoading } = useClientWorkouts()
  const completeWorkout = useCompleteClientWorkout()
  const workout = workouts.find((w) => w.id === id)
  const [current, setCurrent] = useState(0)
  const [completedSets, setCompletedSets] = useState(0)
  const [rest, setRest] = useState(false)

  if (isLoading) {
    return <p className="p-6 text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
  }

  if (!workout) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-[var(--text-muted)]">{t('session.empty')}</p>
        <Button asChild variant="secondary">
          <Link to="/client/workouts">{t('session.backToPlan')}</Link>
        </Button>
      </div>
    )
  }

  const exercise = workout.exercises[current]!
  const totalSteps = workout.exercises.reduce((sum, item) => sum + item.sets, 0)
  const doneBeforeCurrent = workout.exercises.slice(0, current).reduce((sum, item) => sum + item.sets, 0)
  const progress = totalSteps ? ((doneBeforeCurrent + completedSets) / totalSteps) * 100 : 0

  const completeSet = () => {
    if (completedSets + 1 >= exercise.sets) {
      setCompletedSets(exercise.sets)
      setRest(true)
      return
    }
    setCompletedSets((value) => value + 1)
    setRest(true)
  }

  const nextStep = () => {
    setRest(false)
    if (completedSets >= exercise.sets && current < workout.exercises.length - 1) {
      setCurrent((value) => value + 1)
      setCompletedSets(0)
    }
  }

  const finished = current === workout.exercises.length - 1 && completedSets >= exercise.sets

  const nextButtonLabel = finished
    ? t('session.completeWorkout')
    : completedSets >= exercise.sets
      ? t('session.nextExercise')
      : t('session.nextSet')

  const handleFinish = async () => {
    try {
      await completeWorkout.mutateAsync(workout.id)
      toast.success(t('session.toast.completed'))
      navigate('/client/workouts')
    } catch {
      toast.error(t('common:saveError'))
    }
  }

  return (
    <div className="session-mode space-y-5 px-4 py-4">
      <div className="flex items-center justify-between">
        <Link
          to="/client/workouts"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" /> {t('session.backToPlan')}
        </Link>
        <span className="text-sm tabular-nums text-[var(--text-muted)]">
          {current + 1}/{workout.exercises.length}
        </span>
      </div>

      <section className="glass-panel rounded-xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="label-caps">{workout.title}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{exercise.name}</h1>
          </div>
          <span className="rounded-md border border-[var(--border)] bg-black/20 px-2 py-1 text-xs text-[var(--text-muted)]">
            {exercise.muscle}
          </span>
        </div>
        <Progress value={progress} />
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          {t('session.overallProgress', { percent: Math.round(progress) })}
        </p>
      </section>

      <section className="session-hero">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">{t('session.workBlock')}</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <SessionMetric label={t('session.metrics.sets')} value={`${completedSets}/${exercise.sets}`} />
          <SessionMetric label={t('session.metrics.reps')} value={exercise.reps} />
          <SessionMetric label={t('session.metrics.rest')} value={`${exercise.rest}${t('common:units.sec')}`} />
        </div>
        <p className="mt-5 text-sm leading-6 text-[var(--text-secondary)]">{exercise.technique}</p>
        {exercise.videoUrl ? (
          <Button variant="secondary" className="mt-5 w-full" asChild>
            <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer">
              <Video className="h-4 w-4" /> {t('session.videoTechnique')}
              <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-60" />
            </a>
          </Button>
        ) : (
          <Button variant="secondary" className="mt-5 w-full" disabled>
            <Video className="h-4 w-4" /> {t('session.videoUnavailable')}
          </Button>
        )}

        {rest ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-black/20 p-5">
            <Timer className="mx-auto h-7 w-7 text-[var(--accent)]" />
            <RestCountdown key={`${current}-${completedSets}-${exercise.rest || 60}`} seconds={exercise.rest || 60} />
            <p className="mt-1 text-xs text-[var(--text-muted)]">{t('session.restBetweenSets')}</p>
            <Button
              className="mt-5 w-full"
              disabled={completeWorkout.isPending}
              onClick={() => {
                if (finished) {
                  void handleFinish()
                  return
                }
                nextStep()
              }}
            >
              <Check className="h-4 w-4" /> {nextButtonLabel}
            </Button>
          </div>
        ) : (
          <Button className="mt-6 w-full" onClick={completeSet}>
            {t('session.setDone')}
          </Button>
        )}
      </section>

      <section className="space-y-2">
        {workout.exercises.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
              index === current
                ? 'border-[var(--accent)]/35 bg-[var(--accent)]/[0.055]'
                : 'border-[var(--border)] bg-white/[0.03]'
            }`}
          >
            <div>
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {item.sets} x {item.reps}
              </p>
            </div>
            {index < current && <Check className="h-4 w-4 text-emerald-300" />}
          </div>
        ))}
      </section>
    </div>
  )
}

function SessionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-black/20 p-3">
      <p className="text-[10px] font-semibold uppercase text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}
