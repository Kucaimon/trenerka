import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { formatRub, formatDate, formatDateTime, formatNumber, intlLocale } from '@/lib/i18n-format'
