import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface2)] px-6 py-12 text-center',
        className,
      )}
    >
      {Icon ? (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface3)] text-[var(--text-muted)]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      ) : null}
      <h3 className="ds-h3">{title}</h3>
      {description ? <p className="ds-caption mt-2 max-w-sm">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
