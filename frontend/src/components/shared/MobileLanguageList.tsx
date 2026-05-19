import { useTranslation } from 'react-i18next'
import { Check, Globe } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/i18n'
import { changeAppLanguage } from '@/lib/change-language'
import { cn } from '@/lib/utils'

function languageCodeLabel(code: string) {
  if (code === 'zh-CN') return 'ZH'
  return code.split('-')[0].toUpperCase()
}

type MobileLanguageListProps = {
  className?: string
  onSelect?: () => void
}

export function MobileLanguageList({ className, onSelect }: MobileLanguageListProps) {
  const { i18n, t } = useTranslation('common')

  const handleSelect = (code: string) => {
    changeAppLanguage(i18n, code)
    onSelect?.()
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        <Globe className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
        {t('language.switch')}
      </p>
      <ul className="flex flex-col gap-0.5" role="listbox" aria-label={t('language.switch')}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const selected = i18n.language === lang.code
          return (
            <li key={lang.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                  'touch-target flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base font-medium transition-colors',
                  selected
                    ? 'bg-[var(--accent-dim)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface2)] hover:text-[var(--text-primary)]',
                )}
                onClick={() => handleSelect(lang.code)}
              >
                <span className="flex-1 truncate">{lang.native}</span>
                <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                  {languageCodeLabel(lang.code)}
                </span>
                {selected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
