import i18n from '@/i18n'

const INTL_LOCALE: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  de: 'de-DE',
  pt: 'pt-BR',
  ja: 'ja-JP',
  it: 'it-IT',
  es: 'es-ES',
  fr: 'fr-FR',
  ar: 'ar-SA',
  'zh-CN': 'zh-CN',
}

export function intlLocale(lang = i18n.language): string {
  return INTL_LOCALE[lang] ?? lang
}

export function formatRub(amount: number, lang = i18n.language): string {
  return new Intl.NumberFormat(intlLocale(lang), {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date, lang = i18n.language): string {
  return new Intl.DateTimeFormat(intlLocale(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatLongDate(date: Date = new Date(), lang = i18n.language): string {
  return new Intl.DateTimeFormat(intlLocale(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(date: string | Date, lang = i18n.language): string {
  return new Intl.DateTimeFormat(intlLocale(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatNumber(value: number, lang = i18n.language): string {
  return new Intl.NumberFormat(intlLocale(lang)).format(value)
}
