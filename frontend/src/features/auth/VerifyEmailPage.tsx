import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { verifyEmail } from '@/features/api/auth-service'

type Status = 'loading' | 'success' | 'error'

export function VerifyEmailPage() {
  const { t } = useTranslation(['auth'])
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [status, setStatus] = useState<Status>(() => (token ? 'loading' : 'error'))

  useEffect(() => {
    if (!token) return
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  const icon =
    status === 'loading' ? (
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--text-muted)]" />
    ) : status === 'success' ? (
      <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--accent)]" />
    ) : (
      <XCircle className="mx-auto h-10 w-10 text-red-400" />
    )

  const title =
    status === 'loading'
      ? t('verify.loading')
      : status === 'success'
        ? t('verify.successTitle')
        : t('verify.errorTitle')

  const text =
    status === 'loading'
      ? t('verify.loadingText')
      : status === 'success'
        ? t('verify.successText')
        : t('verify.errorText')

  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-8 text-center">
        {icon}
        <p className="mt-4 text-sm text-[var(--text-secondary)]">{text}</p>
        {status !== 'loading' && (
          <Button className="mt-6" variant="secondary" asChild>
            <Link to="/login/trainer">{t('verify.backToLogin')}</Link>
          </Button>
        )}
      </CardContent>
    </>
  )
}
