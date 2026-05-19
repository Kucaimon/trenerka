import { Outlet, useLocation } from 'react-router-dom'
import { Home, Dumbbell, TrendingUp, MessageCircle, User } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import {
  MobileTabBar,
  MobilePageTransition,
  type MobileTabItem,
} from '@/components/mobile'
import { Logo } from '@/components/shared/Logo'

const nav: MobileTabItem[] = [
  { to: '/client', icon: Home, label: 'Сегодня', end: true },
  { to: '/client/progress', icon: TrendingUp, label: 'Прогресс' },
  { to: '/client/workouts', icon: Dumbbell, label: 'Тренировки' },
  { to: '/client/chat', icon: MessageCircle, label: 'Чат' },
  { to: '/client/profile', icon: User, label: 'Профиль' },
]

const hideTabBarPaths = ['/client/workouts/session']

function isClientHome(pathname: string) {
  return pathname === '/client' || pathname === '/client/'
}

export function ClientShell() {
  const location = useLocation()
  const isSession = hideTabBarPaths.some((p) => location.pathname.startsWith(p))
  const isHome = isClientHome(location.pathname)

  return (
    <div className="flex min-h-dvh justify-center overflow-x-hidden bg-[var(--bg-base)] sm:items-center sm:p-4">
      <div className="app-shell app-shell--client app-shell--bleed relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(184,245,61,0.08),transparent_18rem)]" />
        {!isHome ? (
          <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/85 px-5 py-3 backdrop-blur-xl">
            <div>
              <Logo size="sm" />
              <p className="text-xs text-[var(--text-muted)]">личный кабинет</p>
            </div>
          </header>
        ) : null}
        <main
          className={
            isSession
              ? 'app-content app-content--no-tab relative z-10 !p-0'
              : 'app-content relative z-10'
          }
        >
          <AnimatePresence mode="wait">
            <MobilePageTransition key={location.pathname}>
              <Outlet />
            </MobilePageTransition>
          </AnimatePresence>
        </main>
        {!isSession ? <MobileTabBar items={nav} variant="client" emphasizedIndex={2} /> : null}
      </div>
    </div>
  )
}
