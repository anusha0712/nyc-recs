<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

> Next.js 16 gotchas that bit us: `params`/`searchParams` in pages are **Promises** — `await` them.
> `next/dynamic` with `ssr: false` is **not** allowed in Server Components — wrap client-only libs
> (Leaflet) in a `'use client'` component and dynamic-import there.

# The Daily Waddle 🐧📰 — NYC Trip Recs & Itinerary

A bright, maximalist, mobile-first web app gifting a curated NYC guide + 4-day itinerary builder to
friends visiting New York for the summer. Built as a personal present. Deployed on Vercel.

## The vibe

**NYC-summer print-editorial / newsstand-tabloid magazine** called *The Daily Waddle*. Think: a bold
masthead, halftone photos, torn-paper collage, tape strips, rubber stamps, huge headline type — but kept
**bright and maximalist** with a full NYC-summer color palette (not plain newsprint black & white).

Penguins are a **recurring motif only** (cover mascot, "BEEN THERE" stamp), never the overall theme.

## Locked decisions

- **Hours/data:** Hand-curated static data per place (`data/places.ts`) + a "View on Google Maps" deep
  link as a live-hours backup. An **"Open now"** badge is computed client-side from curated hours in the
  `America/New_York` timezone.
- **Saving:** Local device only (`localStorage`, no login/accounts) + a **share link** encoding the
  itinerary into a URL. **No backend, no database, no auth, no API keys.**
- **Features:** browse recs, per-place hours, personal notes ("Editor's Note"), 4-day itinerary builder,
  menu/website links, map view, filters & tags, cuisine info, "Been there" check-off (penguin stamp +
  confetti), share link + calendar export (.ics / Google Calendar).
- **Cover photo:** `public/friends-cover.jpg` (the two friends this is made for).

## Design system

### Palette (Tailwind theme tokens in `app/globals.css`)
Base: **newsprint cream** `#f7f1e1` background, **ink** `#141210` text. Accents (use maximally,
collage-style): **taxi** `#ffcf24`, **hot red** `#ff3b2f`, **hot pink** `#ff4d9d`, **park** `#1fa562`,
**sky** `#2ea6e6`, **grape** `#6b4bd6`. Token names: `bg-cream text-ink bg-taxi bg-hotred bg-hotpink
bg-park bg-sky bg-grape` (+ text-/border- variants). Prefer tokens over raw hex.

### Type (next/font/google)
- **Display / masthead:** `Anton` → `font-display` (fat condensed, LOUD, often uppercase, tight tracking).
- **Serif accents:** `Fraunces` → `font-serif`.
- **Body / captions:** `DM Mono` → `font-mono` (typewriter feel).

### Texture & motif
Halftone dots, torn-paper edges, tape strips, rubber-stamp outlines, ticket stubs, price bursts, dashed
"cut here" lines. Utility classes in `globals.css`: `.paper .halftone .tape .stamp .torn`.

### Motion
Playful hover/tap (slight rotate/scale, pinned-clipping feel), confetti on "Been there". **Always**
respect `prefers-reduced-motion`.

### Mobile-first
Single column by default. Sticky bottom **MobileNav** (Cover · Recs · Itinerary · Map), ≥44px tap
targets. Test at 390px width first, enhance upward.

## Architecture / conventions

- Routes: `/` Cover · `/recs` grid+FilterBar · `/place/[id]` article · `/itinerary` 4-day dnd builder ·
  `/map` Leaflet (client-only).
- **Data:** `data/places.ts` exports `PLACES: Place[]`, the `Place` type, and derived filter lists
  (`NEIGHBORHOODS`, `CUISINES`, `CATEGORIES`). Single source of truth; components stay presentational.
- **Libs:** `lib/hours.ts` (`isOpenNow`, `nextChange`), `lib/storage.ts` (`useLocalStorage` + itinerary/
  beenThere hooks), `lib/share.ts` (encode/decode itinerary ⇄ URL), `lib/ics.ts` (`.ics` + Google Cal URLs).
- **State:** client components + `localStorage`, keys namespaced `dailywaddle:` (e.g.
  `dailywaddle:itinerary`, `dailywaddle:beenThere`). Guard SSR before touching `window`.

## Place data model (`data/places.ts`)

```ts
export type Category = 'food' | 'coffee' | 'drinks' | 'sight' | 'museum' | 'shopping' | 'park'
export type DayHours = { open: string; close: string } | 'closed'  // 24h "HH:MM", NY time
export type Day = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun'

export type Place = {
  id: string                 // kebab-case slug, STABLE (used in localStorage + share URLs)
  name: string
  neighborhood: string
  category: Category
  cuisine?: string           // food/drinks only
  tags: string[]
  priceLevel: 1 | 2 | 3 | 4
  penguinRating: number      // 1–5, author's rating
  coords: { lat: number; lng: number }
  hours: Record<Day, DayHours>
  suggestedTimeMins?: number
  reservationNeeded?: boolean
  website?: string
  menuUrl?: string
  googleMapsUrl: string
  photo?: string
  authorNote: string         // personal "Editor's Note"
}
```

### Adding a place
Append a `Place` to `PLACES`. `id` unique + stable. Fill all 7 `hours` days (`'closed'` when shut).
`coords` power the map. Keep `authorNote` in the author's real voice.

## Commands
`npm run dev` · `npm run build` (run before deploy) · `npm run lint` · deploy `vercel` / `vercel --prod`.

## Verification
Walk all 5 screens at 390px. Open-now matches NY time. Been-there + itinerary persist across reload.
Share link round-trips in incognito. `.ics`/Google Cal export opens. Map pins render + filter. Respect
`prefers-reduced-motion`.
