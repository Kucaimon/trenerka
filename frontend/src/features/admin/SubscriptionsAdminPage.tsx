import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreditCard, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getPlatformPlans, savePlatformPlans } from '@/features/api/admin-service'
import type { PlatformPlan } from '@/types'

export function SubscriptionsAdminPage() {
  const { t } = useTranslation(['admin', 'common'])
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'platform-plans'], queryFn: getPlatformPlans })
  const [localPlans, setLocalPlans] = useState<PlatformPlan[] | null>(null)
  const plans = localPlans ?? data?.plans ?? []

  const saveMutation = useMutation({
    mutationFn: () => savePlatformPlans(plans),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'platform-plans'] })
      toast.success(t('subscriptions.saved'))
    },
    onError: () => toast.error(t('common:saveError')),
  })

  const addPlan = () => {
    setLocalPlans((prev) => [
      ...(prev ?? data?.plans ?? []),
      { id: `plan-${Date.now()}`, name: '', priceRub: 0, clientLimit: 20, active: true },
    ])
  }

  const updatePlan = (id: string, patch: Partial<PlatformPlan>) => {
    setLocalPlans((prev) => (prev ?? data?.plans ?? []).map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const removePlan = (id: string) => {
    setLocalPlans((prev) => (prev ?? data?.plans ?? []).filter((p) => p.id !== id))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4" />
            {t('subscriptions.back')}
          </Link>
        </Button>
      </div>

      <div>
        <Badge variant="accent" className="mb-3">
          {t('subscriptions.stageBadge')}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">{t('subscriptions.title')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{t('subscriptions.description')}</p>
        {data?.billingNote ? (
          <p className="mt-2 rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-xs text-[var(--text-muted)]">
            {data.billingNote}
          </p>
        ) : null}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-[var(--accent)]" />
            {t('subscriptions.plansTitle')}
          </CardTitle>
          <Button type="button" size="sm" variant="secondary" onClick={addPlan}>
            <Plus className="h-4 w-4" /> {t('subscriptions.addPlan')}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-4 sm:grid-cols-2"
              >
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t('subscriptions.field.name')}</Label>
                  <Input value={plan.name} onChange={(e) => updatePlan(plan.id, { name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('subscriptions.field.price')}</Label>
                  <Input
                    type="number"
                    value={plan.priceRub}
                    onChange={(e) => updatePlan(plan.id, { priceRub: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('subscriptions.field.limit')}</Label>
                  <Input
                    type="number"
                    value={plan.clientLimit}
                    onChange={(e) => updatePlan(plan.id, { clientLimit: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center justify-between sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={plan.active}
                      className="h-4 w-4 accent-[var(--accent)]"
                      onChange={(e) => updatePlan(plan.id, { active: e.target.checked })}
                    />
                    <span className="text-sm">{t('subscriptions.field.active')}</span>
                  </label>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePlan(plan.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
          <Button type="button" disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
            {saveMutation.isPending ? t('common:actions.loading') : t('common:actions.save')}
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs text-[var(--text-muted)]">{t('subscriptions.footer')}</p>
    </div>
  )
}
