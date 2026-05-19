import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type MobileCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  variant?: 'default' | 'glass'
  padding?: 'default' | 'none'
}

export function MobileCard({
  children,
  className,
  variant = 'default',
  padding = 'default',
  ...props
}: MobileCardProps) {
  return (
    <div
      className={cn(
        'mobile-card',
        variant === 'glass' && 'mobile-card--glass',
        padding === 'none' && 'p-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
