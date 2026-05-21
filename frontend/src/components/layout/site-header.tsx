import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Drawer } from 'vaul'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoLink } from '@/components/shared/LogoLink'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#product', labelKey: 'nav.product' },
  { href: '#benefits', labelKey: 'nav.features' },
  { href: '#client-preview', labelKey: 'nav.clientExperience' },
  { href: '#pricing', labelKey: 'nav.pricing' },
] as const

export function SiteHeader() {
  const { t } = useTranslation('common')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <motion.header
      className={cn('concept-nav', scrolled && 'concept-nav--scrolled')}
      initial={false}
      animate={{ opacity: scrolled ? 1 : 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <motion.div className="concept-nav-bar">
        <div className="concept-nav-brand">
          <LogoLink
            size="md"
            className="concept-nav-logo flex min-w-0 shrink items-center"
            logoClassName="!h-7 !max-w-[7rem] md:!h-8 md:!max-w-[9.5rem]"
          />
          <nav className="concept-nav-links hidden lg:flex" aria-label={t('aria.mainNav')}>
            {NAV_LINKS.map((item) => (
              <a key={item.href} href={item.href} className="concept-nav-link">
                {t(item.labelKey)}
              </a>
            ))}
          </nav>
        </div>

        <div className="concept-nav-actions hidden shrink-0 items-center gap-1 lg:flex">
          <LanguageSwitcher variant="ghost" compact className="border-transparent px-2" />
          <Button
            variant="ghost"
            size="sm"
            className="concept-nav-login h-8 px-2.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            asChild
          >
            <Link to="/login">{t('actions.login')}</Link>
          </Button>
          <Button size="sm" className="concept-nav-cta h-8 px-3 text-xs font-semibold" asChild>
            <Link to="/register/trainer">{t('actions.startFree')}</Link>
          </Button>
        </div>

        <motion.div className="concept-nav-mobile-actions lg:hidden">
          <LanguageSwitcher variant="ghost" compact className="border-transparent px-2" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="concept-nav-menu-btn h-9 w-9 shrink-0"
            aria-label={t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>

      <Drawer.Root
        open={menuOpen}
        onOpenChange={setMenuOpen}
        direction="right"
        shouldScaleBackground={false}
        setBackgroundColorOnScale={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="concept-nav-backdrop" />
          <Drawer.Content
            id="site-mobile-nav"
            className="concept-nav-drawer lg:hidden"
            aria-label={t('nav.mobileMenu')}
          >
            <div className="concept-nav-drawer__head">
              <LogoLink
                size="md"
                className="concept-nav-drawer__logo flex min-w-0 items-center py-1"
                logoClassName="!h-8 !max-w-[9rem]"
                onClick={closeMenu}
              />
              <Drawer.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="concept-nav-drawer__close h-9 w-9"
                  aria-label={t('nav.closeMenu')}
                >
                  <X className="h-5 w-5" />
                </Button>
              </Drawer.Close>
            </div>

            <div className="concept-nav-drawer__body">
              <nav className="concept-nav-drawer__nav">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="concept-nav-drawer__link"
                    onClick={closeMenu}
                  >
                    {t(item.labelKey)}
                  </a>
                ))}
              </nav>

              <motion.div className="concept-nav-drawer__account">
                <p className="concept-nav-drawer__account-label">{t('nav.account')}</p>
                <Link to="/login" className="concept-nav-drawer__link" onClick={closeMenu}>
                  {t('actions.login')}
                </Link>
                <Link to="/login/client" className="concept-nav-drawer__link" onClick={closeMenu}>
                  {t('actions.loginClient')}
                </Link>
                <Link to="/login/trainer" className="concept-nav-drawer__link" onClick={closeMenu}>
                  {t('actions.loginTrainer')}
                </Link>
                <Link to="/login/smart-fitness" className="concept-nav-drawer__link" onClick={closeMenu}>
                  {t('actions.loginSmartFitness')}
                </Link>
              </motion.div>
            </div>

            <div className="concept-nav-drawer__footer">
              <Button size="default" className="concept-nav-drawer__cta w-full" asChild>
                <Link to="/register/trainer" onClick={closeMenu}>
                  {t('actions.startFree')}
                </Link>
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </motion.header>
  )
}

