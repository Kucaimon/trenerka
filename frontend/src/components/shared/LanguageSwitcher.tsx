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

type LanguageSwitcherProps = {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
  showLabel?: boolean
}

export function LanguageSwitcher({
  className,
  variant = 'ghost',
  size = 'sm',
  showLabel = false,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation('common')

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0]

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
          size={size}
          className={cn('gap-1.5', className)}
          aria-label={t('language.switch')}
        >
          <Globe className="h-4 w-4 shrink-0" />
          {showLabel ? (
            <span className="max-w-[6rem] truncate text-xs">{current.native}</span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[min(20rem,70vh)] overflow-y-auto">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(i18n.language === lang.code && 'bg-[var(--accent-dim)] text-[var(--accent)]')}
          >
            {lang.native}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
