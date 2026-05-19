import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Search, Sparkles, Timer, Trash2 } from 'lucide-react'
import { getExercises } from '@/features/api/exercises-service'
import { getProgram, saveProgram } from '@/features/api/programs-service'
import type { Program, ProgramWorkout, WorkoutExerciseItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Exercise } from '@/types'
import { cn } from '@/lib/utils'

function SortableExercise({ ex, onRemove }: { ex: Exercise; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ex.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--border-strong)]"
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-[var(--text-muted)] hover:text-[var(--text-secondary)] active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--surface3)] text-[11px] font-bold text-[var(--text-secondary)]">
          #
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{ex.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">
            {ex.muscleGroup} · {ex.equipment}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[var(--border)] px-4 py-3">
        {[
          ['Сеты', '4'],
          ['Повт.', '8'],
          ['Отдых', '90 сек'],
        ].map(([label, val]) => (
          <div key={label} className="min-w-[70px] flex-1 rounded-lg bg-[var(--surface2)] px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.05em] text-[var(--text-muted)]">{label}</p>
            <p className="font-display text-xl font-bold">{val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function WorkoutBuilderPage() {
  const [params] = useSearchParams()
  const programId = params.get('id')
  const { data: library = [] } = useQuery({ queryKey: ['exercises'], queryFn: getExercises })
  const [programName, setProgramName] = useState('Новая программа')
  const [programDbId, setProgramDbId] = useState<string | undefined>(programId ?? undefined)
  const [selected, setSelected] = useState<Exercise[]>([])
  const [week, setWeek] = useState('mon')
  const [libSearch, setLibSearch] = useState('')
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!programId) return
    getProgram(programId).then((p) => {
      if (!p) return
      setProgramName(p.name)
      setProgramDbId(p.id)
      const w = p.workouts?.[0]
      if (w?.exercises?.length) {
        setSelected(
          w.exercises.map((ex) => ({
            id: ex.exerciseId,
            name: ex.name ?? '',
            muscleGroup: ex.muscleGroup ?? '',
            equipment: '',
            difficulty: 'intermediate' as const,
          })),
        )
      }
    })
  }, [programId])

  const filteredLib = library.filter((ex) => ex.name.toLowerCase().includes(libSearch.toLowerCase()))

  const add = (ex: Exercise) => {
    if (!selected.find((s) => s.id === ex.id)) setSelected([...selected, ex])
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      const oldIndex = selected.findIndex((s) => s.id === active.id)
      const newIndex = selected.findIndex((s) => s.id === over.id)
      setSelected(arrayMove(selected, oldIndex, newIndex))
    }
  }

  const duration = selected.length ? selected.length * 9 + 12 : 0

  const handleSave = async () => {
    setSaving(true)
    try {
      const dayIdx = days.indexOf(week)
      const workoutExercises: WorkoutExerciseItem[] = selected.map((ex, i) => ({
        id: `we-${i}`,
        exerciseId: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: 4,
        reps: '8',
        restSeconds: 90,
        technique: ex.technique,
      }))
      const workout: ProgramWorkout = {
        id: 'w1',
        weekNumber: 1,
        dayLabel: dayLabels[dayIdx] ?? 'Пн',
        title: programName,
        exercises: workoutExercises,
      }
      const program: Program = {
        id: programDbId ?? '',
        name: programName,
        description: '',
        weeks: 4,
        workouts: [workout],
      }
      const saved = await saveProgram(program)
      setProgramDbId(saved.id)
      toast.success('Программа сохранена')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="builder-mobile-stack -mx-4 -my-7 flex min-h-[calc(100dvh-var(--header-height)-var(--app-content-pad-bottom))] flex-col lg:-mx-8">
      <div className="builder-catalog-mobile border-b border-[var(--border)] bg-[var(--surface)] lg:hidden">
        <button
          type="button"
          className="flex w-full min-h-[48px] items-center justify-between px-4 py-3 text-sm font-semibold"
          onClick={() => setCatalogOpen((o) => !o)}
        >
          Каталог упражнений
          <Plus className={cn('h-4 w-4 text-[var(--accent)] transition-transform', catalogOpen && 'rotate-45')} />
        </button>
        {catalogOpen ? (
          <>
            <div className="border-b border-[var(--border)] px-3.5 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
                <Input
                  className="h-9 border-[var(--border)] bg-[var(--surface2)] pl-9 text-[13px]"
                  placeholder="Поиск…"
                  value={libSearch}
                  onChange={(e) => setLibSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[36dvh] overflow-y-auto p-2">
              {filteredLib.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => add(ex)}
                  className="mb-0.5 flex w-full min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2.5 text-left hover:bg-[var(--surface2)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{ex.name}</p>
                    <p className="truncate text-[11px] text-[var(--text-muted)]">{ex.muscleGroup}</p>
                  </div>
                  <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="builder-catalog-desktop hidden w-[260px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
          <div className="border-b border-[var(--border)] px-[18px] py-4 text-[13px] font-semibold">Каталог</div>
          <div className="border-b border-[var(--border)] px-3.5 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                className="h-9 border-[var(--border)] bg-[var(--surface2)] pl-9 text-[13px]"
                placeholder="Поиск…"
                value={libSearch}
                onChange={(e) => setLibSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filteredLib.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => add(ex)}
                className="mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface2)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{ex.name}</p>
                  <p className="truncate text-[11px] text-[var(--text-muted)]">{ex.muscleGroup}</p>
                </div>
                <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
              </button>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-[var(--bg-base)] p-4 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <input
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="font-display w-full max-w-md border-none bg-transparent text-[22px] font-extrabold tracking-tight outline-none"
              aria-label="Название программы"
            />
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Timer className="h-4 w-4" />
              {duration ? `${duration} мин` : '0 мин'}
            </div>
          </div>

          <div className="mb-5 flex gap-1 overflow-x-auto">
            {days.map((d, i) => (
              <button
                key={d}
                type="button"
                onClick={() => setWeek(d)}
                className={cn(
                  'shrink-0 rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors',
                  week === d
                    ? 'border-[rgba(184,245,61,0.3)] bg-[var(--accent-dim)] text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                )}
              >
                {dayLabels[i]}
              </button>
            ))}
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={selected.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {selected.map((ex) => (
                  <SortableExercise key={ex.id} ex={ex} onRemove={() => setSelected(selected.filter((s) => s.id !== ex.id))} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {!selected.length && (
            <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] py-16 text-center">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Добавьте упражнения из каталога</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Перетаскивайте блоки для изменения порядка</p>
            </div>
          )}
        </main>

        {/* AI / Summary panel */}
        <aside className="hidden w-[280px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)] xl:flex">
          <div className="border-b border-[var(--border)] px-5 py-4 text-[13px] font-semibold">Сводка</div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--accent-glow)] to-[rgba(77,158,255,0.04)] p-4">
              <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
                <Sparkles className="h-3 w-3" /> AI-подсказка
              </p>
              <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                Добавьте упражнение на кор — план покрывает грудь и ноги, но мало стабилизации.
              </p>
              <Button variant="secondary" size="sm" className="mt-3 w-full border-[rgba(184,245,61,0.2)] text-[var(--accent)]">
                Предложить упражнения
              </Button>
            </div>

            <div className="rounded-[10px] bg-[var(--surface2)] p-3.5">
              {[
                ['Упражнений', String(selected.length)],
                ['Примерное время', duration ? `${duration} мин` : '—'],
                ['День', dayLabels[days.indexOf(week)]],
                ['Объём', selected.length ? `${selected.length * 4} подходов` : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0">
                  <span className="text-xs text-[var(--text-muted)]">{label}</span>
                  <span className="text-[13px] font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={handleSave} disabled={saving}>
              <Sparkles className="h-4 w-4" /> {saving ? 'Сохранение…' : 'Сохранить программу'}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
