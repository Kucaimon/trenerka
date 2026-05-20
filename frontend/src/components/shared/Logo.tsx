import { cn } from '@/lib/utils'

const LOGO_VERSION = 9

/** Intrinsic dimensions of frontend/public/logo.png */
const FULL_WIDTH = 941
const FULL_HEIGHT = 216
const FULL_ASPECT = FULL_WIDTH / FULL_HEIGHT

const fullHeights = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
} as const

const fullMaxWidths = {
  sm: 'max-w-[140px]',
  md: 'max-w-[175px]',
  lg: 'max-w-[210px]',
} as const

const iconSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const

type LogoProps = {
  size?: keyof typeof fullHeights
  variant?: 'full' | 'icon'
  className?: string
}

export function Logo({ size = 'md', variant = 'full', className }: LogoProps) {
  const isIcon = variant === 'icon'
  const webp = `/logo.webp?v=${LOGO_VERSION}`
  const png = `/logo.png?v=${LOGO_VERSION}`

  return (
    <picture
      className={cn(
        'inline-flex shrink-0 items-center overflow-hidden',
        isIcon ? iconSizes[size] : [fullHeights[size], fullMaxWidths[size]],
        className,
      )}
      style={{ aspectRatio: isIcon ? '1' : String(FULL_ASPECT) }}
    >
      <source srcSet={webp} type="image/webp" />
      <img
        src={png}
        alt="Тренерка"
        width={FULL_WIDTH}
        height={FULL_HEIGHT}
        className={cn('h-full w-full object-contain', isIcon && 'object-left')}
        loading="eager"
        decoding="async"
      />
    </picture>
  )
}
