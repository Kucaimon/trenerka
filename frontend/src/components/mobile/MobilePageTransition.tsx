import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

const pageTransition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }

type MobilePageTransitionProps = {
  children: ReactNode
  className?: string
}

export function MobilePageTransition({ children, className }: MobilePageTransitionProps) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

type MobileListStaggerProps = {
  children: ReactNode
  className?: string
}

export function MobileListStagger({ children, className }: MobileListStaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function MobileListItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
      }}
    >
      {children}
    </motion.div>
  )
}
