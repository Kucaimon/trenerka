import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type MobileBottomSheetProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function MobileBottomSheet({ open, onClose, title, children, className }: MobileBottomSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="bottom-sheet-backdrop"
            aria-label="Закрыть"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            className={cn('bottom-sheet', className)}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="bottom-sheet-handle" aria-hidden />
            {title != null && (
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-3">
                {title ? <p className="text-sm font-semibold">{title}</p> : <span />}
                <button
                  type="button"
                  className="touch-target flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-white/5"
                  aria-label="Закрыть"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="bottom-sheet-body">{children}</div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
