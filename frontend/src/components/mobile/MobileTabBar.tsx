import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type MobileTabItem = {
  to: string
  icon: LucideIcon
  label: string
  end?: boolean
}

type MobileTabBarProps = {
  items: MobileTabItem[]
  className?: string
  variant?: 'client' | 'trainer'
  /** Index of the center emphasized tab (primary action) */
  emphasizedIndex?: number
  /** Custom active check (e.g. "More" menu) */
  extraTabs?: Array<{
    key: string
    icon: LucideIcon
    label: string
    active?: boolean
    onClick: () => void
  }>
}

function isTabActive(pathname: string, to: string, end?: boolean) {
  if (end) return pathname === to || pathname === `${to}/`
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function MobileTabBar({
  items,
  className,
  variant = 'client',
  emphasizedIndex,
  extraTabs,
}: MobileTabBarProps) {
  const location = useLocation()
  const cols = items.length + (extraTabs?.length ?? 0)
  const centerIndex = emphasizedIndex ?? Math.floor(items.length / 2)

  function renderTabLink(item: MobileTabItem, index: number) {
    const active = isTabActive(location.pathname, item.to, item.end)
    const isCenter = index === centerIndex

    if (isCenter) {
      return (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className="app-tab-bar__center flex flex-col items-center justify-end gap-0.5 pb-0.5"
        >
          <motion.span
            animate={{ scale: active ? 1.06 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={cn(
              'app-tab-bar__center-btn flex items-center justify-center',
              active && 'app-tab-bar__center-btn--active',
            )}
          >
            <item.icon className="h-6 w-6 text-[var(--accent)]" strokeWidth={2.25} />
          </motion.span>
          <span
            className={cn(
              'max-w-full truncate text-[10px] font-semibold',
              active ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]',
            )}
          >
            {item.label}
          </span>
        </NavLink>
      )
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={cn(
          'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition-colors',
          active ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]',
        )}
      >
        <motion.span
          animate={{ scale: active ? 1.08 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="flex items-center justify-center"
        >
          <item.icon
            className={cn('h-5 w-5', active && 'text-[var(--accent)]')}
            strokeWidth={active ? 2.25 : 1.75}
          />
        </motion.span>
        <span className="max-w-full truncate">{item.label}</span>
      </NavLink>
    )
  }

  return (
    <div
      className={cn(
        'app-tab-bar-wrap md:hidden',
        variant === 'trainer' && 'app-tab-bar-wrap--trainer',
        className,
      )}
    >
      <nav
        className={cn('app-tab-bar pill-tab-bar grid gap-0.5')}
        aria-label="Основная навигация"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => renderTabLink(item, index))}
        {extraTabs?.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={tab.onClick}
            className={cn(
              'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition-colors',
              tab.active ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]',
            )}
          >
            <motion.span
              animate={{ scale: tab.active ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="flex items-center justify-center"
            >
              <tab.icon
                className={cn('h-5 w-5', tab.active && 'text-[var(--accent)]')}
                strokeWidth={tab.active ? 2.25 : 1.75}
              />
            </motion.span>
            <span className="max-w-full truncate">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
