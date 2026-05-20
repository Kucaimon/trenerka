import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AppContentProps {
  children: ReactNode
  className?: string
  flush?: boolean
  variant?: 'trainer' | 'client' | 'default'
}

export function AppContent({ children, className, flush, variant = 'default' }: AppContentProps) {
  return (
    <main
      className={cn(
        'ds-app-content app-content trainer-main-content flex min-h-0 flex-1 flex-col overflow-y-auto',
        variant === 'trainer' && 'ds-app-content--trainer md:!px-8 md:!py-7 md:!pb-7',
        variant === 'client' && 'client-main-content md:!px-8 md:!py-7 md:!pb-7',
        flush && 'app-content--flush !p-0',
        className,
      )}
    >
      {children}
    </main>
  )
}
