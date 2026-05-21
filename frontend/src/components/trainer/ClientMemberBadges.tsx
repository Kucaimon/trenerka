import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { needsOnboardingBadge } from '@/lib/client-crm'
import type { Client } from '@/types'

export function ClientMemberBadges({ client }: { client: Client }) {
  const { t } = useTranslation('trainer')
  const memberType = client.memberType ?? 'client'
  const lifecycle = client.lifecycleStatus

  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant="accent" className="text-[10px]">
        {t(`clients.memberType.${memberType}`)}
      </Badge>
      {lifecycle ? (
        <Badge variant="secondary" className="text-[10px]">
          {t(`clients.lifecycle.${lifecycle}`)}
        </Badge>
      ) : null}
      {needsOnboardingBadge(client.onboardingState) ? (
        <Badge variant="warning" className="text-[10px]">
          {t(`clients.onboarding.${client.onboardingState}`)}
        </Badge>
      ) : null}
    </div>
  )
}
