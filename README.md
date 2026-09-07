# BR Tours and Travels public frontend

Independent Next.js 16 App Router website backed entirely by the Express API.
It has its own package.json, package-lock.json, npm installation, environment
files, tests and build output. Nothing must be installed at workspace root.

The UI uses Tailwind CSS 4 through the official PostCSS integration.
`src/app/globals.css` is the single color/theme source: it defines the complete
BR palette, semantic Tailwind utilities, focus/status/surface tokens, radii and
shadows. Named component classes consume those variables on top of utilities.

## Environment

- `.env.local` owns local development values.
- `.env.test` owns the isolated Playwright ports.
- `.env.production.example` documents the production shape.

`INTERNAL_API_BASE_URL` is server-only and is used for SSR.
`NEXT_PUBLIC_API_BASE_URL` remains `/api/v1` for browser calls.
`API_PROXY_TARGET` exists only for local same-origin rewrites. Database, session
and SMTP values never belong in this project.

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
    npm test
    npm run build
    npm start
    npm run test:e2e

`npm run test:e2e` builds/starts the API on port 4100 against guarded
`br_tours_test`, seeds demo fixtures, starts an isolated Next server on 3100 and
runs one Chrome worker. It verifies URL filters, live CMS/blog/contact/gallery
updates, keyboard lightbox/mobile menu behavior and exactly one persisted
enquiry/outbox event.

Start the development API on port 4000 before browsing locally. API failures
render honest retry states; static offer data never replaces failed live data.

The production horizontal logo lockup is public/br-logo.png.
