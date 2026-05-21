import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

/** Profile fields live on `/trainer/profile`; settings nav redirects there. */
export function SettingsPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const navigate = useNavigate()

  useEffect(() => {
    toast.info(t('settings.redirectToProfile'), { duration: 5000 })
    navigate('/trainer/profile', { replace: true })
  }, [navigate, t])

  return (
    <p className="text-sm text-[var(--text-muted)]">{t('common:actions.loading')}</p>
  )
}
