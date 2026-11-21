# Tech project journal — starter

A lightweight, responsive static frontend prototype: dark technical theme, cursor glow, project cards, blog feed, and an offline service-worker shell cache.

## What works now
- Responsive visual layout and cursor-following glow.
- Demo project cards and blog posts (replace placeholder content in `index.html`).
- Basic PWA shell caching; pages/assets previously visited may be available offline.

## Not connected yet (requires setup)
- Secure owner-only login.
- Database-backed publishing and project categories.
- Real email subscriptions and newsletter delivery.

**This prototype has no real authentication or newsletter endpoint. Do not treat `login.html` as a secure login.**

## Recommended secure production architecture
Use a managed backend such as Supabase:
1. Create a Supabase project.
2. Enable Supabase Auth; create your owner account yourself in the provider dashboard (do not place a password in this repository).
3. Enforce single-owner access using server-side authorization and Row Level Security (RLS). Never rely on a hidden UI/admin link to secure writes.
4. Keep the anon/public key in frontend only (it's intended to be public); protect data with RLS. Keep service-role keys and mail-provider secrets server-side only.
5. Store posts and project metadata in Postgres. Public visitors can read published posts; only the owner identity can create/edit/delete.
6. For subscriptions, add a server-side endpoint or Supabase Edge Function that validates email, stores consent, and calls an email provider (Resend, etc.) with API keys stored as server secrets. Add confirmation/unsubscribe handling and privacy policy.
7. For offline reading, cache public post content and static assets; never cache admin routes, auth responses, private data, or API credentials. Consider adding a visible “Save for offline” control and test browser storage limits.

## Deploy
This static demo can be hosted on any static host. HTTPS is required for service workers. For production auth/admin and subscriptions, deploy with a backend/functions-capable host and implement the items above first.

## Files
- `index.html`: demo homepage/feed
- `login.html`: intentionally non-functional login placeholder
- `css/site.css`: style and cursor glow
- `js/site.js`: glow, year, placeholder subscribe feedback
- `sw.js`: static asset cache for offline shell
- `manifest.webmanifest`: PWA metadata
