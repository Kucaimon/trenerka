import * as React from 'react'
import { Drawer } from 'vaul'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Sheet = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof Drawer.Root>) => (
  <Drawer.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Sheet.displayName = 'Sheet'

const SheetTrigger = Drawer.Trigger
const SheetPortal = Drawer.Portal
const SheetClose = Drawer.Close

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Drawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof Drawer.Overlay>
>(({ className, ...props }, ref) => (
  <Drawer.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/70 backdrop-blur-sm', className)}
    {...props}
  />
))
SheetOverlay.displayName = Drawer.Overlay.displayName

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof Drawer.Content> {
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const sheetSideClasses: Record<NonNullable<SheetContentProps['side']>, string> = {
  top: 'inset-x-0 top-0 border-b rounded-b-[var(--radius-lg)]',
  bottom: 'inset-x-0 bottom-0 border-t rounded-t-[var(--radius-lg)]',
  left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
  right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l',
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Drawer.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Drawer.Content
      ref={ref}
      className={cn(
        'fixed z-50 flex flex-col border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg outline-none duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        sheetSideClasses[side],
        className,
      )}
      {...props}
    >
      {children}
      <Drawer.Close className="absolute right-4 top-4 rounded-[var(--radius-sm)] opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Drawer.Close>
    </Drawer.Content>
  </SheetPortal>
))
SheetContent.displayName = Drawer.Content.displayName

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 text-left', className)} {...props} />
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Drawer.Title className={cn('ds-h3', className)} {...props} />
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <Drawer.Description className={cn('ds-caption', className)} {...props} />
}

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
