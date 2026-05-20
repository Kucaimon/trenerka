import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function RootProviders({ children }: { children: ReactNode }) {
  if (clerkPublishableKey) {
    return <ClerkProvider publishableKey={clerkPublishableKey}>{children}</ClerkProvider>
  }
  return children
}
