import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { Dumbbell } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/saas'
import { assignProgram } from '@/features/api/programs-service'
import { usePrograms } from '@/features/api/hooks'

export function AssignProgramDialog({ clientId, trigger }: { clientId: string; trigger: ReactNode }) {
  const { t } = useTranslation(['trainer', 'common'])
  const [open, setOpen] = useState(false)
  const [programId, setProgramId] = useState('')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const { data: programs = [] } = usePrograms()
  const qc = useQueryClient()

  const selected = useMemo(() => programs.find((p) => p.id === programId), [programs, programId])

  const onAssign = async () => {
    if (!programId) return
    setLoading(true)
    try {
      await assignProgram(clientId, programId, startDate)
      await qc.invalidateQueries({ queryKey: ['client-program', clientId] })
      toast.success(t('assignProgram.toast.success'))
      setOpen(false)
    } catch {
      toast.error(t('assignProgram.toast.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('assignProgram.title')}</DialogTitle>
        </DialogHeader>
        {programs.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title={t('assignProgram.empty.title')}
            description={t('assignProgram.empty.description')}
            action={
              <Button size="sm" asChild onClick={() => setOpen(false)}>
                <Link to="/trainer/workouts/builder">{t('assignProgram.empty.cta')}</Link>
              </Button>
            }
            className="py-8"
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t('assignProgram.field.program')}</Label>
              <Select value={programId} onValueChange={setProgramId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('assignProgram.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selected ? (
                <p className="text-xs text-[var(--text-muted)]">
                  {t('assignProgram.hint', {
                    weeks: selected.weeks,
                    workouts: selected.workouts?.length ?? 0,
                  })}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assign-start-date">{t('assignProgram.field.startDate')}</Label>
              <Input
                id="assign-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <Button className="w-full touch-target" disabled={loading || !programId} onClick={onAssign}>
              {loading ? t('common:actions.assigning') : t('common:actions.assign')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
