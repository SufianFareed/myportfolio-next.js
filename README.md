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

## Invoice generator (`/tools/invoice-generator`)

A fully client-side invoice maker. Nothing is uploaded; everything is stored in the visitor's own browser.

- **Editor:** business details and logo, client details, line items (qty, unit price, per-line discount), percentage and fixed discounts, tax, extra fees, amount paid, optional payment details, notes and terms.
- **Calculations:** done in integer minor units (paisa/cents) so totals never drift. Subtotal - discounts + tax + fees = total; total - paid = balance due.
- **Templates:** Modern Blue, Minimal B&W, Elegant, with an accent colour picker. Switching templates never loses data.
- **PDF:** `jsPDF` + `jspdf-autotable` draw real, selectable text on A4 and paginate long invoices (table header repeats, totals stay together). It is loaded only when you click Download or Print.
- **Actions:** save / load / edit / duplicate / delete, mark as paid, clear form, reset to sample data, copy summary, share by email or WhatsApp (summary text only, the PDF is not attached automatically).
- **Dashboard:** counts and outstanding / collected amounts per currency. Drafts never count as revenue or outstanding.
- **Storage keys (localStorage):** `sf-invoice:profile:v1`, `sf-invoice:draft:v1`, `sf-invoice:history:v1`.

Code layout: `lib/invoice/*` (calculation, validation, storage, PDF, share) and `components/tools/invoice/*` (UI). Add a template by extending `TEMPLATES` in `lib/invoice/constants.js`, the header/table branch in `lib/invoice/pdf.js`, and the `.inv-paper--<id>` styles in `app/globals.css`.

Known limits: PDF fonts are the built-in Latin set, so Urdu/Arabic/emoji text shows as `?` in the PDF (the editor warns you). Business details apply to all invoices; they are not snapshotted per invoice.
