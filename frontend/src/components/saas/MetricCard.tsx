import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type MetricCardProps = {
  label: string
  value: string
  hint?: string
  icon?: LucideIcon
  highlight?: boolean
  className?: string
}

export function MetricCard({ label, value, hint, icon: Icon, highlight, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3',
        highlight && 'border-[var(--border-strong)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" strokeWidth={1.75} /> : null}
      </div>
      <p className={cn('mt-1 font-display text-2xl font-bold tabular-nums tracking-tight', highlight && 'text-[var(--accent)]')}>
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  )
}
