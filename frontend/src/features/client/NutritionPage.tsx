import { Apple, Droplets, Flame, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/shared/progress-bar'
import { mockMealPlan } from '@/lib/mock-data'

export function NutritionPage() {
  const calories = mockMealPlan[0].meals.reduce((sum, meal) => sum + meal.calories, 0)

  return (
    <div className="space-y-5">
      <div>
        <p className="label-caps">Питание</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">План на сегодня</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Базовый MVP: план питания, калории и заметки для тренера.</p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(184,245,61,0.10),rgba(22,22,22,0.85)_42%,rgba(8,8,8,0.95))] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Калории</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{calories}</p>
          </div>
          <Flame className="h-8 w-8 text-[var(--accent)]" />
        </div>
        <div className="mt-4">
          <Progress value={74} />
          <p className="mt-2 text-xs text-[var(--text-muted)]">74% от дневной цели · 1 820 ккал</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[var(--border)] bg-white/[0.03] p-4">
          <Apple className="h-4 w-4 text-emerald-300" />
          <p className="mt-2 text-lg font-semibold">128 г</p>
          <p className="text-xs text-[var(--text-muted)]">белок</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white/[0.03] p-4">
          <Droplets className="h-4 w-4 text-[var(--blue)]" />
          <p className="mt-2 text-lg font-semibold">1.8 л</p>
          <p className="text-xs text-[var(--text-muted)]">вода</p>
        </div>
      </section>

      {mockMealPlan.map((day) => (
        <section key={day.id} className="overflow-hidden rounded-xl border border-[var(--border)] bg-white/[0.03]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-sm font-semibold">{day.day}</p>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {day.meals.map((m) => (
              <div key={m.time} className="flex justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{m.time}</p>
                </div>
                <span className="shrink-0 tabular-nums text-[var(--text-muted)]">{m.calories} ккал</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Button className="w-full" variant="secondary">
        <Plus className="h-4 w-4" /> Добавить приём пищи
      </Button>
    </div>
  )
}
