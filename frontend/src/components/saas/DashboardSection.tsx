import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SectionHeader } from './SectionHeader'

export type DashboardSectionProps = {
  title: string
  description?: string
  actions?: ReactNode
  flush?: boolean
  children: ReactNode
  className?: string
}

export function DashboardSection({ title, description, actions, flush, children, className }: DashboardSectionProps) {
  return (
    <section className={cn('rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]', className)}>
      <SectionHeader title={title} description={description} actions={actions} className="px-4 py-3" />
      <div className={cn(!flush && 'px-4 pb-4')}>{children}</div>
    </section>
  )
}
