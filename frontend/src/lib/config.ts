function normalizeWpApiUrl(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim().replace(/\/+$/, '')
  if (!trimmed) {
    if (import.meta.env.PROD) return ''
    return 'http://localhost:8080/wp-json'
  }
  return trimmed.endsWith('/wp-json') ? trimmed : `${trimmed}/wp-json`
}

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true'
const wpApiUrl = normalizeWpApiUrl(import.meta.env.VITE_WP_API_URL)

if (import.meta.env.PROD && !useMockData && !(import.meta.env.VITE_WP_API_URL ?? '').trim()) {
  console.error(
    '[Trenerka] VITE_USE_MOCK_DATA=false but VITE_WP_API_URL is empty. Set VITE_WP_API_URL to your WordPress /wp-json base.',
  )
}

export const config = {
  appName: 'Trenerka',
  wpApiUrl,
  useMockData,
  skillsUrl: import.meta.env.VITE_SKILLS_URL ?? 'https://fitnesakademiya.ru',
} as const
