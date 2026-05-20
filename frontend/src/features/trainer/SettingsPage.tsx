import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useLogout } from '@/lib/auth/logout'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function SettingsPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const user = useAuthStore((s) => s.user)
  const handleLogout = useLogout('trainer')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <LanguageSwitcher showLabel />
      </div>
      <Card>
        <CardHeader><CardTitle>{t('settings.profile')}</CardTitle></CardHeader>
        <CardContent className="max-w-md space-y-4">
          <div><Label>{t('settings.name')}</Label><Input defaultValue={user?.name} /></div>
          <div><Label>Email</Label><Input defaultValue={user?.email} disabled /></div>
          <Button>{t('common:actions.save')}</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{t('common:actions.logout')}</CardTitle></CardHeader>
        <CardContent className="max-w-md">
          <Button type="button" variant="outline" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            {t('common:actions.logout')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
