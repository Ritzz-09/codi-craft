# Deployment Checklist

## Environment Setup
- Create `development`, `staging`, and `production` environments
- Set all secrets through the host secret manager
- Disable `DEV_ERROR_DETAILS` in production
- Restrict `ALLOWED_ORIGINS` to production domains only

## Backend
- Run behind a production WSGI server
- Add request logging
- Add structured error logging
- Add Sentry
- Add Redis-backed rate limiting
- Add persistent database connection configuration

## Frontend
- Serve over HTTPS only
- Set API base URL via environment config
- Add analytics only after privacy review

## Security
- Generate strong `SESSION_SECRET`
- Generate strong `AUTH_JWT_SECRET`
- Add secure cookie configuration
- Add CSRF protection if using cookie-based auth
- Add file size limits
- Add MIME validation for uploads
- Add CSP headers

## Persistence
- Provision PostgreSQL
- Provision Redis
- Provision object storage
- Add backup policy

## Billing
- Configure Stripe products and prices
- Add webhook endpoint
- Verify webhook signing
- Add test mode and live mode separation

## Monitoring
- Sentry DSN configured
- Uptime probe configured
- Backend health checks exposed
- Dashboard for:
  - error rate
  - latency
  - generation failures
  - signup conversion

## Launch QA
- Desktop browsers tested
- Mobile layout tested
- Auth flows tested
- Payment flow tested
- Upload/export flow tested
- Compare/editor/project save flow tested

## Soft Launch
- Invite-only or small beta cohort
- Track incident response owner
- Monitor rate limits and cost per generation

## Public Launch
- Legal pages published
- Support email live
- Status page live
- Incident checklist documented
