# sophiepaulussen.com

Portfolio site for Sophie Paulussen. Astro (static output), React islands, Tailwind CSS, MDX case studies. Deploys to Vercel.

Search the repo for `[TODO:` to find every placeholder that still needs real content.

## Run locally

You need Node 22.23.4 or newer (Node 24 LTS recommended).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build into dist/
npm run preview    # serve the production build
npm run check      # type check
```

## Where content lives

| What | File |
| --- | --- |
| Name, email, social links, location, languages | `src/content/site.json` |
| Case studies (one file each) | `src/content/cases/*.mdx` |
| Case hero images | `src/assets/cases/<slug>-hero.png` |
| Tool stack (home page) | `src/content/tools.json` (display order = file order) |
| Content schemas (field rules) | `src/content.config.ts` |
| Home page copy (hero, CTA) | `src/components/Hero.astro`, `src/pages/index.astro` |
| Proof strip numbers | `src/components/ProofStrip.astro` |
| Real work strip (Phagenesis, SP Consulting) | `src/components/RealWorkStrip.astro` |
| About, AI, Contact pages | `src/pages/about.astro`, `src/pages/ai.astro`, `src/pages/contact.astro` |
| OG image titles for non-case pages | `src/lib/pages.ts` |
| Colors, type scale, buttons, chips | `src/styles/global.css` |
| Fonts | `astro.config.mjs` (`fonts`) |

### Case study fields

Each MDX file starts with frontmatter that the schema checks at build time:

- `title`: outcome-led headline, used as the H1 and card title.
- `slug`: the URL, `/work/<slug>`.
- `order`: position in lists. Concept cases appear under Selected work on the home page in this order. The real Phagenesis case uses `99`.
- `type`: `concept` or `real`. Concept cases show the accent tag "Concept project · Fictional company · Real market data".
- `status`: `in-progress` (shows a small "In progress" label) or `live`.
- `summary`: max 160 characters. Used on cards and as the meta description.
- `thirtySecond`: exactly three bullets.
- `stats`: `time`, `skills`, `tools` (first three show as chips on cards), `output`.
- `heroImage`, `heroAlt`: path to the image and its alt text.
- `heroDemo` (optional): name of a React demo that replaces the hero image. See below.
- `demoUrl`, `loomUrl`, `repoUrl` (optional): each button only shows when its URL is set.
- `roles`, `publishedAt`.

The body of the MDX file holds the collapsible sections. Each one is a `<CaseSection title="...">` block (native `<details>`, no JavaScript). You do not need to import `CaseSection` or `ChartFrame`; they are available in every case file.

Rules for concept cases:

- Never show result metrics. Stats describe effort and output only.
- Wrap every chart in `<ChartFrame title="...">`. It always shows the label "Synthetic data, illustrative only" unless you pass `real={true}`, which you should only do on a real case with real data.

## Add a new case

1. Copy an existing file in `src/content/cases/` and rename it `<your-slug>.mdx`.
2. Update the frontmatter (`title`, `slug`, `order`, `summary` and so on).
3. Create a placeholder hero image, or drop in the real one at the same path:

   ```bash
   node scripts/make-placeholder.mjs your-slug
   ```

   This writes `src/assets/cases/your-slug-hero.png`. Point `heroImage` at `../../assets/cases/your-slug-hero.png`.
4. Fill in the sections. Run `npm run build`; the schema will tell you if a field is missing or too long.

The case page, its OG image, its sitemap entry and the previous/next links are generated automatically.

## Replace a placeholder image

Overwrite `src/assets/cases/<slug>-hero.png` with the real image (keep the filename, or update `heroImage`). Any size works; 1600x1000 or larger at 16:10 looks best. Astro resizes it to WebP with width and height set. Update `heroAlt` to describe the new image.

Images live in `src/assets` rather than `public/` so that Astro can optimize them.

## Swap a hero image for a React demo

Interactive parts are React islands. Everything else ships with no JavaScript.

1. Build the component in `src/components/demos/`, for example `ScoringCalculator.tsx`. `ExampleDemo.tsx` shows the pattern.
2. Register it in `src/components/HeroDemo.astro`:

   ```astro
   import ScoringCalculator from './demos/ScoringCalculator';
   const known = ['example', 'scoring-calculator'];
   ...
   {name === 'scoring-calculator' && <ScoringCalculator client:visible />}
   ```

3. In the case MDX frontmatter, add `heroDemo: scoring-calculator`. The demo now replaces the hero image. Keep `heroImage` set; it is still required and is used if you remove `heroDemo`.

Demos are listed by name because Astro needs the `client:visible` directive written in an `.astro` file.

You can also place a React component anywhere inside the MDX body:

```mdx
import ScoringCalculator from '../../components/demos/ScoringCalculator';

<ScoringCalculator client:visible />
```

## SEO

- Title pattern: `{Page} · Sophie Paulussen, Marketing Ops and Lifecycle`. The home page has its own title. See `src/components/Seo.astro`.
- Canonical URLs use `https://sophiepaulussen.com` (set as `site` in `astro.config.mjs`), without trailing slashes.
- Open Graph images are generated at build time by `src/pages/og/[slug].png.ts` (satori and sharp), one per page, at `/og/<slug>.png`.
- JSON-LD: `Person` on the home page, `CreativeWork` on each case.
- `sitemap-index.xml` is generated by `@astrojs/sitemap`. `public/robots.txt` points to it.

## Analytics

Vercel Web Analytics with custom events, wired in `src/components/Analytics.astro`:

| Event | Fires when | Properties |
| --- | --- | --- |
| `case_open` | A case page loads | `slug` |
| `demo_click` | "Open live demo" is clicked | `slug` |
| `loom_click` | "Watch 2-min Loom" is clicked | `slug` |
| `repo_click` | "View repo" is clicked | `slug` |
| `email_click` | Any email link is clicked | `location` |

To track a new click, add `data-event="event_name"` to the element. Any `data-event-*` attribute becomes a property, e.g. `data-event-location="footer"`. Update the tracking plan table on `/ai` (`src/pages/ai.astro`) when you add events.

Analytics only runs on Vercel. Locally you will see a harmless 404 for `/_vercel/insights/script.js` in the console. Custom events need a Vercel plan that includes them.

## Deploy on Vercel

1. Import the GitHub repository in Vercel. It detects Astro automatically (build command `npm run build`, output `dist`).
2. In the project settings, open Analytics and enable Web Analytics.
3. Add the domain `sophiepaulussen.com` under Domains.

Every push to `main` deploys to production. Pull requests and other branches get preview URLs.

`vercel.json` only sets `trailingSlash: false`, so `/about/` redirects to `/about`, matching the canonical URLs.
