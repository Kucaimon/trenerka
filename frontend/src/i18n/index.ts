import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ruCommon from '@/locales/ru/common.json'
import ruLanding from '@/locales/ru/landing.json'
import ruAuth from '@/locales/ru/auth.json'
import ruTrainer from '@/locales/ru/trainer.json'
import ruClient from '@/locales/ru/client.json'
import ruAdmin from '@/locales/ru/admin.json'

import enCommon from '@/locales/en/common.json'
import enLanding from '@/locales/en/landing.json'
import enAuth from '@/locales/en/auth.json'
import enTrainer from '@/locales/en/trainer.json'
import enClient from '@/locales/en/client.json'
import enAdmin from '@/locales/en/admin.json'

import deCommon from '@/locales/de/common.json'
import deLanding from '@/locales/de/landing.json'
import deAuth from '@/locales/de/auth.json'
import deTrainer from '@/locales/de/trainer.json'
import deClient from '@/locales/de/client.json'
import deAdmin from '@/locales/de/admin.json'

import ptCommon from '@/locales/pt/common.json'
import ptLanding from '@/locales/pt/landing.json'
import ptAuth from '@/locales/pt/auth.json'
import ptTrainer from '@/locales/pt/trainer.json'
import ptClient from '@/locales/pt/client.json'
import ptAdmin from '@/locales/pt/admin.json'

import jaCommon from '@/locales/ja/common.json'
import jaLanding from '@/locales/ja/landing.json'
import jaAuth from '@/locales/ja/auth.json'
import jaTrainer from '@/locales/ja/trainer.json'
import jaClient from '@/locales/ja/client.json'
import jaAdmin from '@/locales/ja/admin.json'

import itCommon from '@/locales/it/common.json'
import itLanding from '@/locales/it/landing.json'
import itAuth from '@/locales/it/auth.json'
import itTrainer from '@/locales/it/trainer.json'
import itClient from '@/locales/it/client.json'
import itAdmin from '@/locales/it/admin.json'

import esCommon from '@/locales/es/common.json'
import esLanding from '@/locales/es/landing.json'
import esAuth from '@/locales/es/auth.json'
import esTrainer from '@/locales/es/trainer.json'
import esClient from '@/locales/es/client.json'
import esAdmin from '@/locales/es/admin.json'

import frCommon from '@/locales/fr/common.json'
import frLanding from '@/locales/fr/landing.json'
import frAuth from '@/locales/fr/auth.json'
import frTrainer from '@/locales/fr/trainer.json'
import frClient from '@/locales/fr/client.json'
import frAdmin from '@/locales/fr/admin.json'

import arCommon from '@/locales/ar/common.json'
import arLanding from '@/locales/ar/landing.json'
import arAuth from '@/locales/ar/auth.json'
import arTrainer from '@/locales/ar/trainer.json'
import arClient from '@/locales/ar/client.json'
import arAdmin from '@/locales/ar/admin.json'

import zhCommon from '@/locales/zh-CN/common.json'
import zhLanding from '@/locales/zh-CN/landing.json'
import zhAuth from '@/locales/zh-CN/auth.json'
import zhTrainer from '@/locales/zh-CN/trainer.json'
import zhClient from '@/locales/zh-CN/client.json'
import zhAdmin from '@/locales/zh-CN/admin.json'

export const LANG_STORAGE_KEY = 'trenerka_lang'

export const SUPPORTED_LANGUAGES = [
  { code: 'ru', label: 'Русский', native: 'Русский', dir: 'ltr' as const },
  { code: 'en', label: 'English', native: 'English', dir: 'ltr' as const },
  { code: 'de', label: 'German', native: 'Deutsch', dir: 'ltr' as const },
  { code: 'pt', label: 'Portuguese', native: 'Português', dir: 'ltr' as const },
  { code: 'ja', label: 'Japanese', native: '日本語', dir: 'ltr' as const },
  { code: 'it', label: 'Italian', native: 'Italiano', dir: 'ltr' as const },
  { code: 'es', label: 'Spanish', native: 'Español', dir: 'ltr' as const },
  { code: 'fr', label: 'French', native: 'Français', dir: 'ltr' as const },
  { code: 'ar', label: 'Arabic', native: 'العربية', dir: 'rtl' as const },
  { code: 'zh-CN', label: 'Chinese', native: '中文', dir: 'ltr' as const },
] as const

export type SupportedLangCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

const namespaces = ['common', 'landing', 'auth', 'trainer', 'client', 'admin'] as const

function bundle(
  common: object,
  landing: object,
  auth: object,
  trainer: object,
  client: object,
  admin: object,
) {
  return { common, landing, auth, trainer, client, admin }
}

const resources = {
  ru: bundle(ruCommon, ruLanding, ruAuth, ruTrainer, ruClient, ruAdmin),
  en: bundle(enCommon, enLanding, enAuth, enTrainer, enClient, enAdmin),
  de: bundle(deCommon, deLanding, deAuth, deTrainer, deClient, deAdmin),
  pt: bundle(ptCommon, ptLanding, ptAuth, ptTrainer, ptClient, ptAdmin),
  ja: bundle(jaCommon, jaLanding, jaAuth, jaTrainer, jaClient, jaAdmin),
  it: bundle(itCommon, itLanding, itAuth, itTrainer, itClient, itAdmin),
  es: bundle(esCommon, esLanding, esAuth, esTrainer, esClient, esAdmin),
  fr: bundle(frCommon, frLanding, frAuth, frTrainer, frClient, frAdmin),
  ar: bundle(arCommon, arLanding, arAuth, arTrainer, arClient, arAdmin),
  'zh-CN': bundle(zhCommon, zhLanding, zhAuth, zhTrainer, zhClient, zhAdmin),
}

export function applyDocumentDirection(lang: string) {
  const entry = SUPPORTED_LANGUAGES.find((l) => l.code === lang)
  const dir = entry?.dir ?? 'ltr'
  document.documentElement.lang = lang
  document.documentElement.dir = dir
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    ns: [...namespaces],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    debug: import.meta.env.DEV,
    saveMissing: import.meta.env.DEV,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANG_STORAGE_KEY,
      caches: ['localStorage'],
    },
  })

i18n.on('languageChanged', applyDocumentDirection)
applyDocumentDirection(i18n.language)

export default i18n
