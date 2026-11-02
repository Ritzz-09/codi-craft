# Codi Craft

![Project Status](https://img.shields.io/badge/status-prototype-blue)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)
![Backend](https://img.shields.io/badge/backend-Flask-green)
![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red)

Codi Craft is an AI-powered coding assistant that turns natural-language prompts into code, explanations, and structured coding help. It combines a static frontend with a Flask backend and lets each user bring their own API key.

## Overview

This project is a guided coding studio for students, builders, and interview practice. It supports staged configuration, multiple generation modes, prompt tuning controls, file attachments, and beginner-friendly explanation flows.

The application includes a deployment-oriented API baseline, but authentication, durable project storage, billing, and an isolated code-execution service remain required before a public SaaS launch.

## Features

- Prompt-driven code generation
- Task modes for generate, fix, refactor, explain, and extend
- Multiple output styles including code, component, API, and LeetCode
- Learning-focused studio modes such as standard, learning, interview, submission, and UI builder
- Installer-style setup flow that keeps one focused configuration stage on screen at a time
- Bring-your-own-key support for Groq, OpenAI, Anthropic, and Google Gemini
- File and image attachments for generation context
- Local browser history and saved project state
- Explain view for understanding generated code more easily

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Flask, Flask-CORS, provider adapters for Groq, OpenAI, Anthropic, and Google Gemini
- Storage today: browser localStorage for project history and saved state

## Project Structure

```text
frontend/
  index.html
  style.css
  script.js
  hierarchy.js
  hierarchy.css
  side-hub.js
  side-hub.css
  background.png
  symbol.png
backend/
  app.py
  .env.example
requirements.txt
```

## Current Status

Working today:
- Local prompt-to-code workflow
- Frontend and backend integration for generation
- Multiple coding and learning modes
- Attachment-aware prompting
- Local save/history behavior

Not finished yet:
- Authentication
- Shared database persistence
- Billing
- Production monitoring
- Hosted deployment setup
- Full production security hardening

More planning notes are available in [LAUNCH_READINESS.md](./LAUNCH_READINESS.md), [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md), and [DATA_MODEL.md](./DATA_MODEL.md).

## Local Setup

### 1. Clone the repository

```powershell
git clone https://github.com/Ritzz-09/codi-craft.git
cd codi-craft
```

### 2. Create and activate a virtual environment

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

If `python` is not available, try:

```powershell
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy the example environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Then set your own values in `backend/.env`, especially:

- `ALLOWED_ORIGINS`

## Bring your own AI key

The app does not require or use a shared server-side AI key. Before generating code, each user selects Groq, OpenAI, Anthropic, or Google Gemini and pastes their own key. Keys are sent only over the generation request, are not written to browser storage, project history, API responses, or server logs, and disappear when the page is refreshed. Always deploy the app over HTTPS.

Users may use the default model for their provider or enter another model available on their own account.

## Run Locally

### Start the backend

```powershell
cd backend
python app.py
```

The Flask API runs on `http://127.0.0.1:5000`.

### Start the frontend

Serve the `frontend/` folder with a simple static server:

```powershell
cd frontend
python -m http.server 5500
```

Then open:

`http://127.0.0.1:5500`

You can also use VS Code Live Server if you prefer.

## Deployment Baseline

The API is container-ready and runs under Gunicorn. Build it from the repository root:

```powershell
docker build -f backend/Dockerfile -t codicraft-api .
docker run --rm -p 8080:8080 --env-file backend/.env codicraft-api
```

For production, set `APP_ENV=production`, `DEV_ERROR_DETAILS=false`, a precise HTTPS-only `ALLOWED_ORIGINS` value, and `TRUST_PROXY_HEADERS=true` only behind a trusted reverse proxy. No shared AI key is required. Update [frontend/config.js](./frontend/config.js) with the public API URL before publishing the static frontend.

`/health` is a liveness endpoint and `/ready` confirms that the BYOK API is ready. The `/run` endpoint is deliberately disabled by default (`ENABLE_CODE_EXECUTION=false`): do not enable it on an application server. Route execution to a separately sandboxed service with CPU, memory, network, filesystem, and process limits.

## Notes For GitHub Visitors

- Secrets are not stored in the repository
- `backend/.env` is ignored and should stay local
- `backend/.env.example` shows the expected configuration shape
- This project currently uses local browser storage instead of shared cloud persistence
- This code is shared for portfolio viewing only; see [NOTICE.md](./NOTICE.md)

## Roadmap

- Move saved projects and history into backend persistence
- Add authentication and per-user ownership
- Add production configuration and monitoring
- Add hosted deployment setup
- Add billing and plan controls
- Expand vision and screenshot-to-code support

## License

This project is not open source. It is shared publicly for portfolio and demonstration purposes only. See [NOTICE.md](./NOTICE.md).
