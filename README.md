# Sufian Fareed — Portfolio (Next.js)

A conversion-focused rebuild of the portfolio, keeping the original dark
developer-inspired visual identity while sharpening the content,
navigation, and calls to action around WordPress, Shopify, and Next.js
work.

## What changed in this pass

- Rewrote the copy across Hero, About, Services, and Experience in a
  plainer, more natural tone, positioned consistently around "WordPress,
  Shopify and Next.js Developer."
- Simplified navigation labels (Home, About, Skills, Work, Experience,
  Services, Process, Contact) instead of fake file extensions, while
  keeping the terminal-tab visual style.
- Hero now leads with a clear "Discuss Your Project" WhatsApp CTA and a
  secondary "View My Work" CTA, plus a trust line (7+ years, clients in
  Pakistan and abroad).
- Reorganized Skills into two tiers: Primary Expertise (WordPress,
  Shopify, React, Next.js, Elementor, WooCommerce, Shopify Liquid) and
  Supporting Skills (everything else), so the primary focus reads clearly
  instead of one flat list.
- Rewrote Services around client value instead of a tech list, with a
  contextual WhatsApp CTA per card (e.g. the Shopify card opens WhatsApp
  with "I need help with a Shopify project" pre-filled).
- Rewrote Experience/timeline using your real background (7+ years,
  Chemplink, the marketplace app proposal, content creation) without
  inventing companies or clients.
- Added a new "How I Work" section with a simple 4-step process.
- WhatsApp is now the primary conversion channel throughout: a floating
  button with a subtle pulse animation, a prominent WhatsApp card in the
  Contact section, and contextual CTAs on Services and Project cards.
- Updated the Contact form's Project Type options to match your real
  service categories (WordPress Website, Shopify Store, Next.js / React
  Project, Other CMS Project, Website Redesign, Maintenance /
  Optimization, Other).
- Added Person structured data (JSON-LD) in the layout for richer SEO,
  alongside the existing Open Graph/Twitter metadata, sitemap, and robots.
- Project cards now show a badge (e.g. "Client Project"), hide the Live
  Demo/GitHub buttons when no real URL exists yet, and show a "Need
  something similar?" WhatsApp CTA instead — no placeholder or fake
  links anywhere.

## Projects section — left to you

As discussed, the Projects data (`data/projects.js`) currently holds only
your two confirmed real projects (Eduker, Chemplink), both without a live
URL since none was provided — the card automatically falls back to a
"Need something similar?" WhatsApp button in that case. Add your own
projects to that file whenever you're ready; each one needs a `category`
of `"wordpress"`, `"shopify"`, `"nextjs"`, or `"other-cms"`, plus an
honest `badge` ("Client Project", "Personal Project", or "Concept
Project"). The filter tabs and grid pick up new entries automatically.

## Project structure

```
app/
  layout.js          → fonts, SEO metadata, Person JSON-LD
  page.js
  globals.css
  sitemap.js
  robots.js
  api/contact/route.js

components/
  Navbar.js, Hero.js, TypedStatus.js, About.js, Skills.js,
  Projects.js, ProjectCard.js, Experience.js, Services.js,
  HowIWork.js, Contact.js, Footer.js, WhatsAppButton.js,
  ScrollReveal.js

data/
  projects.js, services.js, skills.js, experience.js, process.js

lib/
  site.js   → site config + getWhatsAppUrl() helper for contextual CTAs
```

## Environment variables

Same four as before — see `.env.example`:

- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

## Deploying

Push to GitHub and import into Vercel as before. Add the four environment
variables in Vercel's Settings → Environment Variables, then deploy.
