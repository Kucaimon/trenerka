import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AlertTriangle, Bot, Calendar, CreditCard, MessageSquare, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useClients, useTrainerAnalytics } from '@/features/api/hooks'
import { formatRub } from '@/lib/utils'

type InsightCard = {
  icon: typeof AlertTriangle
  title: string
  text: string
  action: { label: string; to: string }
}

export function AICoachPage() {
  const { t } = useTranslation(['trainer', 'common'])
  const { data: clients = [] } = useClients()
  const { data: analytics } = useTrainerAnalytics()

  const atRisk = clients
    .filter((c) => c.status === 'active' && (c.packageBalance <= 2 || !c.lastSession))
    .map((c) => c.name)
    .slice(0, 3)

  const revenue = analytics?.monthlyRevenue ?? 0
  const unread = analytics?.unreadMessages ?? 0
  const sessions = analytics?.weeklySessions ?? 0

  const cards: InsightCard[] = useMemo(
    () => [
      {
        icon: AlertTriangle,
        title: t('aiCoach.cards.churn.title'),
        text: atRisk.length
          ? t('aiCoach.cards.churn.atRisk', { names: atRisk.join(', ') })
          : t('aiCoach.cards.churn.ok'),
        action: { label: t('aiCoach.cards.churn.action'), to: '/trainer/clients' },
      },
      {
        icon: CreditCard,
        title: t('aiCoach.cards.payments.title'),
        text:
          revenue > 0
            ? t('aiCoach.cards.payments.hasRevenue', { amount: formatRub(revenue) })
            : t('aiCoach.cards.payments.empty'),
        action: { label: t('aiCoach.cards.payments.action'), to: '/trainer/finance' },
      },
      {
        icon: MessageSquare,
        title: t('aiCoach.cards.comms.title'),
        text:
          unread > 0
            ? t('aiCoach.cards.comms.unread', { count: unread })
            : t('aiCoach.cards.comms.allRead'),
        action: { label: t('aiCoach.cards.comms.action'), to: '/trainer/messages' },
      },
      {
        icon: Calendar,
        title: t('aiCoach.cards.schedule.title'),
        text:
          sessions > 0
            ? t('aiCoach.cards.schedule.hasEvents', { count: sessions })
            : t('aiCoach.cards.schedule.empty'),
        action: { label: t('aiCoach.cards.schedule.action'), to: '/trainer/calendar' },
      },
    ],
    [atRisk, revenue, unread, sessions, t],
  )

  return (
    <div className="page-container">
      <PageHeader
        title={t('aiCoach.title')}
        description={t('aiCoach.description')}
        actions={<Badge variant="accent">{t('aiCoach.badgeBeta')}</Badge>}
      />

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">{t('aiCoach.summary.title')}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {t('aiCoach.summary.line', {
                clients: analytics?.activeClients ?? 0,
                unread,
                revenue: formatRub(revenue),
              })}
            </p>
          </div>
        </div>
      </section>

      <div className="gap-grid grid-cols-1 lg:grid-cols-2">
        {cards.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.title} className="gap-grid-cell flex flex-col p-5">
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-4 w-4 text-[var(--accent)]" />
                <h2 className="font-display text-base font-bold">{item.title}</h2>
                <Sparkles className="ml-auto h-3.5 w-3.5 text-[var(--text-muted)]" />
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">{item.text}</p>
              <Button variant="secondary" size="sm" className="mt-4 w-fit" asChild>
                <Link to={item.action.to}>{item.action.label}</Link>
              </Button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
