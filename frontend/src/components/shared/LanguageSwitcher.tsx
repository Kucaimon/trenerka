import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SUPPORTED_LANGUAGES, LANG_STORAGE_KEY, applyDocumentDirection } from '@/i18n'
import { cn } from '@/lib/utils'

function languageCodeLabel(code: string) {
  if (code === 'zh-CN') return 'ZH'
  return code.split('-')[0].toUpperCase()
}

type LanguageSwitcherProps = {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
  showLabel?: boolean
  compact?: boolean
}

export function LanguageSwitcher({
  className,
  variant = 'outline',
  size = 'sm',
  showLabel = false,
  compact = false,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation('common')

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0]
  const codeLabel = languageCodeLabel(current.code)

  const changeLanguage = (code: string) => {
    void i18n.changeLanguage(code)
    localStorage.setItem(LANG_STORAGE_KEY, code)
    applyDocumentDirection(code)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={compact ? 'sm' : size}
          className={cn(
            'shrink-0 gap-1.5 border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[rgba(255,255,255,0.28)] hover:bg-[var(--surface2)] hover:text-[var(--text-primary)]',
            compact && 'h-9 px-2.5',
            className,
          )}
          aria-label={t('language.switch')}
        >
          <Globe className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
          {showLabel ? (
            <span className="max-w-[7rem] truncate text-xs font-semibold">{current.native}</span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wide">{codeLabel}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[200] max-h-[min(20rem,70vh)] overflow-y-auto">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(i18n.language === lang.code && 'bg-[var(--accent-dim)] text-[var(--accent)]')}
          >
            <span className="font-medium">{lang.native}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
              {languageCodeLabel(lang.code)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
