import type { ComponentType } from 'react'
import { Flame, Medal, Sun, Trophy } from 'lucide-react'
import { Progress } from '@/components/shared/progress-bar'
import { mockAchievements } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const icons: Record<string, ComponentType<{ className?: string }>> = {
  flame: Flame,
  trophy: Trophy,
  medal: Medal,
  sun: Sun,
}

export function AchievementsPage() {
  const unlocked = mockAchievements.filter((item) => item.unlockedAt).length

  return (
    <div className="space-y-5">
      <div>
        <p className="label-caps">Награды</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Достижения</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Мотивация клиента: серия, цели и открытые бейджи.</p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(184,245,61,0.12),rgba(22,22,22,0.85)_42%,rgba(8,8,8,0.95))] p-5">
        <Flame className="h-7 w-7 text-[var(--accent)]" />
        <p className="mt-4 text-4xl font-semibold tracking-tight tabular-nums">12</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">дней подряд без пропусков</p>
        <div className="mt-4">
          <Progress value={(unlocked / mockAchievements.length) * 100} />
          <p className="mt-2 text-xs text-[var(--text-muted)]">{unlocked} из {mockAchievements.length} наград открыто</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {mockAchievements.map((achievement) => {
          const Icon = icons[achievement.icon] ?? Medal
          const locked = !achievement.unlockedAt
          return (
            <section key={achievement.id} className={cn('rounded-xl border border-[var(--border)] bg-white/[0.03] p-4 text-center', locked && 'opacity-50')}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-black/20">
                <Icon className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <p className="mt-3 text-sm font-semibold">{achievement.title}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{achievement.description}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                {achievement.unlockedAt ? 'Открыто' : 'В процессе'}
              </p>
            </section>
          )
        })}
      </div>
    </div>
  )
}
