import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Plus, Pencil, Search, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateExercise,
  useDeleteExercise,
  useExercises,
  useExercisesAll,
  useUpdateExercise,
} from '@/features/api/hooks'
import { EXERCISE_PAGE_SIZE } from '@/features/api/exercise-list'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageHeader } from '@/components/shared/page-header'
import type { Exercise } from '@/types'
import { cn } from '@/lib/utils'
import {
  displayExercise,
  EQUIPMENT_KEYS,
  MUSCLE_KEYS,
  translateMuscle,
} from '@/lib/exercise-i18n'

const muscleTone: Record<string, string> = {
  Грудь: 'text-[var(--danger)] bg-[rgba(255,77,77,0.1)]',
  Ноги: 'text-[#4d9eff] bg-[rgba(77,158,255,0.1)]',
  Спина: 'text-[#a78bfa] bg-[rgba(167,139,250,0.1)]',
  Кор: 'text-[var(--warning)] bg-[rgba(255,140,66,0.1)]',
  Плечи: 'text-[var(--accent)] bg-[var(--accent-dim)]',
  Руки: 'text-[#f472b6] bg-[rgba(244,114,182,0.1)]',
  Кардио: 'text-[#34d399] bg-[rgba(52,211,153,0.1)]',
}

const formSchema = z.object({
  name: z.string().min(2),
  muscleGroup: z.string().min(2),
  equipment: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  description: z.string().optional(),
  technique: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const muscleOptions = Object.keys(MUSCLE_KEYS)
const equipmentOptions = Object.keys(EQUIPMENT_KEYS)
const difficultyOptions = ['beginner', 'intermediate', 'advanced'] as const

export function ExercisesPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState<string | undefined>()
  const [equipment, setEquipment] = useState<string | undefined>()
  const [difficulty, setDifficulty] = useState<Exercise['difficulty'] | undefined>()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Exercise | null>(null)

  const { data: catalog } = useExercisesAll()
  const totalCatalog = catalog?.length ?? 0

  const { data: listResult, isLoading } = useExercises({
    search: search || undefined,
    muscle,
    equipment,
    difficulty,
    page,
    limit: EXERCISE_PAGE_SIZE,
  })

  const exercises = listResult?.items ?? []
  const total = listResult?.total ?? 0
  const totalPages = listResult?.totalPages ?? 1

  const createEx = useCreateExercise()
  const updateEx = useUpdateExercise()
  const deleteEx = useDeleteExercise()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { difficulty: 'intermediate' },
  })

  const hasActiveFilters = Boolean(muscle || equipment || difficulty || search)

  const clearFilters = () => {
    setSearch('')
    setMuscle(undefined)
    setEquipment(undefined)
    setDifficulty(undefined)
    setPage(1)
  }

  const filterMuscleChips = useMemo(
    () => [
      { value: undefined, label: t('exercisesPage.filters.all') },
      ...muscleOptions.map((m) => ({ value: m, label: translateMuscle(m, t) })),
    ],
    [t],
  )

  const filterEquipmentChips = useMemo(
    () => [
      { value: undefined, label: t('exercisesPage.filters.all') },
      ...equipmentOptions.map((e) => ({
        value: e,
        label: t(`catalog.equipment.${EQUIPMENT_KEYS[e]}`),
      })),
    ],
    [t],
  )

  const filterDifficultyChips = useMemo(
    () => [
      { value: undefined, label: t('exercisesPage.filters.all') },
      ...difficultyOptions.map((d) => ({
        value: d,
        label: t(`exercisesPage.difficulty.${d}`),
      })),
    ],
    [t],
  )

  const setMuscleFilter = (value: string | undefined) => {
    setMuscle(value)
    setPage(1)
  }

  const setEquipmentFilter = (value: string | undefined) => {
    setEquipment(value)
    setPage(1)
  }

  const setDifficultyFilter = (value: Exercise['difficulty'] | undefined) => {
    setDifficulty(value)
    setPage(1)
  }

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', muscleGroup: '', equipment: '', difficulty: 'intermediate', description: '', technique: '' })
    setOpen(true)
  }

  const openEdit = (ex: Exercise) => {
    setEditing(ex)
    reset({
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      equipment: ex.equipment,
      difficulty: ex.difficulty,
      description: ex.description ?? '',
      technique: ex.technique ?? '',
    })
    setOpen(true)
  }

  const onSubmit = async (data: FormValues) => {
    try {
      if (editing) {
        await updateEx.mutateAsync({ id: editing.id, data })
        toast.success(t('exercisesPage.updated'))
      } else {
        await createEx.mutateAsync({ ...data, isPublic: false })
        toast.success(t('exercisesPage.added'))
      }
      setOpen(false)
    } catch {
      toast.error(t('common:saveError'))
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title={t('exercisesPage.title')}
        description={t('exercisesPage.catalog', { count: totalCatalog })}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t('common:actions.add')}
          </Button>
        }
      />

      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            className="border-[var(--border)] bg-[var(--surface2)] pl-9"
            placeholder={t('exercisesPage.searchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {t('exercisesPage.filters.muscle')}
            </p>
            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-[12px]" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" />
                {t('exercisesPage.filters.clear')}
              </Button>
            ) : null}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {filterMuscleChips.map((chip) => (
              <button
                key={chip.value ?? 'all-muscle'}
                type="button"
                onClick={() => setMuscleFilter(chip.value)}
                className={cn('filter-pill shrink-0', muscle === chip.value && 'active')}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {t('exercisesPage.filters.equipment')}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {filterEquipmentChips.map((chip) => (
              <button
                key={chip.value ?? 'all-equipment'}
                type="button"
                onClick={() => setEquipmentFilter(chip.value)}
                className={cn('filter-pill shrink-0', equipment === chip.value && 'active')}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {t('exercisesPage.filters.difficulty')}
          </p>
          <div className="flex gap-1.5 overflow-x-auto">
            {filterDifficultyChips.map((chip) => (
              <button
                key={chip.value ?? 'all-difficulty'}
                type="button"
                onClick={() => setDifficultyFilter(chip.value as Exercise['difficulty'] | undefined)}
                className={cn('filter-pill shrink-0', difficulty === chip.value && 'active')}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[var(--text-secondary)]">
          <span>{t('exercisesPage.results', { shown: exercises.length, total })}</span>
          {totalPages > 1 ? (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label={t('exercisesPage.pagination.prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[7rem] text-center text-[12px]">
                {t('exercisesPage.pagination.page', { current: page, total: totalPages })}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label={t('exercisesPage.pagination.next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="gap-grid mt-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full p-10 text-center text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
        ) : exercises.length === 0 ? (
          <p className="col-span-full p-10 text-center text-sm text-[var(--text-muted)]">{t('exercisesPage.notFound')}</p>
        ) : (
          exercises.map((ex) => {
            const displayed = displayExercise(ex, t)
            return (
              <div key={ex.id} className="gap-grid-cell overflow-hidden p-0">
                <Link
                  to={`/trainer/exercises/${ex.id}`}
                  className="block p-5 transition-colors hover:bg-[var(--surface2)]"
                >
                  <div className="flex items-start gap-3">
                    {ex.imageUrl ? (
                      <img
                        src={ex.imageUrl}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-lg border border-[var(--border)] object-cover"
                      />
                    ) : null}
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-[15px] font-bold">{displayed.name}</p>
                        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{displayed.equipment}</p>
                        <p className="mt-2 text-[12px] text-[var(--text-muted)]">
                          {t(`exercisesPage.difficulty.${ex.difficulty}`)}
                        </p>
                      </div>
                      <Badge variant="secondary" className={cn('shrink-0 text-[10px] uppercase', muscleTone[ex.muscleGroup])}>
                        {displayed.muscleGroup}
                      </Badge>
                    </div>
                  </div>
                </Link>
                <div className="flex gap-1 border-t border-[var(--border)] px-3 py-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(ex)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {!ex.isPublic && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400"
                      onClick={() => deleteEx.mutate(ex.id, { onSuccess: () => toast.success(t('common:deleted')) })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
            {t('exercisesPage.pagination.prev')}
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            {t('exercisesPage.pagination.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('common:actions.edit') : t('exercisesPage.newExercise')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>{t('exercisesPage.name')}</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('exercisesPage.muscleGroup')}</Label>
                <Input {...register('muscleGroup')} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('exercisesPage.equipment')}</Label>
                <Input {...register('equipment')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t('exercisesPage.level')}</Label>
              <select {...register('difficulty')} className="w-full rounded-md border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-sm">
                <option value="beginner">{t('exercisesPage.difficulty.beginner')}</option>
                <option value="intermediate">{t('exercisesPage.difficulty.intermediate')}</option>
                <option value="advanced">{t('exercisesPage.difficulty.advanced')}</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={createEx.isPending || updateEx.isPending}>
              {t('common:actions.save')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
