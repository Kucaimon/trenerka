import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronLeft,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Layers,
  ExternalLink,
  GraduationCap,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  Users,
  User,
  ListTree,
  FolderOpen,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { config } from '@/lib/config'
import { useUiStore } from '@/store/ui-store'
import { useAuthStore } from '@/store/auth-store'
import { useLogout } from '@/lib/auth/logout'
import { Button } from '@/components/ui/button'
import { LogoLink } from '@/components/shared/LogoLink'
import { CommandPalette } from '@/components/layout/command-palette'
import { useClients, useTrainerAnalytics } from '@/features/api/hooks'
import {
  MobileTabBar,
  MobileBottomSheet,
  MobilePageTransition,
  type MobileTabItem,
} from '@/components/mobile'
import { useIsMobile } from '@/components/mobile/useMediaQuery'
import {
  AppShell,
  AppSidebar,
  AppSidebarGroup,
  AppTopBar,
  AppContent,
} from '@/components/saas'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  to?: string
  href?: string
  icon: LucideIcon
  label: string
  end?: boolean
  badge?: number
  external?: boolean
}

type NavGroup = {
  label: string
  items: NavItem[]
}

function useMobileBottomNav(): MobileTabItem[] {
  const { t } = useTranslation('trainer')
  return [
    { to: '/trainer', icon: LayoutDashboard, label: t('nav.dashboard'), end: true },
    { to: '/trainer/clients', icon: Users, label: t('nav.clients') },
    { to: '/trainer/messages', icon: MessageSquare, label: t('nav.chats') },
    { to: '/trainer/calendar', icon: Calendar, label: t('nav.calendar') },
  ]
}

function useSkillsNavItem(): NavItem {
  const { t } = useTranslation('common')
  return {
    href: config.skillsUrl,
    icon: GraduationCap,
    label: t('skills'),
    external: true,
  }
}

function useMobileMoreNav(): NavItem[] {
  const { t } = useTranslation('trainer')
  const skills = useSkillsNavItem()
  return [
    { to: '/trainer/workouts/builder', icon: Dumbbell, label: t('nav.builder') },
    { to: '/trainer/programs', icon: Layers, label: t('nav.programs') },
    { to: '/trainer/exercises', icon: ListTree, label: t('nav.exercises') },
    { to: '/trainer/finance', icon: CreditCard, label: t('nav.finance') },
    { to: '/trainer/analytics', icon: BarChart3, label: t('nav.analytics') },
    { to: '/trainer/settings', icon: Settings, label: t('nav.settings') },
    { to: '/trainer/profile', icon: User, label: t('profile.title') },
    { to: '/trainer/files', icon: FolderOpen, label: t('nav.files') },
    { to: '/trainer/notifications', icon: Bell, label: t('nav.notifications') },
    skills,
  ]
}

const moreRoutePrefixes = [
  '/trainer/workouts/builder',
  '/trainer/programs',
  '/trainer/exercises',
  '/trainer/finance',
  '/trainer/analytics',
  '/trainer/settings',
  '/trainer/profile',
  '/trainer/files',
  '/trainer/notifications',
]

function isMoreRouteActive(pathname: string) {
  return moreRoutePrefixes.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

function useNavGroups(): NavGroup[] {
  const { t } = useTranslation('trainer')
  const { data: clients = [] } = useClients()
  const { data: analytics } = useTrainerAnalytics()
  const skills = useSkillsNavItem()
  const activeClients = clients.filter((c) => c.status === 'active').length
  const unread = analytics?.unreadMessages ?? 0

  return [
    {
      label: t('groups.main'),
      items: [
        { to: '/trainer', icon: LayoutDashboard, label: t('nav.dashboard'), end: true },
        { to: '/trainer/clients', icon: Users, label: t('nav.clients'), badge: activeClients || clients.length },
        { to: '/trainer/messages', icon: MessageSquare, label: t('nav.chats'), badge: unread || undefined },
      ],
    },
    {
      label: t('groups.workouts'),
      items: [
        { to: '/trainer/workouts/builder', icon: Dumbbell, label: t('nav.builder') },
        { to: '/trainer/programs', icon: Layers, label: t('nav.programs') },
        { to: '/trainer/exercises', icon: ListTree, label: t('nav.exercises') },
      ],
    },
    {
      label: t('groups.business'),
      items: [
        { to: '/trainer/calendar', icon: Calendar, label: t('nav.calendar') },
        { to: '/trainer/finance', icon: CreditCard, label: t('nav.finance') },
        { to: '/trainer/analytics', icon: BarChart3, label: t('nav.analytics') },
      ],
    },
    {
      label: t('groups.other'),
      items: [
        { to: '/trainer/files', icon: FolderOpen, label: t('nav.files') },
        { to: '/trainer/notifications', icon: Bell, label: t('nav.notifications') },
        { to: '/trainer/settings', icon: Settings, label: t('nav.settings') },
        skills,
      ],
    },
  ]
}

const mobileMoreNavItemClass =
  'flex min-h-[48px] items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors'

function TrainerMobileMoreNavItem({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: () => void
}) {
  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={mobileMoreNavItemClass}
        onClick={onNavigate}
      >
        <item.icon className="h-5 w-5 shrink-0 opacity-80" strokeWidth={1.75} />
        <span className="truncate">{item.label}</span>
        <ExternalLink className="ml-auto h-4 w-4 shrink-0 opacity-50" aria-hidden />
      </a>
    )
  }

  return (
    <NavLink
      to={item.to!}
      className={({ isActive }) =>
        cn(mobileMoreNavItemClass, isActive && 'bg-[rgba(184,245,61,0.08)] text-[var(--accent)]')
      }
      onClick={onNavigate}
    >
      <item.icon className="h-5 w-5 shrink-0 opacity-80" strokeWidth={1.75} />
      <span>{item.label}</span>
    </NavLink>
  )
}

function TrainerNavItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  onNavigate?: () => void
}) {
  const className = cn(
    'snav-item touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
    collapsed && 'justify-center',
  )
  const content = (
    <>
      <item.icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
      {!collapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {item.external ? (
            <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
          ) : null}
          {!item.external && item.badge != null && item.badge > 0 ? (
            <span className="ml-auto rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-[#111]">
              {item.badge}
            </span>
          ) : null}
        </>
      )}
    </>
  )

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onNavigate}
      >
        {content}
      </a>
    )
  }

  return (
    <NavLink
      to={item.to!}
      end={item.end}
      className={({ isActive }) => cn(className, isActive && 'active')}
      onClick={onNavigate}
    >
      {content}
    </NavLink>
  )
}

export function TrainerLayout() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggle = useUiStore((s) => s.toggleSidebar)
  const setCommandOpen = useUiStore((s) => s.setCommandOpen)
  const handleLogout = useLogout('trainer')
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const { t } = useTranslation(['trainer', 'common'])
  const navGroups = useNavGroups()
  const mobileBottomNav = useMobileBottomNav()
  const mobileMoreNav = useMobileMoreNav()
  const isMobile = useIsMobile()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreActive = isMoreRouteActive(location.pathname)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandOpen])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMoreOpen(false)
  }, [location.pathname])

  return (
    <AppShell
      variant="trainer"
      mobileNav={
        isMobile ? (
          <MobileTabBar
            items={mobileBottomNav}
            variant="trainer"
            emphasizedIndex={0}
            className="z-50"
            extraTabs={[
              {
                key: 'more',
                icon: MoreHorizontal,
                label: t('nav.more'),
                active: moreActive || moreOpen,
                onClick: () => setMoreOpen(true),
              },
            ]}
          />
        ) : undefined
      }
    >
      {!isMobile ? (
        <AppSidebar
          collapsed={collapsed}
          header={
            <div
              className={cn(
                'flex items-center border-b border-[var(--border)] py-4',
                collapsed ? 'justify-center px-1' : 'px-5',
              )}
            >
              {!collapsed ? (
                <LogoLink size="md" logoClassName="max-w-[180px]" />
              ) : (
                <LogoLink size="sm" variant="icon" />
              )}
            </div>
          }
          footer={
            <>
              {!collapsed && user ? (
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#111]">
                    {user.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{user.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{t('role')}</p>
                  </div>
                </div>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 text-[var(--text-muted)]"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && t('common:actions.logout')}
              </Button>
            </>
          }
        >
          {navGroups.map((group) => (
            <AppSidebarGroup key={group.label} label={group.label} collapsed={collapsed}>
              {group.items.map((item) => (
                <TrainerNavItem
                  key={item.to ?? item.href}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </AppSidebarGroup>
          ))}
        </AppSidebar>
      ) : null}

      <div className="trainer-main ds-app-main flex min-h-0 min-w-0 w-full flex-1 flex-col">
        <AppTopBar className="px-3 md:px-8">
          {isMobile ? (
            <>
              <LogoLink size="sm" className="shrink-0" />
              <LanguageSwitcher variant="ghost" compact className="border-transparent px-2" />
            </>
          ) : null}
          {!isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={toggle}
              aria-label={collapsed ? t('expandMenu') : t('collapseMenu')}
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            className="trainer-topbar__search min-w-0 flex-1 justify-start gap-2 font-normal text-[var(--text-muted)]"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="truncate">{t('common:actions.search')}</span>
            <kbd className="ml-auto hidden rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] sm:inline">
              ⌘K
            </kbd>
          </Button>
          {!isMobile ? (
            <LanguageSwitcher variant="ghost" compact className="border-transparent px-2" />
          ) : null}
        </AppTopBar>

        <AppContent variant="trainer">
          <AnimatePresence mode="wait">
            <MobilePageTransition key={location.pathname}>
              <Outlet />
            </MobilePageTransition>
          </AnimatePresence>
        </AppContent>
      </div>

      <MobileBottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title={t('nav.sections')}>
        <nav className="grid grid-cols-2 gap-2 p-4" aria-label={t('nav.sections')}>
          {mobileMoreNav.map((item) => (
            <TrainerMobileMoreNavItem
              key={item.to ?? item.href}
              item={item}
              onNavigate={() => setMoreOpen(false)}
            />
          ))}
        </nav>
        {isMobile && user ? (
          <div className="border-t border-[var(--border)] p-4">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#111]">
                {user.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{t('role')}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                setMoreOpen(false)
                handleLogout()
              }}
            >
              <LogOut className="h-4 w-4" />
              {t('common:actions.logout')}
            </Button>
          </div>
        ) : null}
      </MobileBottomSheet>

      <CommandPalette />
    </AppShell>
  )
}
