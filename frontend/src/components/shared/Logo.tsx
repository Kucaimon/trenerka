import { cn } from '@/lib/utils'

const LOGO_VERSION = 8

/** Intrinsic dimensions of frontend/public/logo.png */
const FULL_WIDTH = 941
const FULL_HEIGHT = 216
const FULL_ASPECT = FULL_WIDTH / FULL_HEIGHT

/** Intrinsic dimensions of frontend/public/logo-icon.png */
const ICON_SIZE = 216

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
  const base = isIcon ? 'logo-icon' : 'logo'
  const webp = `/${base}.webp?v=${LOGO_VERSION}`
  const png = `/${base}.png?v=${LOGO_VERSION}`

  return (
    <picture
      className={cn(
        'inline-flex shrink-0 items-center',
        isIcon ? iconSizes[size] : [fullHeights[size], fullMaxWidths[size]],
        className,
      )}
      style={{ aspectRatio: isIcon ? '1' : String(FULL_ASPECT) }}
    >
      <source srcSet={webp} type="image/webp" />
      <img
        src={png}
        alt="Тренерка"
        width={isIcon ? ICON_SIZE : FULL_WIDTH}
        height={isIcon ? ICON_SIZE : FULL_HEIGHT}
        className="h-full w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </picture>
  )
}
