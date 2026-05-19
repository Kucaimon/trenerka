import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AppTopBarProps {
  title?: ReactNode
  search?: ReactNode
  actions?: ReactNode
  className?: string
  children?: ReactNode
}

export function AppTopBar({ title, search, actions, className, children }: AppTopBarProps) {
  return (
    <header className={cn('ds-app-topbar trainer-topbar trainer-mobile-header sticky top-0 z-30 shrink-0', className)}>
      {title}
      {search}
      {actions}
      {children}
    </header>
  )
}
