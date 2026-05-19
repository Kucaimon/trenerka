import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Dumbbell } from 'lucide-react'

export function SiteFooter() {
  const { t } = useTranslation('common')

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--black)] py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-[#111]">
                <Dumbbell className="h-4 w-4" strokeWidth={2} />
              </span>
              Trenerka
            </div>
            <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">{t('footer.tagline')}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
            <div>
              <p className="mb-2 font-medium text-[var(--text-primary)]">{t('footer.product')}</p>
              <Link to="/login/trainer" className="block hover:text-[var(--text-primary)]">
                {t('footer.forTrainers')}
              </Link>
              <Link to="/login/client" className="block hover:text-[var(--text-primary)]">
                {t('footer.forClients')}
              </Link>
            </div>
            <div>
              <p className="mb-2 font-medium text-[var(--text-primary)]">{t('footer.company')}</p>
              <a href="#" className="block hover:text-[var(--text-primary)]">
                {t('footer.about')}
              </a>
              <a href="#" className="block hover:text-[var(--text-primary)]">
                {t('footer.contacts')}
              </a>
            </div>
            <div>
              <p className="mb-2 font-medium text-[var(--text-primary)]">{t('footer.legal')}</p>
              <a href="#" className="block hover:text-[var(--text-primary)]">
                {t('footer.policy')}
              </a>
              <a href="#" className="block hover:text-[var(--text-primary)]">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-[var(--text-muted)]">{t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
