# Takeout

A demo food delivery web app. Frontend only: no backend and no image hosts. All
app data runs from memory, so the app looks the same offline as it does on stage.
The only network calls send product analytics to PostHog.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Deploy it

The app has a live home so real visits reach PostHog. Every push to `main`
builds the app and publishes it to GitHub Pages through
`.github/workflows/deploy.yml`. The site loads from the `/takeout-posthog/`
subpath, so `vite.config.ts` sets that base for production builds and
`main.tsx` passes the same base to the router.

The workflow needs Pages set to build from GitHub Actions once: open the
repository **Settings → Pages** and set **Source** to **GitHub Actions**. The
public URL is https://raplanch21.github.io/takeout-posthog/.

Other scripts:

```bash
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

## The demo flows

**1. Find something to eat** — Search restaurants by name, cuisine, or dish;
filter by cuisine or free delivery; sort by rating, speed, or fee. Open a
restaurant to see its menu with popular items pulled to the top, then add
dishes and adjust quantities inline.

**2. Order and track it** — Review the cart in the side drawer, choose delivery
or pickup, pick a tip, and pay with a fake card. Placing the order moves you to
a live tracking screen that walks from confirmed to delivered in about 36
seconds, with a moving courier and a countdown.

**3. Reorder** — Order history keeps every order in this browser. Reorder refills
the cart in one tap.

Two details worth demoing: adding a dish from a second restaurant asks before it
replaces your cart, and refreshing the page mid-delivery keeps the correct
progress because status is derived from the order's timestamp.

There's a **Fill demo details** button on checkout so you don't have to type an
address on stage, and **Reset demo data** on the orders screen to get back to a
clean slate.

## How it's built

Vite, React, TypeScript, and plain CSS. No UI or state libraries beyond React
Router.

```
src/
  data/restaurants.ts   Dummy catalog: 8 restaurants with full menus
  lib/
    store.ts            State shape, reducer, contexts, and hooks
    StoreProvider.tsx   Provider that persists state to localStorage
    ui.ts               Cart drawer and toast context
    UIProvider.tsx      Provider for that ephemeral UI state
    tracking.ts         Order timeline stages and time-derived progress
    format.ts           Currency, dates, and card input formatting
    analytics.ts        PostHog client setup
  components/           Header, cart drawer, cards, and other shared pieces
  pages/                Browse, RestaurantMenu, Checkout, TrackOrder, Orders
  index.css             Design tokens and every component style
```

A few conventions to know before editing:

- **Money is whole cents.** Format with `money()` at the edges only, so
  arithmetic stays exact.
- **Cart state is persisted; order status is not.** Status comes from
  `placedAt` plus the stages in `lib/tracking.ts`, which is why a refresh
  doesn't restart the timeline. Change the demo's pacing by editing `startsAt`
  on those stages.
- **One cart, one restaurant**, matching how real delivery apps behave.
- **Food photos are emoji on gradients** (`components/Tile.tsx`), which keeps
  the app dependency-free and offline.

## Analytics

The app sends product analytics to [PostHog](https://posthog.com). `posthog-js`
starts in `src/lib/analytics.ts` and reads its keys from the environment. Copy
`.env.example` to `.env` and fill in your project values, or edit the committed
`.env`. The project token is a public client-side key, so it is safe to ship in
the browser bundle.

PostHog captures page views and clicks on its own. On top of that, the app sends
funnel events: `restaurant_opened`, `dish_added_to_cart`, `checkout_started`,
`order_placed`, and `order_reordered`. A missing token never breaks the app —
development throws so the gap is obvious, and production stays a silent no-op.

## Not included

This is a demo, so there's no auth, no payment processing, no server, and no
tests. Orders live in `localStorage` under `takeout.state.v1` and disappear when
you clear site data.
