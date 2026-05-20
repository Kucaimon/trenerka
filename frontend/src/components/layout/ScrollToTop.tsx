import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const SHOW_AFTER_PX = 320

export function ScrollToTop() {
  const { t } = useTranslation('common')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('aria.scrollToTop')}
      className={cn('concept-scroll-top', visible && 'concept-scroll-top--visible')}
    >
      <ChevronUp className="h-4 w-4" aria-hidden />
    </button>
  )
}
