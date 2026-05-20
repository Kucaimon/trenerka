import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/i18n'
import './index.css'
import App from './app/App.tsx'
import { RootProviders } from '@/app/root-providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootProviders>
      <App />
    </RootProviders>
  </StrictMode>,
)
