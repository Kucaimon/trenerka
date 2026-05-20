import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { toast } from 'sonner'
import { Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  buildProgramShareUrl,
  canUseNativeShare,
  copyToClipboard,
  estimateWorkoutMinutes,
  nativeShare,
  openVkShare,
  type ProgramShareInput,
} from '@/lib/program-share'
import { cn } from '@/lib/utils'

function buildShareContent(input: ProgramShareInput, t: TFunction) {
  const minutes = input.estimatedMinutes || estimateWorkoutMinutes(input.exerciseCount)
  const vkDescription = t('programShare.vkDescription', {
    day: input.dayLabel ?? '—',
    count: input.exerciseCount,
    minutes,
  })
  const shareUrl = buildProgramShareUrl('landing')
  const weeksLine = input.weeks ? t('programShare.weeksLine', { weeks: input.weeks }) : ''
  const clipboardText = t('programShare.clipboard', {
    name: input.programName,
    day: input.dayLabel ?? '—',
    count: input.exerciseCount,
    minutes,
    weeksLine,
    url: shareUrl,
  })

  return {
    title: input.programName,
    vkDescription,
    shareUrl,
    clipboardText,
  }
}

type ProgramShareMenuProps = {
  input: ProgramShareInput
  variant?: 'default' | 'outline' | 'ghost' | 'icon'
  className?: string
  align?: 'start' | 'center' | 'end'
}

export function ProgramShareMenu({
  input,
  variant = 'outline',
  className,
  align = 'end',
}: ProgramShareMenuProps) {
  const { t } = useTranslation('trainer')
  const { title, vkDescription, shareUrl, clipboardText } = buildShareContent(input, t)
  const showNative = canUseNativeShare()

  const handleVk = () => {
    openVkShare(shareUrl, title, vkDescription)
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(clipboardText)
      toast.success(t('programShare.toast.copied'))
    } catch {
      toast.error(t('programShare.toast.copyError'))
    }
  }

  const handleNative = async () => {
    try {
      await nativeShare({ title, text: clipboardText, url: shareUrl })
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      toast.error(t('programShare.toast.shareError'))
    }
  }

  const trigger =
    variant === 'icon' ? (
      <Button variant="ghost" size="icon" className={cn('h-9 w-9 shrink-0', className)} aria-label={t('programShare.button')}>
        <Share2 className="h-4 w-4" />
      </Button>
    ) : (
      <Button variant={variant === 'default' ? 'default' : variant} size="sm" className={cn('gap-2', className)}>
        <Share2 className="h-4 w-4" />
        {t('programShare.button')}
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[12rem]">
        <DropdownMenuItem onClick={handleVk}>{t('programShare.vk')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => void handleCopy()}>
          <Copy className="mr-2 h-3.5 w-3.5" />
          {t('programShare.copyText')}
        </DropdownMenuItem>
        {showNative ? (
          <DropdownMenuItem onClick={() => void handleNative()}>{t('programShare.native')}</DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
