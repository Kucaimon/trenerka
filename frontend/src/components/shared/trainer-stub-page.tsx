import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type TrainerStubPageProps = {
  title: string
  description: string
  badge?: string
}

export function TrainerStubPage({ title, description, badge = 'Скоро' }: TrainerStubPageProps) {
  return (
    <div className="page-container">
      <PageHeader title={title} description={description} />
      <Card className="max-w-2xl">
        <CardContent className="py-10">
          <Badge variant="accent" className="mb-4">{badge}</Badge>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Раздел в разработке. Интерфейс и навигация уже подключены — контент появится в следующей итерации premium-видения.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
