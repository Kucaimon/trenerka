import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Drawer } from 'vaul'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoLink } from '@/components/shared/LogoLink'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'

export function SiteHeader() {
  const { t } = useTranslation('common')
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = [
    { href: '#benefits', label: t('nav.product') },
    { href: '#product', label: t('nav.builder') },
    { href: '#pricing', label: t('nav.pricing') },
  ]

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="concept-nav">
      <div className="concept-nav-bar mx-auto flex w-full max-w-[1200px] items-center justify-between gap-2 sm:gap-3">
        <LogoLink
          size="md"
          className="concept-nav-logo flex min-w-0 shrink items-center py-1"
          logoClassName="!h-8 !max-w-[7.5rem] md:!h-10 md:!max-w-[11rem]"
        />
        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface2)] hover:text-[var(--text-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="concept-nav-actions hidden shrink-0 items-center gap-2 lg:flex">
          <LanguageSwitcher showLabel />
          <Button variant="ghost" size="sm" className="hidden xl:inline-flex" asChild>
            <Link to="/login/client">{t('actions.loginClient')}</Link>
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/login/trainer">{t('actions.loginTrainer')}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register/trainer">{t('actions.startFree')}</Link>
          </Button>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
          <LanguageSwitcher compact />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="concept-nav-menu-btn touch-target shrink-0"
            aria-label={t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

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
                logoClassName="!h-9 !max-w-[10rem]"
                onClick={closeMenu}
              />
              <Drawer.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="concept-nav-drawer__close touch-target"
                  aria-label={t('nav.closeMenu')}
                >
                  <X className="h-5 w-5" />
                </Button>
              </Drawer.Close>
            </div>

            <div className="concept-nav-drawer__body">
              <nav className="concept-nav-drawer__nav">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="concept-nav-drawer__link touch-target"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="concept-nav-drawer__footer">
              <Button variant="outline" size="lg" className="min-h-[48px] w-full whitespace-normal" asChild>
                <Link to="/login/trainer" onClick={closeMenu}>
                  {t('actions.loginTrainer')}
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="min-h-[48px] w-full whitespace-normal" asChild>
                <Link to="/login/client" onClick={closeMenu}>
                  {t('actions.loginClient')}
                </Link>
              </Button>
              <Button size="lg" className="min-h-[48px] w-full whitespace-normal" asChild>
                <Link to="/register/trainer" onClick={closeMenu}>
                  {t('actions.startFree')}
                </Link>
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </header>
  )
}
