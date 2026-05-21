import { LegalDocument } from '@/components/legal/LegalDocument'
import { TERMS_SECTIONS } from '@/features/legal/legal-content'

export function TermsPage() {
  return (
    <LegalDocument title="Пользовательское соглашение" updated="21 мая 2026" sections={TERMS_SECTIONS} />
  )
}
