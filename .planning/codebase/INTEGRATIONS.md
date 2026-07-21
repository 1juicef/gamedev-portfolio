# External Integrations

**Analysis Date:** 2026-07-21

## APIs & External Services

**None — No Backend APIs**

This is a static portfolio site with no backend API calls. All content is static and pre-built at compile time.

**Third-Party Embedded Content:**
- YouTube - Embedded video players in project descriptions via `<iframe>` (URLs: `https://www.youtube.com/embed/L5YWz2i434E`, `https://www.youtube.com/embed/ihPEcIQ_PwI`)
  - Usage: Showcase game project trailers and gameplay in `src/data/GameProjectsData.ts`
  - Client: Standard YouTube embed iframe (no SDK required)

## Data Storage

**Databases:**
- None — Site is entirely static

**File Storage:**
- Local filesystem only - Static assets (images, videos, fonts) served from `public/` directory
- No cloud storage integration (no AWS S3, Cloudinary, etc.)

**Caching:**
- Browser caching via standard HTTP headers (managed by hosting platform or web server)
- No explicit caching layer (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- None — No user authentication system
- Site is public with no login/authorization requirements

## Monitoring & Observability

**Error Tracking:**
- Not configured — No Sentry, Rollbar, or similar service integrated

**Logs:**
- Browser console only — No server-side logging
- No log aggregation or analytics

**Analytics:**
- Not configured — No Google Analytics, Plausible, or similar integrated in codebase (check if added to `public/index.html`)

## CI/CD & Deployment

**Hosting:**
- Static web hosting (likely GitHub Pages based on README reference to deployment guide; could also be Netlify, Vercel, etc.)
- No server-side runtime required

**CI Pipeline:**
- Not detected in codebase — Deployment would be manual copy of `dist/` folder to hosting platform, or via git-based deployment (if using GitHub Pages, Netlify, Vercel)

**Build Process:**
- `npm run build` produces `dist/` folder with production artifacts
- Vue CLI handles minification, code splitting, and asset fingerprinting

## Environment Configuration

**Required env vars:**
- None strictly required for the site to function
- Optional metadata configuration in `.env` (site title, OG metadata placeholders)
- `.env` values are injected at **build time** (not runtime), so changes require running `npm run build` again

**Secrets location:**
- `.env` file present in repository root (not tracked by git if using `.gitignore`)
- No secrets management system (no HashiCorp Vault, AWS Secrets Manager, etc.)

## Webhooks & Callbacks

**Incoming:**
- None — Site does not accept incoming webhooks or form submissions

**Outgoing:**
- None — No outbound webhooks or callbacks

## External Links & References

**Social Media & Platforms:**
- GitHub: `github.com/1juicef` (in `src/views/Contact.vue`)
- GitHub portfolio source: `https://github.com/schouffy/gamedev-portfolio` (in `src/components/Footer.vue`)
- LinkedIn: `linkedin.com/in/josef-ubaka` (in `src/views/Contact.vue`)
- itch.io: `juice-f.itch.io` (in `src/views/Contact.vue`)
- Game links: `yrgo.itch.io/drag-rush`, `yrgo.itch.io/dispater` (in `src/data/GameProjectsData.ts`)

**CDN & Hosted Libraries:**
- Google Fonts - `https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@400;500;700&display=swap` (in `public/index.html`)
- Font Awesome 4.7.0 - `https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css` (in `public/index.html`)
- Placeholder image service (fakeimg.pl) - Used in `src/data/OtherProjectsData.ts` for template projects (not real)

---

*Integration audit: 2026-07-21*
