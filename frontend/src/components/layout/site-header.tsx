import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/Logo'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'

export function SiteHeader() {
  const { t } = useTranslation('common')
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = [
    { href: '#product', label: t('nav.product') },
    { href: '#workouts', label: t('nav.builder') },
    { href: '#analytics', label: t('nav.analytics') },
    { href: '#pricing', label: t('nav.pricing') },
  ]

  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const mobileMenu =
    menuOpen &&
    createPortal(
      <>
        <button
          type="button"
          className="concept-nav-backdrop concept-nav-backdrop--visible lg:hidden"
          aria-label={t('nav.closeMenu')}
          onClick={closeMenu}
        />
        <aside
          id="site-mobile-nav"
          className="concept-nav-drawer concept-nav-drawer--open lg:hidden"
          aria-modal="true"
          role="dialog"
          aria-label={t('nav.mobileMenu')}
        >
          <div className="concept-nav-drawer__head">
            <Link
              to="/"
              className="concept-nav-drawer__logo flex min-w-0 items-center py-1"
              onClick={closeMenu}
            >
              <Logo size="md" className="!h-9 !max-w-[10rem]" />
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="touch-target shrink-0"
              aria-label={t('nav.closeMenu')}
              onClick={closeMenu}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="concept-nav-drawer__nav">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="touch-target rounded-lg px-3 py-2.5 text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--surface2)] hover:text-[var(--text-primary)]"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border)] pt-4">
              <LanguageSwitcher variant="outline" size="default" showLabel className="w-full justify-center" />
              <Button variant="outline" size="lg" className="min-h-[48px] w-full whitespace-normal" asChild>
                <Link to="/login/trainer" onClick={closeMenu}>
                  {t('actions.login')}
                </Link>
              </Button>
              <Button size="lg" className="min-h-[48px] w-full whitespace-normal" asChild>
                <Link to="/register/trainer" onClick={closeMenu}>
                  {t('actions.startFree')}
                </Link>
              </Button>
            </div>
          </nav>
        </aside>
      </>,
      document.body,
    )

  return (
    <header className="concept-nav">
      <div className="concept-nav-bar mx-auto flex w-full max-w-[1200px] items-center justify-between gap-2 sm:gap-3">
        <Link to="/" className="concept-nav-logo flex min-w-0 shrink items-center py-1">
          <Logo size="md" className="!h-8 !max-w-[7.5rem] md:!h-10 md:!max-w-[11rem]" />
        </Link>
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
        <div className="concept-nav-actions--desktop flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/login/trainer">{t('actions.login')}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register/trainer">{t('actions.startFree')}</Link>
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="concept-nav-menu-btn touch-target shrink-0 lg:hidden"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenu}
    </header>
  )
}
