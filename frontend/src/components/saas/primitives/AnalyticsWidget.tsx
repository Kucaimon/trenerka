import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { DashboardContainer } from './DashboardContainer'

export interface AnalyticsWidgetProps {
  title: string
  description?: string
  actions?: ReactNode
  height?: number | string
  children: ReactNode
  className?: string
}

export function AnalyticsWidget({
  title,
  description,
  actions,
  height = 280,
  children,
  className,
}: AnalyticsWidgetProps) {
  return (
    <DashboardContainer
      title={title}
      description={description}
      actions={actions}
      flush
      className={cn('overflow-hidden', className)}
    >
      <div className="w-full px-2 py-3" style={{ minHeight: typeof height === 'number' ? `${height}px` : height }}>
        {children}
      </div>
    </DashboardContainer>
  )
}
