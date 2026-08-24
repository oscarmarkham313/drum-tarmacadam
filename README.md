# Dublin Growth Digital — v2

Next.js App Router · TypeScript · Tailwind · Framer Motion. Deploys to Vercel.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Editing content

- **All copy** — `config/copy.ts` (every string on the site)
- **Case studies** — `config/case-studies.ts` (niche: `estate-agencies` | `trades` | `service-businesses` | `other`)
- **Design tokens** — `lib/tokens.ts` (colours, easing; consumed by Tailwind and Remotion)

## Hero video

Drop your clips into `public/hero/`:

- `hero.webm` and `hero.mp4` — muted loop, keep under ~4MB, 1920×1080 is plenty
- `poster.jpg` — the static frame (mobile shows only this)

The player lazy-loads after first paint, desktop-only, and degrades to the
plain background if the files are missing.

## Analytics

Copy `.env.example` to `.env` and set real IDs. Snippets don't load while the
IDs are placeholders.

## Remotion (social assets)

Separate project — not part of the site build:

```bash
cd remotion
npm install
npm run studio            # preview
npm run render            # renders out/stat-card.mp4
```

One template so far: `StatCard` (1080×1350). Uses the same design tokens as
the site via `remotion/src/tokens.ts`.

## Deploying

Push to GitHub, import the repo in Vercel (framework auto-detects). Then point
the `dublingrowthdigital.com` domain at Vercel and retire the GitHub Pages
deployment (the old static site lives in `legacy/`). The `CNAME` file at the
repo root belongs to GitHub Pages and can be deleted once the domain has moved.
