/**
 * PostHog setup. Reads the project token from the environment and initializes
 * the client once. `defaults: '2026-05-30'` turns on autocapture, `$pageview`,
 * and `$pageleave`, so navigation is tracked without any per-page code.
 *
 * A missing token never breaks the app: development throws so the gap is
 * obvious, production stays a silent no-op.
 */

import posthog from 'posthog-js'

const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const apiHost = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'

if (token) {
  posthog.init(token, {
    api_host: apiHost,
    defaults: '2026-05-30',
  })
} else if (import.meta.env.DEV) {
  throw new Error(
    'VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured',
  )
}

export { posthog }
