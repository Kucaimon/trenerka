import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthHydrator } from '@/components/auth/AuthHydrator'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator />
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        toastOptions={{
          classNames: {
            toast: '!bg-[var(--surface)] !border-[var(--border)] !text-[var(--text-primary)] !shadow-[var(--shadow-soft)]',
            title: '!text-[var(--text-primary)]',
            description: '!text-[var(--text-secondary)]',
            success: '!border-[var(--accent)]/40',
            error: '!border-[var(--danger)]/40',
          },
        }}
      />
    </QueryClientProvider>
  )
}
