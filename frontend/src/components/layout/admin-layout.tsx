import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, Users, Newspaper, LogOut, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { useUiStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'

const nav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Дашборд', end: true },
  { to: '/admin/exercises', icon: Dumbbell, label: 'Упражнения' },
  { to: '/admin/users', icon: Users, label: 'Пользователи' },
  { to: '/admin/news', icon: Newspaper, label: 'Новости' },
]

export function AdminLayout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()
  const drawerOpen = useUiStore((s) => s.trainerDrawerOpen)
  const setDrawerOpen = useUiStore((s) => s.setTrainerDrawerOpen)

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname, setDrawerOpen])

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      {drawerOpen ? (
        <button
          type="button"
          className="trainer-drawer-backdrop md:hidden"
          aria-label="Закрыть меню"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          'trainer-drawer fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] md:static',
          drawerOpen && 'trainer-drawer--open',
        )}
      >
        <div className="flex h-14 items-center border-b border-[var(--border)] px-4">
          <span className="text-sm font-semibold">Admin</span>
        </div>
        <nav className="space-y-0.5 p-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'touch-target flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive ? 'nav-active' : 'text-[var(--text-secondary)] hover:bg-white/[0.03]',
                )
              }
              onClick={() => setDrawerOpen(false)}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-[var(--border)] p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Выйти
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-[var(--border)] px-4 md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="touch-target"
            aria-label="Открыть меню"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">Admin</span>
        </header>
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
