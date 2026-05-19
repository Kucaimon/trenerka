import { cn } from '@/lib/utils'

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]', className)}>
      <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}
