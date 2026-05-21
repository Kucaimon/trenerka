import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Dumbbell, Shield, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LogoLink } from '@/components/shared/LogoLink'
import { cn } from '@/lib/utils'

const ENTRIES = [
  {
    key: 'client' as const,
    to: '/login/client',
    icon: UserRound,
    accent: 'blue' as const,
    titleKey: 'hub.clientTitle',
    descKey: 'hub.clientDesc',
  },
  {
    key: 'smart-fitness' as const,
    to: '/login/trainer',
    icon: Dumbbell,
    accent: 'accent' as const,
    titleKey: 'hub.trainerTitle',
    descKey: 'hub.trainerDesc',
  },
] as const

const ACCENT_STYLES = {
  blue: {
    card: 'border-[var(--blue)]/25 hover:border-[var(--blue)]/45',
    badge: 'border-[var(--blue)]/30 bg-[rgba(77,158,255,0.12)] text-[var(--blue)]',
    icon: 'text-[var(--blue)]',
  },
  accent: {
    card: 'border-[var(--accent)]/25 hover:border-[var(--accent)]/45 shadow-[0_0_0_1px_rgba(184,245,61,0.06)]',
    badge: 'border-[var(--accent)]/35 bg-[var(--accent-dim)] text-[var(--accent)]',
    icon: 'text-[var(--accent)]',
  },
} as const

export function LoginHubPage() {
  const { t } = useTranslation('auth')

  return (
    <div className="role-login-root flex min-h-dvh flex-col bg-[var(--bg-base)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(48vh,360px)] bg-gradient-to-b from-[var(--accent)]/10 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative z-10 flex flex-1 flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <header className="mb-8 text-center">
            <LogoLink size="lg" className="mb-5 inline-flex justify-center" />
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
              {t('hub.title')}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{t('hub.subtitle')}</p>
          </header>

          <div className="grid gap-3 sm:gap-4">
            {ENTRIES.map(({ key, to, icon: Icon, accent, titleKey, descKey }, i) => {
              const styles = ACCENT_STYLES[accent]
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.06 }}
                >
                  <Link
                    to={to}
                    className={cn(
                      'group flex min-h-11 touch-manipulation items-center gap-4 rounded-2xl border bg-[var(--surface)]/95 px-4 py-4 backdrop-blur-sm transition-colors sm:min-h-[5rem] sm:px-5',
                      styles.card,
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border',
                        styles.badge,
                      )}
                    >
                      <Icon className={cn('h-5 w-5', styles.icon)} strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block text-base font-semibold text-[var(--text-primary)]">
                        {t(titleKey)}
                      </span>
                      <span className="mt-0.5 block text-sm text-[var(--text-secondary)]">{t(descKey)}</span>
                    </span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--text-primary)]"
                      aria-hidden
                    />
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            <Link to="/" className="font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              {t('login.backHome')}
            </Link>
            <span className="mx-2 text-[var(--border-strong)]">·</span>
            <Link
              to="/login/admin"
              className="inline-flex min-h-11 items-center gap-1 font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              <Shield className="h-3 w-3" aria-hidden />
              {t('hub.adminLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
