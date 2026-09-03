# Sufian Fareed — Portfolio (Next.js)

A production-ready Next.js rebuild of the original static portfolio, keeping
the same dark, code-editor-inspired visual design while adding real
functionality: a filterable project grid, a working contact form, a
WhatsApp button, and full SEO metadata.

## What changed from the static version

- Converted the static HTML/CSS/JS site into a Next.js 15 app using the
  App Router.
- Split the page into reusable components (`Navbar`, `Hero`, `About`,
  `Skills`, `Projects`, `ProjectCard`, `Experience`, `Services`, `Contact`,
  `Footer`, `WhatsAppButton`) instead of one long HTML file.
- Moved content into data files (`data/projects.js`, `data/services.js`,
  `data/skills.js`, `data/experience.js`) so you can edit content without
  touching component code.
- Repositioned your professional focus around **WordPress, Shopify, and
  Next.js / custom web development** as the three primary specialties —
  these get the highlighted "accent" styling in the Skills section, while
  React, Node.js, Nest.js, Angular.js, PHP, etc. are shown as supporting
  skills.
- Added technology filter tabs (All / WordPress / Shopify / Next.js &
  Custom) to the projects section, backed by a `category` field on each
  project in `data/projects.js` — adding a new project is just adding one
  object to that file.
- Built a real contact form: client-side validation, a loading state,
  duplicate-submission prevention, and success/error messaging, wired to a
  secure API route (`app/api/contact/route.js`) that sends email through
  [Resend](https://resend.com). The API key never touches the browser.
- Added a floating WhatsApp button (bottom-right) with your number and a
  pre-filled message, opening in a new tab.
- Added full SEO: page metadata, Open Graph and Twitter Card tags, a
  canonical URL, `robots.txt`, and `sitemap.xml`, all generated through the
  Next.js Metadata API and driven by `lib/site.js` so you can update them
  in one place once you have a domain.
- Switched fonts to `next/font` (Space Grotesk, Inter, JetBrains Mono) so
  they're self-hosted and don't block rendering.
- Used `next/image` for project thumbnails for automatic optimization and
  lazy loading.
- Server Components are used by default throughout; `"use client"` is only
  added where interactivity is needed (Navbar, Projects filter, Contact
  form, WhatsApp button, the hero's typing effect, and the scroll-reveal
  wrapper).

Nothing structural like authentication, a database, or a dashboard was
added — this stays a straightforward, fast portfolio site.

## Project structure

```
app/
  layout.js          → root layout, fonts, global SEO metadata
  page.js             → assembles all sections
  globals.css         → all design tokens and styles
  sitemap.js          → generates /sitemap.xml
  robots.js           → generates /robots.txt
  api/
    contact/
      route.js         → POST handler that sends email via Resend

components/
  Navbar.js
  Hero.js
  TypedStatus.js       → typing animation used inside Hero
  About.js
  Skills.js
  Projects.js          → filter tabs + grid (client component)
  ProjectCard.js
  Experience.js
  Services.js
  Contact.js            → form + validation + API call
  Footer.js
  WhatsAppButton.js
  ScrollReveal.js       → shared scroll-in-view animation wrapper

data/
  projects.js          → all project content + categories
  services.js
  skills.js
  experience.js

lib/
  site.js              → site name, URL, keywords, WhatsApp number, socials

public/
  images/              → put your own project screenshots here if you'd
                          rather not use the Unsplash placeholders
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable               | Description                                                        |
|-------------------------|---------------------------------------------------------------------|
| `RESEND_API_KEY`        | Your API key from resend.com                                        |
| `CONTACT_EMAIL`         | The inbox that should receive contact form messages                |
| `RESEND_FROM_EMAIL`     | The "from" address — use `onboarding@resend.dev` until you verify your own domain on Resend |
| `NEXT_PUBLIC_SITE_URL`  | Your site's public URL, used in metadata, sitemap.xml, and robots.txt |

The contact form will return a clear error instead of crashing if these
aren't set yet.

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in the values above
npm run dev
```

Open http://localhost:3000.

To build and run the production build locally:

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), click **New Project**, and
   import the repo.
3. In the project's **Settings → Environment Variables**, add the four
   variables listed above (use your real domain for
   `NEXT_PUBLIC_SITE_URL` once you have one — Vercel gives you a
   `.vercel.app` URL by default, which works fine too).
4. Deploy. Vercel auto-detects Next.js, so no extra build configuration is
   needed.
5. After deploying, visit `/sitemap.xml` and `/robots.txt` on your live
   URL to confirm they're generated correctly.

## Customizing content

- **Projects**: edit `data/projects.js`. Each project needs a `category`
  of `"wordpress"`, `"shopify"`, or `"nextjs"` — the filter tabs pick it up
  automatically.
- **Services**: edit `data/services.js`.
- **Skills**: edit `data/skills.js`. Set `primary: true` on a skill to give
  it the highlighted accent style.
- **Experience / timeline**: edit `data/experience.js`.
- **Site name, URL, keywords, WhatsApp number, social links**: edit
  `lib/site.js`.
- **Colors, spacing, fonts**: all design tokens are CSS variables at the
  top of `app/globals.css` under `:root`.
- **Images**: replace the Unsplash URLs in `data/projects.js` with your own
  image paths (e.g. `/images/eduker.jpg`) after adding files to
  `public/images/`.
