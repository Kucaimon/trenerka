import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/shared/progress-bar'
import { useClientDashboard, useClientWorkouts } from '@/features/api/hooks'
import { MobileCard, MobileListItem, MobileListStagger } from '@/components/mobile'

export function ClientWorkoutsPage() {
  const { data: dashboard } = useClientDashboard()
  const { data: workouts = [], isLoading } = useClientWorkouts()

  return (
    <MobileListStagger className="space-y-5">
      <MobileListItem>
        <section>
          <p className="label-caps">Программа</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{dashboard?.currentProgram ?? '—'}</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Тренер: {dashboard?.profile.trainer}</p>
        </section>
      </MobileListItem>

      <MobileListItem>
      <MobileCard className="!py-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">Выполнение недели</p>
          <span className="text-sm font-semibold">86%</span>
        </div>
        <Progress value={86} />
      </MobileCard>
      </MobileListItem>

      {isLoading ? (
        <p className="text-sm text-[var(--text-muted)]">Загрузка…</p>
      ) : (
        workouts.map((workout) => (
          <MobileListItem key={workout.id}>
          <Link
            to="/client/workouts/session"
            className="mobile-card flex items-center justify-between transition-colors hover:bg-white/[0.04]"
          >
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{workout.day}</Badge>
                <p className="font-semibold">{workout.title}</p>
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{workout.exercises.length} упражнений</p>
            </div>
            <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
          </Link>
          </MobileListItem>
        ))
      )}
    </MobileListStagger>
  )
}
