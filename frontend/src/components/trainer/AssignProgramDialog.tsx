import { useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assignProgram } from '@/features/api/programs-service'
import { usePrograms } from '@/features/api/hooks'

export function AssignProgramDialog({ clientId, trigger }: { clientId: string; trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [programId, setProgramId] = useState('')
  const [loading, setLoading] = useState(false)
  const { data: programs = [] } = usePrograms()
  const qc = useQueryClient()

  const onAssign = async () => {
    if (!programId) return
    setLoading(true)
    try {
      await assignProgram(clientId, programId, new Date().toISOString().slice(0, 10))
      await qc.invalidateQueries({ queryKey: ['client-program', clientId] })
      toast.success('Программа назначена')
      setOpen(false)
    } catch {
      toast.error('Не удалось назначить программу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Назначить программу</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Программа</Label>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите программу" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" disabled={loading || !programId} onClick={onAssign}>
            {loading ? 'Назначение…' : 'Назначить'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
