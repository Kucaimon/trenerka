import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { displayExercise } from '@/lib/exercise-i18n'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

function SortableExercise({
  ex,
  onRemove,
  setsLabel,
  repsLabel,
  restLabel,
  restValue,
}: {
  ex: Exercise
  onRemove: () => void
  setsLabel: string
  repsLabel: string
  restLabel: string
  restValue: string
}) {
  const { t } = useTranslation('trainer')
  const displayed = displayExercise(ex, t)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ex.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface2)] transition-colors hover:border-[var(--border-strong)]"
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
          <p className="text-sm font-semibold">{displayed.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">
            {displayed.muscleGroup} · {displayed.equipment}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[var(--border)] px-4 py-3">
        {[
          [setsLabel, '4'],
          [repsLabel, '8'],
          [restLabel, restValue],
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

export function WorkoutBuilderPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const [params] = useSearchParams()
  const programId = params.get('id')
  const { data: library = [] } = useQuery({ queryKey: ['exercises'], queryFn: getExercises })
  const [programName, setProgramName] = useState(() => t('builder.defaultProgramName'))
  const [programDbId, setProgramDbId] = useState<string | undefined>(programId ?? undefined)
  const [selected, setSelected] = useState<Exercise[]>([])
  const [week, setWeek] = useState<(typeof DAYS)[number]>('mon')
  const [libSearch, setLibSearch] = useState('')
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const dayLabels = DAYS.map((d) => t(`common:days.${d}`))

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

  const filteredLib = library.filter((ex) => {
    const label = displayExercise(ex, t).name
    return label.toLowerCase().includes(libSearch.toLowerCase())
  })

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
  const weekIdx = DAYS.indexOf(week)

  const handleSave = async () => {
    setSaving(true)
    try {
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
        dayLabel: dayLabels[weekIdx] ?? dayLabels[0],
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
      toast.success(t('builder.toast.saved'))
    } catch {
      toast.error(t('common:saveError'))
    } finally {
      setSaving(false)
    }
  }

  const renderCatalogItem = (ex: Exercise) => {
    const displayed = displayExercise(ex, t)
    return (
      <button
        key={ex.id}
        type="button"
        onClick={() => add(ex)}
        className="mb-0.5 flex w-full min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2.5 text-left hover:bg-[var(--surface2)]"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{displayed.name}</p>
          <p className="truncate text-[11px] text-[var(--text-muted)]">{displayed.muscleGroup}</p>
        </div>
        <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
      </button>
    )
  }

  return (
    <div className="builder-mobile-stack -mx-4 -my-7 flex min-h-[calc(100dvh-var(--header-height)-var(--app-content-pad-bottom))] flex-col lg:-mx-8">
      <div className="builder-catalog-mobile border-b border-[var(--border)] bg-[var(--surface)] lg:hidden">
        <button
          type="button"
          className="flex w-full min-h-[48px] items-center justify-between px-4 py-3 text-sm font-semibold"
          onClick={() => setCatalogOpen((o) => !o)}
        >
          {t('builder.catalog.mobile')}
          <Plus className={cn('h-4 w-4 text-[var(--accent)] transition-transform', catalogOpen && 'rotate-45')} />
        </button>
        {catalogOpen ? (
          <>
            <div className="border-b border-[var(--border)] px-3.5 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
                <Input
                  className="h-9 border-[var(--border)] bg-[var(--surface2)] pl-9 text-[13px]"
                  placeholder={t('builder.searchPlaceholder')}
                  value={libSearch}
                  onChange={(e) => setLibSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[36dvh] overflow-y-auto p-2">{filteredLib.map(renderCatalogItem)}</div>
          </>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="builder-catalog-desktop hidden w-[260px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
          <div className="border-b border-[var(--border)] px-[18px] py-4 text-[13px] font-semibold">{t('builder.catalog.desktop')}</div>
          <div className="border-b border-[var(--border)] px-3.5 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                className="h-9 border-[var(--border)] bg-[var(--surface2)] pl-9 text-[13px]"
                placeholder={t('builder.searchPlaceholder')}
                value={libSearch}
                onChange={(e) => setLibSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">{filteredLib.map(renderCatalogItem)}</div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto bg-[var(--bg-base)] p-4 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <input
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="font-display w-full max-w-md border-none bg-transparent text-[22px] font-extrabold tracking-tight outline-none"
              aria-label={t('builder.aria.programName')}
            />
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Timer className="h-4 w-4" />
              {duration ? `${duration} ${t('common:units.min')}` : `0 ${t('common:units.min')}`}
            </div>
          </div>

          <div className="mb-5 flex gap-1 overflow-x-auto">
            {DAYS.map((d, i) => (
              <button
                key={d}
                type="button"
                onClick={() => setWeek(d)}
                className={cn(
                  'shrink-0 rounded-[8px] border px-3.5 py-1.5 text-xs font-medium transition-colors',
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
                  <SortableExercise
                    key={ex.id}
                    ex={ex}
                    onRemove={() => setSelected(selected.filter((s) => s.id !== ex.id))}
                    setsLabel={t('builder.metrics.sets')}
                    repsLabel={t('builder.metrics.reps')}
                    restLabel={t('builder.metrics.rest')}
                    restValue={t('builder.metrics.restValue')}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {!selected.length && (
            <div className="rounded-[10px] border border-dashed border-[var(--border-strong)] bg-[var(--surface2)] py-12 text-center">
              <p className="text-sm font-medium text-[var(--text-secondary)]">{t('builder.empty.title')}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t('builder.empty.hint')}</p>
            </div>
          )}
        </main>

        <aside className="hidden w-[280px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)] xl:flex">
          <div className="border-b border-[var(--border)] px-5 py-4 text-[13px] font-semibold">{t('builder.summary.title')}</div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface3)] p-4">
              <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
                <Sparkles className="h-3 w-3" /> AI
              </p>
              <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{t('builder.ai.hint')}</p>
              <Button variant="secondary" size="sm" className="mt-3 w-full border-[rgba(184,245,61,0.2)] text-[var(--accent)]">
                {t('builder.ai.suggest')}
              </Button>
            </div>

            <div className="rounded-[10px] bg-[var(--surface2)] p-3.5">
              {[
                [t('builder.summary.exercises'), String(selected.length)],
                [t('builder.summary.estimatedTime'), duration ? `${duration} ${t('common:units.min')}` : '—'],
                [t('builder.summary.day'), dayLabels[weekIdx]],
                [
                  t('builder.summary.volume'),
                  selected.length ? t('builder.summary.volumeSets', { count: selected.length * 4 }) : '—',
                ],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0">
                  <span className="text-xs text-[var(--text-muted)]">{label}</span>
                  <span className="text-[13px] font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={handleSave} disabled={saving}>
              <Sparkles className="h-4 w-4" /> {saving ? t('common:actions.saving') : t('builder.save')}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
