import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type MobileHeaderProps = {
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  onBack?: () => void
  trailing?: ReactNode
  className?: string
  large?: boolean
}

export function MobileHeader({
  title,
  subtitle,
  backTo,
  backLabel = 'Назад',
  onBack,
  trailing,
  className,
  large = true,
}: MobileHeaderProps) {
  const showBack = Boolean(backTo || onBack)

  return (
    <header
      className={cn(
        'sticky top-0 z-20 shrink-0 border-b border-[var(--border)] bg-[rgba(8,8,8,0.82)] px-4 backdrop-blur-xl',
        large ? 'py-3.5' : 'py-2.5',
        className,
      )}
      style={{ paddingTop: `max(12px, var(--safe-area-top))` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {showBack ? (
            backTo ? (
              <Link
                to={backTo}
                className="mb-2 inline-flex min-h-[44px] items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ChevronLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onBack}
                className="mb-2 inline-flex min-h-[44px] items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ChevronLeft className="h-4 w-4" />
                {backLabel}
              </button>
            )
          ) : null}
          <h1
            className={cn(
              'font-display font-extrabold tracking-tight text-[var(--text-primary)]',
              large ? 'text-2xl' : 'text-lg',
            )}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{subtitle}</p>
          ) : null}
        </div>
        {trailing ? <div className="shrink-0 pt-1">{trailing}</div> : null}
      </div>
    </header>
  )
}
