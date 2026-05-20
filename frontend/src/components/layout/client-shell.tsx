import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Dumbbell, TrendingUp, MessageCircle, User } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import {
  MobileTabBar,
  MobilePageTransition,
  type MobileTabItem,
} from '@/components/mobile'
import { useIsMobile } from '@/components/mobile/useMediaQuery'
import { LogoLink } from '@/components/shared/LogoLink'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { AppShell, AppSidebar, AppTopBar, AppContent } from '@/components/saas'
import { useAuthStore } from '@/store/auth-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const hideTabBarPaths = ['/client/workouts/']

function isClientHome(pathname: string) {
  return pathname === '/client' || pathname === '/client/'
}

function useClientNav(): MobileTabItem[] {
  const { t } = useTranslation('client')
  return [
    { to: '/client', icon: Home, label: t('nav.today'), end: true },
    { to: '/client/progress', icon: TrendingUp, label: t('nav.progress') },
    { to: '/client/workouts', icon: Dumbbell, label: t('nav.workouts') },
    { to: '/client/chat', icon: MessageCircle, label: t('nav.chat') },
    { to: '/client/profile', icon: User, label: t('nav.profile') },
  ]
}

function ClientNavItem({
  item,
}: {
  item: MobileTabItem
}) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'snav-item touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
          isActive && 'active',
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

export function ClientShell() {
  const { t } = useTranslation('client')
  const nav = useClientNav()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const isMobile = useIsMobile()
  const isSession = hideTabBarPaths.some((p) => location.pathname.startsWith(p))
  const isHome = isClientHome(location.pathname)
  const userInitial = (user?.name ?? '?').slice(0, 1).toUpperCase()

  const mobileHeader = (
    <header
      className={
        isHome
          ? 'relative z-10 flex shrink-0 items-center justify-end px-4 pb-1 pt-3'
          : 'relative z-10 flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/85 px-5 py-3 backdrop-blur-xl'
      }
    >
      {!isHome ? (
        <div>
          <LogoLink size="sm" />
          <p className="text-xs text-[var(--text-muted)]">{t('cabinet')}</p>
        </div>
      ) : null}
      <LanguageSwitcher compact={isHome} />
    </header>
  )

  const mainContent = (
    <main
      className={
        isSession
          ? 'app-content app-content--no-tab relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto !p-0'
          : 'app-content relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto'
      }
    >
      <AnimatePresence mode="wait">
        <MobilePageTransition key={location.pathname}>
          <Outlet />
        </MobilePageTransition>
      </AnimatePresence>
    </main>
  )

  if (isMobile) {
    return (
      <div className="client-layout-root flex min-h-dvh justify-center overflow-x-hidden bg-[var(--bg-base)]">
        <div className="app-shell app-shell--client app-shell--bleed relative w-full">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(184,245,61,0.08),transparent_18rem)]" />
          {mobileHeader}
          {mainContent}
          {!isSession ? <MobileTabBar items={nav} variant="client" emphasizedIndex={2} /> : null}
        </div>
      </div>
    )
  }

  const desktopTopBar = (
    <AppTopBar className="client-topbar w-full border-b border-[var(--border)] bg-[var(--surface)]/85 px-6 py-3 backdrop-blur-xl md:px-8">
      <p className="text-sm font-medium text-[var(--text-primary)]">{t('cabinet')}</p>
      <div className="ml-auto flex items-center gap-3">
        <LanguageSwitcher compact />
        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden max-w-[180px] truncate text-sm font-medium lg:inline">
              {user.name}
            </span>
            <Avatar className="h-8 w-8 border border-[var(--border)]">
              <AvatarFallback className="bg-[var(--accent)] text-xs font-bold text-[#111]">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : null}
      </div>
    </AppTopBar>
  )

  return (
    <AppShell
      variant="client"
      rootClassName="client-layout-root bg-[var(--bg-base)]"
      mobileNav={
        isMobile && !isSession ? (
          <MobileTabBar items={nav} variant="client" emphasizedIndex={2} />
        ) : undefined
      }
    >
      <AppSidebar
        className="client-sidebar trainer-sidebar--saas hidden md:flex"
        header={
          <div className="flex items-center border-b border-[var(--border)] px-5 py-4">
            <LogoLink size="md" logoClassName="max-w-[160px]" />
          </div>
        }
        footer={
          user ? (
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border border-[var(--border)]">
                <AvatarFallback className="bg-[var(--accent)] text-xs font-bold text-[#111]">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{user.name}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{t('cabinet')}</p>
              </div>
            </div>
          ) : null
        }
      >
        <div className="space-y-0.5 px-2 py-2">
          {nav.map((item) => (
            <ClientNavItem key={item.to} item={item} />
          ))}
        </div>
      </AppSidebar>

      <div className="client-main ds-app-main flex min-h-0 min-w-0 w-full flex-1 flex-col">
        {desktopTopBar}

        <AppContent
          variant="client"
          flush={isSession}
          className={cn(isSession && 'app-content--no-tab !p-0')}
        >
          <AnimatePresence mode="wait">
            <MobilePageTransition key={location.pathname}>
              <Outlet />
            </MobilePageTransition>
          </AnimatePresence>
        </AppContent>
      </div>
    </AppShell>
  )
}
