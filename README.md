# Codi Craft

Codi Craft is an AI-powered coding assistant prototype that turns natural-language prompts into code, explanations, and structured coding help. It combines a static frontend with a Flask backend and uses Groq for generation.

## Overview

This project was built as a local prototype to explore a guided coding studio experience for students, builders, and interview practice. It supports multiple generation modes, prompt tuning controls, file attachments, and beginner-friendly explanation flows.

This repository is best presented as a prototype or portfolio project, not a production-ready SaaS launch.

## Features

- Prompt-driven code generation
- Task modes for generate, fix, refactor, explain, and extend
- Multiple output styles including code, component, API, and LeetCode
- Learning-focused studio modes such as standard, learning, interview, submission, and UI builder
- File and image attachments for generation context
- Local browser history and saved project state
- Explain view for understanding generated code more easily

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Flask, Flask-CORS, Groq Python SDK
- Storage today: browser localStorage for project history and saved state

## Project Structure

```text
frontend/
  index.html
  style.css
  script.js
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
git clone https://github.com/Ritzz-09/codeforge.git
cd codeforge
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

- `GROQ_API_KEY`
- `GROQ_MODEL`
- `ALLOWED_ORIGINS`

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

## Notes For GitHub Visitors

- Secrets are not stored in the repository
- `backend/.env` is ignored and should stay local
- `backend/.env.example` shows the expected configuration shape
- This project currently uses local browser storage instead of shared cloud persistence

## Roadmap

- Move saved projects and history into backend persistence
- Add authentication and per-user ownership
- Add production configuration and monitoring
- Add hosted deployment setup
- Add billing and plan controls
- Expand vision and screenshot-to-code support

## License

No license has been added yet. If you plan to make this project public for reuse, consider adding one later.
