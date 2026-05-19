import type { i18n as I18nInstance } from 'i18next'
import { LANG_STORAGE_KEY, applyDocumentDirection } from '@/i18n'

export function changeAppLanguage(i18n: I18nInstance, code: string) {
  void i18n.changeLanguage(code)
  localStorage.setItem(LANG_STORAGE_KEY, code)
  applyDocumentDirection(code)
}
