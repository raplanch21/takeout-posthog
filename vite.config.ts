import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// The production build ships to a GitHub Pages project site, so its assets load
// from the /takeout-posthog/ subpath. Local dev keeps serving from the root.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/takeout-posthog/' : '/',
  plugins: [react()],
}))
