import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type AppShellVariant = 'trainer' | 'client' | 'default'

export interface AppShellProps {
  variant?: AppShellVariant
  className?: string
  rootClassName?: string
  children: ReactNode
  /** Bottom tab bar or mobile nav — rendered outside main flex row */
  mobileNav?: ReactNode
}

export function AppShell({
  variant = 'default',
  className,
  rootClassName,
  children,
  mobileNav,
}: AppShellProps) {
  const isTrainer = variant === 'trainer'

  return (
    <div className={cn('trainer-layout-root min-h-dvh w-full overflow-x-hidden bg-[var(--black)]', rootClassName)}>
      <div
        className={cn(
          'ds-app-shell',
          isTrainer && 'app-shell app-shell--trainer min-h-dvh w-full',
          variant === 'client' && 'app-shell app-shell--client',
          !isTrainer && variant !== 'client' && 'ds-app-shell--row',
          isTrainer && 'flex-col md:flex-row',
          className,
        )}
      >
        {children}
      </div>
      {mobileNav}
    </div>
  )
}
