import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { resetPassword } from '@/features/api/auth-service'

const schema = z.object({ email: z.string().email() })

export function ResetPasswordPage() {
  const { t } = useTranslation(['auth', 'common'])
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await resetPassword(data.email)
    toast.success(t('reset.toastSent'))
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{t('reset.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('login.email')}</Label>
            <Input type="email" {...register('email')} />
          </div>
          <Button type="submit" className="w-full">
            {t('reset.submit')}
          </Button>
        </form>
        <Link
          to="/login/trainer"
          className="mt-4 block text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          {t('reset.back')}
        </Link>
      </CardContent>
    </>
  )
}
