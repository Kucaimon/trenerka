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
  const { data: clients = [] } = useClients()
  const { data: analytics } = useTrainerAnalytics()

  const atRisk = clients
    .filter((c) => c.status === 'active' && (c.packageBalance <= 2 || !c.lastSession))
    .map((c) => c.name)
    .slice(0, 3)

  const revenue = analytics?.monthlyRevenue ?? 0
  const unread = analytics?.unreadMessages ?? 0
  const sessions = analytics?.weeklySessions ?? 0

  const cards: InsightCard[] = [
    {
      icon: AlertTriangle,
      title: 'Риск оттока',
      text: atRisk.length
        ? `${atRisk.join(', ')} — низкий баланс пакета или давно не было сессии.`
        : 'Критичных клиентов не обнаружено.',
      action: { label: 'Открыть CRM', to: '/trainer/clients' },
    },
    {
      icon: CreditCard,
      title: 'Оплаты',
      text:
        revenue > 0
          ? `Выручка за месяц ${formatRub(revenue)}. Проверьте клиентов с просроченными пакетами.`
          : 'Запишите первый платёж, чтобы видеть финансовую картину.',
      action: { label: 'Финансы', to: '/trainer/finance' },
    },
    {
      icon: MessageSquare,
      title: 'Коммуникация',
      text:
        unread > 0
          ? `${unread} непрочитанных сообщений от клиентов.`
          : 'Все чаты прочитаны — хороший момент для check-in.',
      action: { label: 'Чаты', to: '/trainer/messages' },
    },
    {
      icon: Calendar,
      title: 'Расписание',
      text:
        sessions > 0
          ? `На неделе ${sessions} событий в календаре. Проверьте напоминания.`
          : 'Календарь пуст — добавьте первые сессии.',
      action: { label: 'Календарь', to: '/trainer/calendar' },
    },
  ]

  return (
    <div className="page-container">
      <PageHeader
        title="AI-коуч"
        description="Операционные сигналы по клиентам, оплатам и расписанию — с конкретным следующим шагом."
        actions={<Badge variant="accent">Beta</Badge>}
      />

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">Сводка практики</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {analytics?.activeClients ?? 0} активных клиентов · {unread} непрочитанных ·{' '}
              {formatRub(revenue)} за месяц
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