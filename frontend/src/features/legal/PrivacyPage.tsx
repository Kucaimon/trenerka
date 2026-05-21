import { LegalDocument } from '@/components/legal/LegalDocument'
import { PRIVACY_SECTIONS } from '@/features/legal/legal-content'

export function PrivacyPage() {
  return (
    <LegalDocument title="Политика конфиденциальности" updated="21 мая 2026" sections={PRIVACY_SECTIONS} />
  )
}
