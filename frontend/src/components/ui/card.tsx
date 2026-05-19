import * as React from 'react'
import { cn } from '@/lib/utils'

/** Card primitives — surface2 panel, 10px radius, bordered sections */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-[10px] border border-[var(--border)]',
        'bg-[var(--surface2)] text-[var(--text-primary)] shadow-none',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1 border-b border-[var(--border)] px-4 pb-2 pt-4 md:px-5 md:pt-5', className)} {...props} />
)

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-sm font-semibold leading-none text-[var(--text-primary)]', className)} {...props} />
)

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-[var(--text-secondary)]', className)} {...props} />
)

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-4 md:p-5', className)} {...props} />
)

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center border-t border-[var(--border)] px-4 py-3 md:px-5 md:py-4', className)} {...props} />
)

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
