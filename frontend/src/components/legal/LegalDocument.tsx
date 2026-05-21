import { Link } from 'react-router-dom'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Button } from '@/components/ui/button'

export type LegalSection = { id: string; title: string; paragraphs: string[] }

export function LegalDocument({
  title,
  updated,
  sections,
  contactEmail = 'hello@trenerka.ru',
}: {
  title: string
  updated: string
  sections: LegalSection[]
  contactEmail?: string
}) {
  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--text-primary)]">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-24 sm:px-6">
        <h1 className="ds-h2">{title}</h1>
        <p className="ds-caption mt-2 text-[var(--text-muted)]">Обновлено: {updated}</p>
        <nav className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
          <p className="mb-2 font-semibold text-[var(--text-secondary)]">Содержание</p>
          <ol className="list-decimal space-y-1 pl-5 text-[var(--text-secondary)]">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-[var(--accent)]">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="prose-invert mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="text-lg font-semibold tracking-tight">{s.title}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="ds-body mt-3 text-[var(--text-secondary)]">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
        <p className="ds-caption mt-10 text-[var(--text-muted)]">
          По вопросам:{' '}
          <a href={`mailto:${contactEmail}`} className="text-[var(--accent)] hover:underline">
            {contactEmail}
          </a>
        </p>
        <Button variant="outline" className="mt-8" asChild>
          <Link to="/">На главную</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  )
}
