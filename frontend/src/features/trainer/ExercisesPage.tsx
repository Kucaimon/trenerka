import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateExercise,
  useDeleteExercise,
  useExercises,
  useUpdateExercise,
} from '@/features/api/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageHeader } from '@/components/shared/page-header'
import type { Exercise } from '@/types'
import { cn } from '@/lib/utils'

const muscleTone: Record<string, string> = {
  Грудь: 'text-[var(--danger)] bg-[rgba(255,77,77,0.1)]',
  Ноги: 'text-[#4d9eff] bg-[rgba(77,158,255,0.1)]',
  Спина: 'text-[#a78bfa] bg-[rgba(167,139,250,0.1)]',
  Кор: 'text-[var(--warning)] bg-[rgba(255,140,66,0.1)]',
  Плечи: 'text-[var(--accent)] bg-[var(--accent-dim)]',
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

export function ExercisesPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: exercises = [], isLoading } = useExercises()
  const createEx = useCreateExercise()
  const updateEx = useUpdateExercise()
  const deleteEx = useDeleteExercise()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Exercise | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { difficulty: 'intermediate' },
  })

  const filtered = exercises.filter((ex) => ex.name.toLowerCase().includes(search.toLowerCase()))

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
        description={t('exercisesPage.catalog', { count: exercises.length })}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t('common:actions.add')}
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <Input
          className="border-[var(--border)] bg-[var(--surface2)] pl-9"
          placeholder={t('exercisesPage.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="gap-grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full p-10 text-center text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
        ) : filtered.length === 0 ? (
          <p className="col-span-full p-10 text-center text-sm text-[var(--text-muted)]">{t('exercisesPage.notFound')}</p>
        ) : (
          filtered.map((ex) => (
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
                      <p className="font-display text-[15px] font-bold">{ex.name}</p>
                      <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{ex.equipment}</p>
                      <p className="mt-2 text-[12px] text-[var(--text-muted)]">
                        {t(`exercisesPage.difficulty.${ex.difficulty}`)}
                      </p>
                    </div>
                    <Badge variant="secondary" className={cn('shrink-0 text-[10px] uppercase', muscleTone[ex.muscleGroup])}>
                      {ex.muscleGroup}
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
          ))
        )}
      </div>

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
