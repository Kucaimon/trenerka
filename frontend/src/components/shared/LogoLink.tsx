import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'

type LogoLinkProps = Omit<LinkProps, 'to'> & {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon'
  logoClassName?: string
}

/** Logo wrapped in a link to the landing home page (`/`). */
export function LogoLink({
  size = 'md',
  variant = 'full',
  className,
  logoClassName,
  children,
  ...linkProps
}: LogoLinkProps) {
  return (
    <Link to="/" className={cn('inline-flex shrink-0 items-center', className)} {...linkProps}>
      <Logo size={size} variant={variant} className={logoClassName} />
      {children}
    </Link>
  )
}
