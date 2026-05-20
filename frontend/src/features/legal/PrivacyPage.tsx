import { Link } from 'react-router-dom'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Button } from '@/components/ui/button'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--text-primary)]">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-24 sm:px-6">
        <h1 className="ds-h2">Политика конфиденциальности</h1>
        <p className="ds-body mt-4 text-[var(--text-secondary)]">
          Документ в подготовке. Здесь будет описание обработки персональных данных платформы Trenerka в
          соответствии с требованиями законодательства РФ.
        </p>
        <p className="ds-caption mt-6 text-[var(--text-muted)]">
          По вопросам:{' '}
          <a href="mailto:hello@trenerka.ru" className="text-[var(--accent)] hover:underline">
            hello@trenerka.ru
          </a>
        </p>
        <Button variant="outline" className="mt-8" asChild>
          <Link to="/">На главную</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  )
}
