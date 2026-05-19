import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DashboardContainerProps {
  title?: string
  description?: string
  header?: ReactNode
  actions?: ReactNode
  children: ReactNode
  flush?: boolean
  className?: string
}

export function DashboardContainer({
  title,
  description,
  header,
  actions,
  children,
  flush,
  className,
}: DashboardContainerProps) {
  const hasHeader = header || title || actions

  return (
    <section className={cn('ds-panel ds-shadow-panel', className)}>
      {hasHeader ? (
        <header className="saas-panel__header flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          {header ?? (
            <div>
              {title ? <h3 className="saas-panel__title">{title}</h3> : null}
              {description ? <p className="saas-panel__sub">{description}</p> : null}
            </div>
          )}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={cn('saas-panel__body', flush && 'saas-panel__body--flush p-0')}>{children}</div>
    </section>
  )
}
