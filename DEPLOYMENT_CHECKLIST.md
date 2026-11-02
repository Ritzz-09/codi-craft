# Deployment Checklist

## Environment Setup
- Create `development`, `staging`, and `production` environments
- Set all secrets through the host secret manager
- Disable `DEV_ERROR_DETAILS` in production
- Restrict `ALLOWED_ORIGINS` to production domains only

## Backend
- Run the included Gunicorn container behind an HTTPS reverse proxy
- Configure `/health` for liveness and `/ready` for readiness probes
- Keep `ENABLE_CODE_EXECUTION=false`; use an isolated runner service before enabling code execution
- Set `MAX_REQUEST_BYTES`, prompt limits, and reverse-proxy body limits consistently
- Replace the in-memory rate limiter with Redis-backed limiting before horizontally scaling
- Add Sentry
- Add persistent database connection configuration

## Frontend
- Serve over HTTPS only
- Set the public API origin in `frontend/config.js` during deployment
- Add analytics only after privacy review

## Security
- Generate strong `SESSION_SECRET`
- Generate strong `AUTH_JWT_SECRET`
- Add secure cookie configuration
- Add CSRF protection if using cookie-based auth
- Add file size limits
- Add MIME validation for uploads
- Add CSP headers
- Set `TRUST_PROXY_HEADERS=true` only when a trusted proxy overwrites forwarding headers

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
