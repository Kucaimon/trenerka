import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  highlight,
  className,
}: {
  label: string
  value: string
  hint?: string
  icon?: LucideIcon
  highlight?: boolean
  className?: string
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="relative p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--text-muted)]">{label}</p>
            <p
              className={cn(
                'font-display mt-2 tabular-nums text-[26px] font-extrabold tracking-tight',
                highlight ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]',
              )}
            >
              {value}
            </p>
            {hint && <p className="mt-1 text-[11px] text-[var(--accent)]">{hint}</p>}
          </div>
          {Icon && (
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface3)] p-2">
              <Icon className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
