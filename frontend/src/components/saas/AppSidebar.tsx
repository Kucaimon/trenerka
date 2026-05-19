import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AppSidebarProps {
  collapsed?: boolean
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
}

export function AppSidebar({ collapsed, header, footer, children, className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        'ds-app-sidebar trainer-sidebar trainer-sidebar--saas flex shrink-0 flex-col',
        collapsed ? 'ds-app-sidebar--collapsed w-14' : 'w-[var(--sidebar-width)]',
        className,
      )}
    >
      {header}
      <nav className="ds-app-sidebar-nav flex-1 overflow-y-auto">{children}</nav>
      {footer ? (
        <div className="trainer-sidebar-footer shrink-0 border-t border-[var(--border)] p-4">{footer}</div>
      ) : null}
    </aside>
  )
}

export interface AppSidebarGroupProps {
  label?: string
  collapsed?: boolean
  children: ReactNode
}

export function AppSidebarGroup({ label, collapsed, children }: AppSidebarGroupProps) {
  return (
    <div className="mb-2">
      {label && !collapsed ? <p className="ds-app-sidebar-group-label snav-label">{label}</p> : null}
      <div className="space-y-0.5 px-2">{children}</div>
    </div>
  )
}

export interface AppSidebarItemProps {
  active?: boolean
  className?: string
  children: ReactNode
}

export function AppSidebarItem({ active, className, children }: AppSidebarItemProps) {
  return (
    <div
      className={cn(
        'ds-app-sidebar-item snav-item touch-target',
        active && 'ds-app-sidebar-item--active active',
        className,
      )}
    >
      {children}
    </div>
  )
}
