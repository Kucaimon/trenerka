import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Client, ClientStatus } from '@/types'

export type ClientFormValues = {
  name: string
  email: string
  phone: string
  status: ClientStatus
  goal?: string
  notes?: string
  packageBalance: number
}

export function ClientFormDialog({
  open,
  onOpenChange,
  title,
  initial,
  onSubmit,
  loading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  initial?: Partial<Client>
  onSubmit: (data: ClientFormValues) => void | Promise<void>
  loading?: boolean
}) {
  const { t } = useTranslation(['trainer', 'common'])

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('common:validation.nameMin2')),
        email: z.string().email(),
        phone: z.string().min(5),
        status: z.enum(['active', 'pause', 'archive']),
        goal: z.string().optional(),
        notes: z.string().optional(),
        packageBalance: z.number().min(0),
      }),
    [t],
  )

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'active',
      goal: '',
      notes: '',
      packageBalance: 0,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? '',
        email: initial?.email ?? '',
        phone: initial?.phone ?? '',
        status: (initial?.status as ClientStatus) ?? 'active',
        goal: initial?.goal ?? '',
        notes: initial?.notes ?? '',
        packageBalance: initial?.packageBalance ?? 0,
      })
    }
  }, [open, initial, reset])

  // react-hook-form watch() is incompatible with React Compiler memoization
  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch
  const status = watch('status')
  const statuses: ClientStatus[] = ['active', 'pause', 'archive']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t('clientForm.fields.name')}</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" {...register('email')} disabled={Boolean(initial?.id)} />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t('clientForm.fields.phone')}</Label>
              <Input {...register('phone')} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t('clientForm.fields.status')}</Label>
              <Select value={status} onValueChange={(v) => setValue('status', v as ClientStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`common:status.${s}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {status === 'archive' ? (
                <p className="text-xs text-[var(--text-muted)]">{t('clients.archiveEqualsDelete')}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label>{t('clientForm.fields.packageBalance')}</Label>
              <Input type="number" {...register('packageBalance', { valueAsNumber: true })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t('clientForm.fields.goal')}</Label>
            <Input {...register('goal')} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('clientForm.fields.notes')}</Label>
            <Textarea rows={3} {...register('notes')} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('common:actions.saving') : t('common:actions.save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
