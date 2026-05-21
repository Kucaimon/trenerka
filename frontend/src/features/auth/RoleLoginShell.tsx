import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dumbbell, Shield, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LogoLink } from '@/components/shared/LogoLink'
import { cn } from '@/lib/utils'
import type { LoginEntry } from '@/lib/auth/role-session'

const ENTRY_META: Record<
  LoginEntry,
  {
    icon: typeof Dumbbell
    badgeClass: string
    glowClass: string
    cardClass: string
    showLogo: boolean
    badgeLabelKey: string
    subtitleKey?: string
  }
> = {
  trainer: {
    icon: Dumbbell,
    badgeClass: 'border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]',
    glowClass: 'from-[var(--text-muted)]/8 via-transparent to-transparent',
    cardClass: 'border-[var(--border-strong)]',
    showLogo: true,
    badgeLabelKey: 'login.badgeTrainer',
  },
  'smart-fitness': {
    icon: Dumbbell,
    badgeClass: 'border-[var(--accent)]/35 bg-[var(--accent-dim)] text-[var(--accent)]',
    glowClass: 'from-[var(--accent)]/14 via-transparent to-transparent',
    cardClass: 'border-[var(--accent)]/20 shadow-[0_0_0_1px_rgba(184,245,61,0.06)]',
    showLogo: true,
    badgeLabelKey: 'login.badgeSmartFitness',
    subtitleKey: 'login.subtitleTrainer',
  },
  client: {
    icon: UserRound,
    badgeClass: 'border-[var(--blue)]/30 bg-[rgba(77,158,255,0.12)] text-[var(--blue)]',
    glowClass: 'from-[var(--blue)]/12 via-transparent to-transparent',
    cardClass: 'border-[var(--border-strong)]',
    showLogo: true,
    badgeLabelKey: 'login.badgeClient',
  },
  admin: {
    icon: Shield,
    badgeClass: 'border-[var(--purple)]/30 bg-[rgba(167,139,250,0.12)] text-[var(--purple)]',
    glowClass: 'from-[var(--purple)]/12 via-transparent to-transparent',
    cardClass: 'border-[var(--border-strong)]',
    showLogo: true,
    badgeLabelKey: 'login.badgeAdmin',
  },
}

export function RoleLoginShell({ entry, children }: { entry: LoginEntry; children: ReactNode }) {
  const { t } = useTranslation('auth')
  const meta = ENTRY_META[entry]
  const Icon = meta.icon

  return (
    <div className="role-login-root flex min-h-dvh flex-col bg-[var(--bg-base)]">
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-[min(42vh,320px)] bg-gradient-to-b',
          meta.glowClass,
        )}
        aria-hidden
      />
      <div className="relative z-10 flex flex-1 flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <header className="mb-6 text-center sm:mb-8">
            {meta.showLogo ? (
              <LogoLink size="lg" className="mb-5 inline-flex justify-center" />
            ) : (
              <div className="mb-5 flex justify-center">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <Shield className="h-5 w-5 text-[var(--purple)]" strokeWidth={1.75} />
                </span>
              </div>
            )}
            <span
              className={cn(
                'mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
                meta.badgeClass,
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              {t(meta.badgeLabelKey)}
            </span>
            {meta.subtitleKey ? (
              <p className="text-xs text-[var(--text-muted)]">{t(meta.subtitleKey)}</p>
            ) : null}
          </header>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className={cn(
              'overflow-hidden rounded-2xl border bg-[var(--surface)]/95 backdrop-blur-sm',
              meta.cardClass,
            )}
          >
            {children}
          </motion.div>

          {entry === 'admin' ? (
            <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
              <Link to="/login" className="font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                {t('hub.changeRole')}
              </Link>
              <span className="mx-2 text-[var(--border-strong)]">·</span>
              <Link to="/" className="font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                {t('login.backHome')}
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
              <Link to="/login" className="font-medium text-[var(--text-secondary)] hover:text-[var(--accent)]">
                {t('hub.changeRole')}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
