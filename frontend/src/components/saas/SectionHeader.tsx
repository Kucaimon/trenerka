import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function SectionHeader({ title, description, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-4', className)}>
      <div>
        <h2 className="ds-h3">{title}</h2>
        {description ? <p className="ds-caption mt-1">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
