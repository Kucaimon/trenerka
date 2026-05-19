import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Bell,
  Bot,
  Calendar,
  ChevronLeft,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  Users,
  ListTree,
  FolderOpen,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { MobileLanguageList } from '@/components/shared/MobileLanguageList'
import { useUiStore } from '@/store/ui-store'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { LogoLink } from '@/components/shared/LogoLink'
import { CommandPalette } from '@/components/layout/command-palette'
import { SkillsButton } from '@/components/shared/SkillsButton'
import { useClients, useTrainerAnalytics } from '@/features/api/hooks'
import {
  MobileTabBar,
  MobileBottomSheet,
  MobilePageTransition,
  type MobileTabItem,
} from '@/components/mobile'
import { useIsMobile } from '@/components/mobile/useMediaQuery'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  to: string
  icon: LucideIcon
  label: string
  end?: boolean
  badge?: number
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

function useMobileMoreNav(): NavItem[] {
  const { t } = useTranslation('trainer')
  return [
    { to: '/trainer/workouts/builder', icon: Dumbbell, label: t('nav.builder') },
    { to: '/trainer/programs', icon: Layers, label: t('nav.programs') },
    { to: '/trainer/exercises', icon: ListTree, label: t('nav.exercises') },
    { to: '/trainer/finance', icon: CreditCard, label: t('nav.finance') },
    { to: '/trainer/analytics', icon: BarChart3, label: t('nav.analytics') },
    { to: '/trainer/settings', icon: Settings, label: t('nav.settings') },
    { to: '/trainer/ai-coach', icon: Bot, label: t('nav.aiCoach') },
    { to: '/trainer/files', icon: FolderOpen, label: t('nav.files') },
    { to: '/trainer/notifications', icon: Bell, label: t('nav.notifications') },
  ]
}

const moreRoutePrefixes = [
  '/trainer/workouts/builder',
  '/trainer/programs',
  '/trainer/exercises',
  '/trainer/finance',
  '/trainer/analytics',
  '/trainer/settings',
  '/trainer/ai-coach',
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
        { to: '/trainer/ai-coach', icon: Bot, label: t('nav.aiCoach') },
        { to: '/trainer/files', icon: FolderOpen, label: t('nav.files') },
        { to: '/trainer/notifications', icon: Bell, label: t('nav.notifications') },
        { to: '/trainer/settings', icon: Settings, label: t('nav.settings') },
      ],
    },
  ]
}

function MoreMenuSkills() {
  return (
    <div className="col-span-2 border-t border-[var(--border)] pt-3">
      <SkillsButton fullWidth />
    </div>
  )
}

export function TrainerLayout() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggle = useUiStore((s) => s.toggleSidebar)
  const setCommandOpen = useUiStore((s) => s.setCommandOpen)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
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
    <div className="trainer-layout-root min-h-dvh w-full overflow-x-hidden bg-[var(--black)]">
      <div className="app-shell app-shell--trainer flex min-h-dvh w-full">
        {!isMobile ? (
        <aside
          className={cn(
            'trainer-sidebar flex shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]',
            collapsed ? 'w-14' : 'w-[var(--sidebar-width)]',
          )}
        >
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

          <nav className="flex-1 overflow-y-auto py-3">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-2">
                {!collapsed && (
                  <p className="px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5 px-2">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => cn('snav-item touch-target', isActive && 'active')}
                    >
                      <item.icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
                      {!collapsed && (
                        <>
                          <span className="truncate">{item.label}</span>
                          {item.badge != null && item.badge > 0 && (
                            <span className="ml-auto rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-[#111]">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="trainer-sidebar-footer border-t border-[var(--border)] p-4">
            <div className={cn('mb-3', collapsed && 'flex justify-center')}>
              <LanguageSwitcher showLabel={!collapsed} className={cn(!collapsed && 'w-full justify-start')} />
            </div>
            {!collapsed && user && (
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#111]">
                  {user.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{user.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{t('role')}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-[var(--text-muted)]"
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && t('common:actions.logout')}
            </Button>
          </div>
        </aside>
        ) : null}

        <div className="trainer-main flex min-h-0 min-w-0 w-full flex-1 flex-col">
          <header className="trainer-mobile-header sticky top-0 z-30 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[rgba(8,8,8,0.85)] px-3 backdrop-blur-xl md:gap-3 md:px-8">
            {isMobile ? (
              <LogoLink size="sm" className="shrink-0" />
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
              className="min-w-0 flex-1 justify-start gap-2 font-normal text-[var(--text-muted)]"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">{t('common:actions.search')}</span>
              <kbd className="ml-auto hidden rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] sm:inline">
                ⌘K
              </kbd>
            </Button>
            {!isMobile ? <LanguageSwitcher compact /> : null}
          </header>
          <main className="app-content trainer-main-content flex-1 md:!px-8 md:!py-7 md:!pb-7">
            <AnimatePresence mode="wait">
              <MobilePageTransition key={location.pathname}>
                <Outlet />
              </MobilePageTransition>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {isMobile ? (
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
      ) : null}

      <MobileBottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title={t('nav.sections')}>
        <nav className="grid grid-cols-2 gap-2 p-4">
          {mobileMoreNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[48px] items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors',
                  isActive && 'bg-[rgba(184,245,61,0.08)] text-[var(--accent)]',
                )
              }
              onClick={() => setMoreOpen(false)}
            >
              <item.icon className="h-5 w-5 shrink-0 opacity-80" strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <MoreMenuSkills />
          <div className="col-span-2 border-t border-[var(--border)] pt-3">
            <MobileLanguageList onSelect={() => setMoreOpen(false)} />
          </div>
        </nav>
      </MobileBottomSheet>

      <CommandPalette />
      <Link
        to="/trainer/ai-coach"
        className="trainer-fab fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-glow)] transition-transform hover:scale-105 max-md:bottom-[calc(var(--tab-bar-height)+var(--safe-area-bottom)+12px)]"
        title={t('nav.aiCoach')}
      >
        <Bot className="h-5 w-5" />
      </Link>
    </div>
  )
}
