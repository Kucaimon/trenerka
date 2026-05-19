import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AppMobileNavProps {
  children: ReactNode
  className?: string
}

/** Wrapper for bottom tab bar or drawer trigger integration */
export function AppMobileNav({ children, className }: AppMobileNavProps) {
  return <div className={cn('app-tab-bar-wrap app-tab-bar-wrap--trainer', className)}>{children}</div>
}
