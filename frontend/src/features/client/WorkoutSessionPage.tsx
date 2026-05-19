import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, Timer, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/shared/progress-bar'
import { useClientWorkouts } from '@/features/api/hooks'
import { completeClientWorkout } from '@/features/api/client-cabinet-service'
import { toast } from 'sonner'

export function WorkoutSessionPage() {
  const { t } = useTranslation(['client', 'common'])
  const { data: workouts = [] } = useClientWorkouts()
  const workout = workouts[0]
  const [current, setCurrent] = useState(0)
  const [completedSets, setCompletedSets] = useState(0)
  const [rest, setRest] = useState(false)

  if (!workout) {
    return <p className="p-6 text-sm text-[var(--text-muted)]">{t('session.empty')}</p>
  }

  const exercise = workout.exercises[current]!
  const totalSteps = workout.exercises.reduce((sum, item) => sum + item.sets, 0)
  const doneBeforeCurrent = workout.exercises.slice(0, current).reduce((sum, item) => sum + item.sets, 0)
  const progress = ((doneBeforeCurrent + completedSets) / totalSteps) * 100

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

  return (
    <div className="session-mode space-y-5 px-4 py-4">
      <div className="flex items-center justify-between">
        <Link to="/client/workouts" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
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
          <span className="rounded-md border border-[var(--border)] bg-black/20 px-2 py-1 text-xs text-[var(--text-muted)]">{exercise.muscle}</span>
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
        <Button variant="secondary" className="mt-5 w-full">
          <Video className="h-4 w-4" /> {t('session.videoTechnique')}
        </Button>

        {rest ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-black/20 p-5">
            <Timer className="mx-auto h-7 w-7 text-[var(--accent)]" />
            <p className="mt-3 tabular-nums text-4xl font-semibold">
              {exercise.rest ? `1:${String(exercise.rest % 60).padStart(2, '0')}` : '0:00'}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{t('session.restBetweenSets')}</p>
            <Button
              className="mt-5 w-full"
              onClick={async () => {
                if (finished) {
                  try {
                    await completeClientWorkout(workout.id)
                    toast.success(t('session.toast.completed'))
                  } catch {
                    toast.error(t('common:saveError'))
                  }
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
          <div key={item.name} className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${index === current ? 'border-[var(--accent)]/35 bg-[var(--accent)]/[0.055]' : 'border-[var(--border)] bg-white/[0.03]'}`}>
            <div>
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.sets} x {item.reps}</p>
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
