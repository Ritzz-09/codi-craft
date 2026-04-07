# Codi Craft Launch Readiness

## Goal
Turn the current local prototype into a secure, scalable product that can support a public launch.

## Current State
- Static frontend in `frontend/`
- Flask backend in `backend/`
- Local browser storage for history, prompt versions, and saved projects
- No authentication
- No shared/cloud persistence
- No billing
- No production monitoring
- No real vision model path

## What Is Required For A Global Launch

### 1. Authentication
- Email/password auth or social auth
- Session management or JWT strategy
- Password reset flow
- Email verification
- Role model:
  - user
  - admin
  - support

### 2. Database
- Persistent storage for:
  - users
  - projects
  - project files
  - generations
  - prompts
  - subscriptions
  - audit events
- Recommended production choices:
  - PostgreSQL for primary data
  - Redis for queue, cache, and rate limiting

### 3. Cloud Storage
- Store uploaded files and exported bundles in object storage
- Suggested providers:
  - AWS S3
  - Cloudflare R2
  - GCP Cloud Storage

### 4. Billing
- Stripe subscriptions
- Usage tracking
- Plan enforcement
- Webhook processing

### 5. Monitoring
- Error tracking with Sentry
- Product analytics with PostHog or Mixpanel
- Uptime checks
- API latency metrics

### 6. Security
- Secrets management
- Per-user rate limiting
- File upload validation and malware scanning
- Access control for private projects
- Logging and audit trail
- CSP, CORS, HTTPS, and secure cookies

### 7. Production Infrastructure
- Frontend hosting:
  - Vercel
  - Netlify
  - Cloudflare Pages
- Backend hosting:
  - Render
  - Railway
  - Fly.io
  - AWS ECS
- Background workers for generation jobs
- CDN for static assets

### 8. Legal And Support
- Privacy Policy
- Terms of Service
- Cookie policy if analytics/cookies are used
- Contact/support workflow

### 9. AI Capability Expansion
- True screenshot-to-code requires a vision-capable model path
- Multi-provider model routing recommended:
  - text generation provider
  - vision provider
  - fallback provider

## Recommended Launch Phases

### Phase 1: Private Alpha
- Auth
- PostgreSQL
- Project persistence
- Cloud storage
- Basic monitoring
- Production environment separation

### Phase 2: Closed Beta
- Billing
- Plan limits
- Email flows
- Better diff and review tools
- Improved diagnostics
- Admin dashboard

### Phase 3: Public Launch
- Vision model support
- Team workspaces
- Collaboration/share flows
- Support and moderation workflow
- Legal docs live

## Recommended Engineering Order
1. Move local browser data into backend persistence
2. Add auth and user/project ownership
3. Add production config, secrets, and monitoring
4. Add billing and plan enforcement
5. Add cloud storage and export/import workflow
6. Add vision provider support

## Not Reasonably Finishable In This Local Workspace Alone
- Real cloud auth
- Hosted database
- Hosted object storage
- Live billing integration
- Production deploy pipeline
- Legal review
- True vision capability without external provider credentials
