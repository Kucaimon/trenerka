import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
  {
    variants: {
      variant: {
        default: 'border-[var(--border)] bg-[var(--surface2)] text-[var(--text-secondary)]',
        accent: 'border-[rgba(184,245,61,0.2)] bg-[var(--accent-dim)] text-[var(--accent)]',
        secondary: 'border-[var(--border)] bg-[var(--surface3)] text-[var(--text-secondary)]',
        success: 'border-[rgba(184,245,61,0.2)] bg-[var(--accent-dim)] text-[var(--accent)]',
        warning: 'border-[rgba(255,140,66,0.2)] bg-[rgba(255,140,66,0.1)] text-[var(--warning)]',
        destructive: 'border-[rgba(255,77,77,0.2)] bg-[rgba(255,77,77,0.1)] text-[var(--danger)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
