import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type DashboardColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface DashboardGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function DashboardGrid({ children, className, ...props }: DashboardGridProps) {
  return (
    <div className={cn('ds-dash-grid', className)} {...props}>
      {children}
    </div>
  )
}

export interface DashboardGridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: DashboardColSpan
  children: ReactNode
}

const spanClass: Record<DashboardColSpan, string> = {
  1: 'ds-col-span-1',
  2: 'ds-col-span-2',
  3: 'ds-col-span-3',
  4: 'ds-col-span-4',
  5: 'ds-col-span-5',
  6: 'ds-col-span-6',
  7: 'ds-col-span-7',
  8: 'ds-col-span-8',
  9: 'ds-col-span-9',
  10: 'ds-col-span-10',
  11: 'ds-col-span-11',
  12: 'ds-col-span-12',
}

export function DashboardGridItem({ span = 12, children, className, ...props }: DashboardGridItemProps) {
  return (
    <div className={cn(spanClass[span], className)} {...props}>
      {children}
    </div>
  )
}
