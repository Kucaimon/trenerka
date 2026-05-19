export const config = {
  appName: 'Trenerka',
  wpApiUrl: import.meta.env.VITE_WP_API_URL ?? 'http://localhost:8080/wp-json',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false',
} as const
