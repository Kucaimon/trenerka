import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    const { t } = useTranslation('auth')
    const [visible, setVisible] = React.useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('hidePassword') : t('showPassword')}
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
