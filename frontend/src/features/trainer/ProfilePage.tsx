import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ProfilePage() {
  const { t } = useTranslation(['trainer', 'common'])
  const user = useAuthStore((s) => s.user)

  return (
    <div className="page-container">
      <PageHeader
        title={t('profile.title')}
        description={t('profile.description')}
        actions={<Badge variant="accent">{t('profile.badgePro')}</Badge>}
      />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{user?.name ?? t('profile.defaultName')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t('profile.fields.name')}</Label>
            <Input defaultValue={user?.name} />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue={user?.email} disabled />
          </div>
          <div>
            <Label>{t('profile.fields.specialization')}</Label>
            <Input placeholder={t('profile.specializationPlaceholder')} />
          </div>
          <Button>{t('common:actions.save')}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
