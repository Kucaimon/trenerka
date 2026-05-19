import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateExercise, useDeleteExercise, useExercisesAll, useUpdateExercise } from '@/features/api/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Exercise } from '@/types'

const schema = z.object({
  name: z.string().min(2),
  muscleGroup: z.string().min(2),
  equipment: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
})

type FormValues = z.infer<typeof schema>

export function ExercisesAdminPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { data: exercises = [] } = useExercisesAll()
  const createEx = useCreateExercise()
  const updateEx = useUpdateExercise()
  const deleteEx = useDeleteExercise()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Exercise | null>(null)
  const { register, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const publicExercises = exercises.filter((e) => e.isPublic !== false)

  const openForm = (ex?: Exercise) => {
    setEditing(ex ?? null)
    reset(
      ex
        ? { name: ex.name, muscleGroup: ex.muscleGroup, equipment: ex.equipment, difficulty: ex.difficulty }
        : { name: '', muscleGroup: '', equipment: '', difficulty: 'intermediate' },
    )
    setOpen(true)
  }

  const onSubmit = async (data: FormValues) => {
    try {
      if (editing) {
        await updateEx.mutateAsync({ id: editing.id, data: { ...data, isPublic: true } })
      } else {
        await createEx.mutateAsync({ ...data, isPublic: true })
      }
      toast.success(t('common:actions.saved'))
      setOpen(false)
    } catch {
      toast.error(t('common:toast.error'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('exercises.title')}</h1>
        <Button onClick={() => openForm()}>
          <Plus className="mr-2 h-4 w-4" />
          {t('exercises.add')}
        </Button>
      </div>
      <div className="table-scroll overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-[#111827] text-slate-400">
            <tr>
              <th className="p-3 text-left">{t('exercises.table.name')}</th>
              <th className="p-3">{t('exercises.table.group')}</th>
              <th className="p-3">{t('exercises.table.equipment')}</th>
              <th className="p-3">{t('exercises.table.level')}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {publicExercises.map((ex) => (
              <tr key={ex.id} className="border-t border-white/5">
                <td className="p-3">{ex.name}</td>
                <td className="p-3 text-center text-slate-400">{ex.muscleGroup}</td>
                <td className="p-3 text-center text-slate-400">{ex.equipment}</td>
                <td className="p-3 text-center">{ex.difficulty}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openForm(ex)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400"
                    onClick={() => deleteEx.mutate(ex.id, { onSuccess: () => toast.success(t('common:deleted')) })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('common:actions.edit') : t('exercises.dialog.new')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>{t('exercises.table.name')}</Label>
              <Input {...register('name')} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('exercises.field.muscleGroup')}</Label>
              <Input {...register('muscleGroup')} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('exercises.table.equipment')}</Label>
              <Input {...register('equipment')} />
            </div>
            <Button type="submit" className="w-full">
              {t('common:actions.save')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
