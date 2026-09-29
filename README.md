# BR Tours and Travels public frontend

Independent Next.js 16 App Router website backed entirely by the Express API.
It has its own package.json, package-lock.json, npm installation and local
environment file. Nothing must be installed at workspace root.

`vercel.json` keeps server rendering in Mumbai near the API and database.
Public API results are shared within each render, including package metadata
and detail content. All public content pages, the sitemap and editable API
responses use a 30-second revalidation interval. The root layout supplies this
default for new pages too. Once cached content is older than 30 seconds, the next
request triggers a background refresh; subsequent visitors receive the refreshed
content. This is request-driven regeneration, not a scheduled full-site build or
an automatic browser reload. Query-driven listings still render per request and
reuse the 30-second API cache; development bypasses caching. Package and gallery
images come from admin-selected media, including Char Dham packages;
hardcoded image additions no longer override those selections.
Gallery's package selector uses `/api/v1/package-options` instead of downloading
complete package cards. Deploy the matching API before this frontend version.

The UI uses Tailwind CSS 4 through the official PostCSS integration.
`src/app/globals.css` is the single color/theme source: it defines the complete
BR palette, semantic Tailwind utilities, focus/status/surface tokens, radii and
shadows. Named component classes consume those variables on top of utilities.

## Environment

- Copy `.env.example` to the ignored `.env.local` and set the API URL there.
- `INTERNAL_API_BASE_URL` is the server-side API URL ending in `/api/v1`.
  It also supplies the same-origin API and media proxy target.
- Vercel supplies the canonical production domain through its
  `VERCEL_PROJECT_PRODUCTION_URL` system variable. Local builds use
  `http://localhost:3000`. Browser requests use the same-origin `/api/v1` path.

Set `INTERNAL_API_BASE_URL` in the hosting environment for deployment. The
Vercel project must expose system environment variables. For self-hosting,
provide `VERCEL_PROJECT_PRODUCTION_URL` with the public hostname. Keep API
credentials, database, session and SMTP values out of this frontend.

## Implemented routes

- `/` finite CMS-section homepage with live catalogue, gallery, journal, FAQ,
  testimonial and configured-contact content.
- `/about-us`, `/privacy`, `/terms` and `/cancellation-policy` CMS pages.
- `/packages` API search/filter/sort/pagination with URL-restorable state.
- `/packages/[slug]` published detail, lightbox, itinerary, departures,
  brochure, related packages and persisted enquiry/booking-request form.
- `/gallery` database albums/filters and keyboard-accessible lightbox.
- `/contact-us` configured details and idempotent persisted contact form.
- `/blog` and `/blog/[slug]` published journal listing/detail.
- Published-only sitemap, robots, metadata, structured data, 404, loading,
  empty, missing-content and backend-outage states.

## Commands

    npm install
    npm run dev
    npm run lint
    npm run typecheck
    npm run build
    npm start

Start the development API on port 4000 before browsing locally. API failures
render honest retry states; static offer data never replaces failed live data.

The production horizontal logo lockup is public/br-logo.png.

## Package and blog build resilience

Package and blog detail routes return an empty `generateStaticParams` list and
allow new slugs at runtime. Their first visit generates the page from the live API;
subsequent visits use the same 30-second revalidation policy as other public pages.
A failed detail request cannot fail the frontend build. Metadata, the package
loading skeleton, redirects and not-found handling are retained.

`INTERNAL_API_BASE_URL` must still point to a reachable API at runtime (including
`/api/v1`). Runtime outages continue to use the retry/error UI; they are not treated
as missing packages or replaced with fabricated content.

Run `npm run test:build-outage` to test a Vercel-style production build against a
local mock API with healthy listings and unavailable detail endpoints. It then
checks live package/blog pages after recovery, including a newly added slug.
The test uses the ignored `.next-build-check` output and does not contact the
real API or modify the database.
