# Sufian Fareed — Portfolio (Next.js)

Dark, developer-inspired portfolio built with Next.js App Router, now
with a headless WordPress blog and a growing collection of free tools.

## What's in this pass

- **Blog** (`/blog`): pulls posts from a headless WordPress install via
  the WP REST API. Point `NEXT_PUBLIC_WP_API_URL` at your WordPress
  domain (currently the temporary Hostinger URL) — no other code changes
  needed when you switch to the real domain later. Posts are cached and
  revalidated hourly (ISR). If WordPress is unreachable or has no posts,
  the page shows a friendly empty state instead of erroring.
- **Tools** (`/tools`): a listing page plus one live tool so far —
  **Gig SEO Score** (`/tools/gig-seo-score`), a Fiverr gig checker
  converted from your standalone HTML file into a React component
  restyled to match the site's dark theme. All scoring runs client-side;
  nothing typed into it is sent anywhere.
- **Navigation**: now aware of which page you're on. "Blog" and "Tools"
  are real routes; the rest of the tabs (Home, About, Skills, etc.) link
  back to homepage sections and still track scroll position when you're
  on the homepage.
- **Layout**: Navbar, Footer, and the floating WhatsApp button moved into
  the root layout so they're consistent across the homepage, blog, and
  tools pages.
- **Sitemap**: now dynamically includes `/blog`, `/tools`, every tool
  page, and every WordPress post slug.
- **Favicon**: `app/icon.svg` — a `<SF/>` mark matching the navbar logo,
  picked up automatically by Next.js.

## Adding more tools later

1. Add an entry to `data/tools.js` (slug, title, description, category, icon).
2. Create `app/tools/<slug>/page.js` with its own metadata, importing a
   client component from `components/tools/` that holds the actual logic.
3. That's it — the `/tools` index and the sitemap pick it up automatically.

## Project structure

```
app/
  layout.js, page.js, globals.css, sitemap.js, robots.js, icon.svg
  api/contact/route.js
  blog/page.js, blog/[slug]/page.js
  tools/page.js, tools/gig-seo-score/page.js

components/
  Navbar.js, Hero.js, TypedStatus.js, About.js, Skills.js,
  Projects.js, ProjectCard.js, Experience.js, Services.js,
  HowIWork.js, Contact.js, Footer.js, WhatsAppButton.js, ScrollReveal.js
  tools/GigSeoScoreTool.js

data/
  projects.js, services.js, skills.js, experience.js, process.js, tools.js

lib/
  site.js     → site config + getWhatsAppUrl() helper
  wordpress.js → WP REST API helpers (fail-soft)
  gigSeoScore.js → pure scoring logic for the Gig SEO Score tool
```

## Environment variables

- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WP_API_URL` — your headless WordPress domain (no trailing
  slash), e.g. the current temporary Hostinger URL. Update this one
  variable when you connect your real domain later.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

## Deploying

Push to GitHub, import into Vercel, add the five environment variables
above in Settings → Environment Variables, then deploy.
