import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/Logo'
import { cn } from '@/lib/utils'

const nav = [
  { href: '#product', label: 'Продукт' },
  { href: '#workouts', label: 'Конструктор' },
  { href: '#analytics', label: 'Аналитика' },
  { href: '#pricing', label: 'Тарифы' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="concept-nav">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3">
        <Link to="/" className="concept-nav-logo flex shrink-0 items-center py-1">
          <Logo size="md" />
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
        <div className="concept-nav-actions--desktop flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/login/trainer">Войти</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register/trainer">Начать бесплатно</Link>
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="touch-target lg:hidden"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <div
        className={cn(
          'border-t border-[var(--border)] bg-[var(--surface)] lg:hidden',
          menuOpen ? 'block' : 'hidden',
        )}
      >
        <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-3">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="touch-target rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface2)] hover:text-[var(--text-primary)]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-[var(--border)] pt-3 lg:hidden">
            <Button variant="outline" size="lg" className="min-h-[48px] w-full" asChild>
              <Link to="/login/trainer" onClick={() => setMenuOpen(false)}>
                Войти
              </Link>
            </Button>
            <Button size="lg" className="min-h-[48px] w-full" asChild>
              <Link to="/register/trainer" onClick={() => setMenuOpen(false)}>
                Начать бесплатно
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
