import { useTranslation } from 'react-i18next'
import { TrainerStubPage } from '@/components/shared/trainer-stub-page'

export function SupportPage() {
  const { t } = useTranslation('trainer')

  return (
    <TrainerStubPage
      title={t('support.title')}
      description={t('support.description')}
    />
  )
}
