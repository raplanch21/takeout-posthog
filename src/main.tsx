import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'
import './index.css'
import App from './App.tsx'
import { posthog } from './lib/analytics.ts'
import { StoreProvider } from './lib/StoreProvider.tsx'
import { UIProvider } from './lib/UIProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <StoreProvider>
            <UIProvider>
              <App />
            </UIProvider>
          </StoreProvider>
        </BrowserRouter>
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
)
