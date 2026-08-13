# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML/CSS/JS (existing codebase), Vercel serverless functions for API. No framework migration.

## Users

**Primary:** General users needing media download (TikTok, YouTube, Instagram, Facebook), image enhancement, and utility tools.

**Secondary:** Creators — batch download, media management, format conversion, quality selection.

**Tertiary:** Developers — API proxies (ImgBB, ExsalAPI, media download), base64/JSON/color/unit converters, URL shortener, weather/news data.

**Situation:** Mobile-first usage, quick task completion, low friction. No accounts, no paywalls.

**Job:** Get media/utility result in <10 seconds, minimal clicks, works on any device.

## Product Purpose

Leoo Tools is a free, no-login web toolbox that aggregates media download (multi-platform, multi-resolution), image enhancement, upload proxy, and developer utilities behind a single fast interface. Success = user gets their file/data and leaves satisfied, returns for next task.

## Positioning

Unlike single-purpose downloaders or ad-cluttered aggregators, Leoo Tools combines **media download + enhancement + upload + dev utilities** in one performant, mobile-first PWA-ready shell with zero tracking, zero auth, and a unified CSRF-protected API layer. The "toolbox" metaphor is literal: every tool is a first-class citizen, not an afterthought.

## Operating Context

- **Entry:** Direct URL, search, or shared link → tool page.
- **Flow:** Paste link / input → preview (thumb, meta, stats) → select quality/format → download via proxy → toast confirmation.
- **API layer:** Vercel serverless functions (`/api/download`, `/api/enhance`, `/api/imgbb`, `/api/token`) with origin whitelist + HMAC-SHA256 CSRF (5-min window) + in-memory rate limit.
- **External deps:** siputzx.my.id (media metadata), exsalapi.my.id (AI enhance), api.synoxcloud.xyz (weather/news), api.imgbb.com (upload).
- **Performance modes:** Entry / mid / high based on device cores, memory, reduced-motion, save-data.
- **Splash:** Animated loading with performance-adaptive duration.
- **No backend state:** All client-side; tokens ephemeral.

## Capabilities and Constraints

**Confirmed:**
- Media download: TikTok, YouTube, Instagram, Facebook (video + audio, multi-res, best badge)
- Image enhance: ExsalAPI proxy with download mode
- ImgBB upload: multipart proxy, returns direct link
- Utilities: weather, news, base64, color, password, unit, URL shortener, JSON formatter, counter, digital clock, image analyzer
- CSRF token auto-refresh (4.5 min interval)
- Toast system (success/error/warning, max 3)
- Progress indicator with crawl animation
- Responsive: mobile-first, desktop sidebar layout

**Constraints:**
- Must keep Vercel serverless function signatures unchanged
- CSRF secret via env var (`CSRF_SECRET`), ImgBB key via env (`IMGBB_KEY`)
- Origin whitelist hardcoded in each API (production domain + localhost)
- Domain whitelist for media download (tiktok.com, googlevideo.com, fbcdn.net, etc.)
- No database, no auth, no user accounts
- Static assets served from repo root
- `style.css` + `perf.css` + inline critical CSS in HTML
- `core.js` loads all tools dynamically via templates

**Undecided:**
- PWA manifest / service worker
- Analytics / telemetry
- Dark/light theme toggle (currently dark-only)
- Internationalization beyond Indonesian

## Brand Commitments

**Name:** Leoo Tools Pro (from `<title>`)
**Voice:** Indonesian dominant, technical but accessible, terse, no marketing fluff.
**Visual identity:** **Delegated to designer** — no existing logo, palette, typography, or motion language committed. Full creative freedom for new visual world in new-work phase.
**Assets on hand:** Favicon (`wmremove-transformed.jpeg`), Inter font (likely via CSS), custom SVG icon set in `mediadownload.js`.

## Evidence on Hand

- Working production codebase (Vercel-deployable)
- All tools functional with live API integrations
- Real user flows implemented (paste → preview → select → download)
- Performance adaptation logic in HTML inline script
- Splash animation with device-tier adaptation
- Toast, progress, error handling patterns established
- **Absences (must not fabricate):** testimonials, case studies, press, benchmarks, pricing, team photos, company info.

## Product Principles

1. **Zero friction, zero trust required** — no login, no tracking, no dark patterns. User pastes, gets result, leaves.
2. **Mobile-first, desktop-comfortable** — thumb-zone targets, readable at 320px, sidebar density at 1440px.
3. **Performance as a feature** — adaptive tiering, critical CSS inline, lazy-load non-critical, cancel animations on low-end.
4. **Toolbox honesty** — every tool works or shows honest error; no placeholder UIs, no "coming soon" cards.
5. **Developer-transparent** — CSRF and rate limits visible in code; API contracts stable; easy to self-host or extend.

## Accessibility & Inclusion

- Reduced-motion respected (entry tier forces minimal animation)
- Save-data respected (entry tier)
- Semantic HTML, ARIA labels on interactive elements (to be audited)
- Color contrast: current dark theme needs verification
- Indonesian language primary; English tech terms preserved
- Touch targets ≥44px (to be verified)