import { useTranslation } from 'react-i18next'
import { Apple, Droplets, Flame, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/shared/progress-bar'
import { mockMealPlan } from '@/lib/mock-data'

const DAY_KEYS: Record<string, string> = {
  Понедельник: 'nutrition.meals.monday',
  Вторник: 'nutrition.meals.tuesday',
}

const MEAL_KEYS: Record<string, string> = {
  'Овсянка с ягодами': 'nutrition.meals.oatmeal',
  'Куриная грудка с рисом': 'nutrition.meals.chickenRice',
  'Рыба с овощами': 'nutrition.meals.fishVeg',
  'Омлет с авокадо': 'nutrition.meals.omelette',
  'Индейка с гречкой': 'nutrition.meals.turkeyBuckwheat',
  'Творог с орехами': 'nutrition.meals.cottageCheese',
}

export function NutritionPage() {
  const { t } = useTranslation(['client', 'common'])
  const calories = mockMealPlan[0].meals.reduce((sum, meal) => sum + meal.calories, 0)
  const label = (map: Record<string, string>, value: string) => {
    const key = map[value]
    return key ? t(key) : value
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="label-caps">{t('nutrition.eyebrow')}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{t('nutrition.title')}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('nutrition.subtitle')}</p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(184,245,61,0.10),rgba(22,22,22,0.85)_42%,rgba(8,8,8,0.95))] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">{t('nutrition.calories')}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{calories}</p>
          </div>
          <Flame className="h-8 w-8 text-[var(--accent)]" />
        </div>
        <div className="mt-4">
          <Progress value={74} />
          <p className="mt-2 text-xs text-[var(--text-muted)]">{t('nutrition.goalProgress')}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[var(--border)] bg-white/[0.03] p-4">
          <Apple className="h-4 w-4 text-emerald-300" />
          <p className="mt-2 text-lg font-semibold">{t('nutrition.proteinAmount')}</p>
          <p className="text-xs text-[var(--text-muted)]">{t('nutrition.protein')}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white/[0.03] p-4">
          <Droplets className="h-4 w-4 text-[var(--blue)]" />
          <p className="mt-2 text-lg font-semibold">{t('nutrition.waterAmount')}</p>
          <p className="text-xs text-[var(--text-muted)]">{t('nutrition.water')}</p>
        </div>
      </section>

      {mockMealPlan.map((day) => (
        <section key={day.id} className="overflow-hidden rounded-xl border border-[var(--border)] bg-white/[0.03]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-sm font-semibold">{label(DAY_KEYS, day.day)}</p>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {day.meals.map((m) => (
              <div key={m.time} className="flex justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">{label(MEAL_KEYS, m.name)}</p>
                  <p className="text-xs text-[var(--text-muted)]">{m.time}</p>
                </div>
                <span className="shrink-0 tabular-nums text-[var(--text-muted)]">
                  {m.calories} {t('common:units.kcal')}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Button className="w-full" variant="secondary">
        <Plus className="h-4 w-4" /> {t('nutrition.addMeal')}
      </Button>
    </div>
  )
}
