import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function RouteErrorFallback() {
  const { t } = useTranslation('common')
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? error.statusText || String(error.status)
    : error instanceof Error
      ? error.message
      : t('errors.unexpected')

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold text-[var(--text-primary)]">{t('errors.pageTitle')}</p>
      <p className="max-w-md text-sm text-[var(--text-muted)]">{message}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
          {t('actions.retry')}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">{t('actions.home')}</Link>
        </Button>
      </div>
    </div>
  )
}
