import { useTranslation } from 'react-i18next'
import { Mail, MessageCircle, HelpCircle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const SUPPORT_EMAIL = 'hello@trenerka.ru'
const SUPPORT_TELEGRAM = 'https://t.me/samat_trenerka'

export function SupportPage() {
  const { t } = useTranslation('trainer')

  const faq = t('support.faq', { returnObjects: true }) as Array<{ q: string; a: string }>

  return (
    <div className="page-container max-w-3xl">
      <PageHeader title={t('support.title')} description={t('support.description')} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-[var(--accent)]" />
              {t('support.emailTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">{t('support.emailHint')}</p>
            <Button variant="secondary" size="sm" asChild>
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4 text-[var(--accent)]" />
              {t('support.telegramTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">{t('support.telegramHint')}</p>
            <Button size="sm" asChild>
              <a href={SUPPORT_TELEGRAM} target="_blank" rel="noopener noreferrer">
                {t('support.telegramAction')}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4 text-[var(--accent)]" />
            {t('support.faqTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-[var(--border)]">
          {faq.map((item) => (
            <div key={item.q} className="py-4 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold">{item.q}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
