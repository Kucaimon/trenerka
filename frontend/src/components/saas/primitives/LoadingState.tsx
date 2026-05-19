import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export interface LoadingStateProps {
  label?: string
  variant?: 'spinner' | 'skeleton'
  rows?: number
  className?: string
}

export function LoadingState({ label, variant = 'spinner', rows = 3, className }: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cn('ds-stack-12', className)} aria-busy="true" aria-label={label}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-[var(--text-muted)]', className)} aria-busy="true">
      <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
      {label ? <p className="ds-caption">{label}</p> : null}
    </div>
  )
}
