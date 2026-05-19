import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export interface SaasPageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

export function SaasPageHeader({ title, description, actions, breadcrumbs, className }: SaasPageHeaderProps) {
  return (
    <div className={cn('saas-page-header', className)}>
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-[12px] text-[var(--text-muted)]">
            {breadcrumbs.map((item, i) => (
              <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1">
                {i > 0 ? <ChevronRight className="h-3 w-3 opacity-50" aria-hidden /> : null}
                {item.href ? (
                  <Link to={item.href} className="ds-interactive rounded px-0.5 hover:text-[var(--text-primary)]">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[var(--text-secondary)]">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="saas-page-header__title ds-h1">{title}</h1>
        {description ? <p className="saas-page-header__sub">{description}</p> : null}
      </div>
      {actions ? <div className="saas-page-header__actions">{actions}</div> : null}
    </div>
  )
}
