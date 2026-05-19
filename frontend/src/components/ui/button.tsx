import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent2)]',
        secondary:
          'border border-[var(--border-strong)] bg-[var(--surface2)] text-[var(--text-primary)] hover:bg-[var(--surface3)]',
        outline:
          'border border-[var(--border-strong)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface2)] hover:text-[var(--text-primary)]',
        ghost: 'text-[var(--text-secondary)] hover:bg-[var(--surface2)] hover:text-[var(--text-primary)]',
        destructive: 'bg-[var(--danger)]/90 text-white hover:bg-[var(--danger)]',
        link: 'text-[var(--accent)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-[var(--radius-sm)] px-3 text-xs',
        lg: 'h-10 px-6 text-[15px] font-semibold',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
