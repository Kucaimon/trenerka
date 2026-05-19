import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Logo } from '@/components/shared/Logo'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center">
          <Logo size="lg" />
        </Link>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Card className="overflow-hidden">
            <Outlet />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
