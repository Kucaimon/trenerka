import { ExternalLink, GraduationCap } from 'lucide-react'
import { config } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SkillsButtonProps = {
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
}

export function SkillsButton({
  className,
  variant = 'outline',
  size = 'sm',
  fullWidth,
}: SkillsButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(fullWidth && 'w-full', className)}
      onClick={() => window.open(config.skillsUrl, '_blank', 'noopener,noreferrer')}
    >
      <GraduationCap className="h-4 w-4" />
      Навыки
      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
    </Button>
  )
}
