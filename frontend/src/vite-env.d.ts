/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WP_API_URL: string
  readonly VITE_USE_MOCK_DATA: string
  readonly VITE_SKILLS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
