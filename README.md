# Codi Craft

Codi Craft is a local prototype for generating code, explanations, and coding help from plain-English prompts. It includes a static frontend and a Flask backend powered by Groq.

## Status

This project is currently a prototype and portfolio-style build, not a production-ready SaaS product.

What works today:
- Prompt-driven code generation
- Multiple task modes such as generate, fix, refactor, explain, and extend
- Multi-language support in the UI
- Local history and saved project state in the browser
- File and image attachments for generation context

What is not finished yet:
- Authentication
- Shared cloud persistence
- Billing
- Production monitoring
- Production deployment configuration

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Flask, Flask-CORS, Groq Python SDK

## Project Structure

```text
frontend/
  index.html
  style.css
  script.js
backend/
  app.py
  .env.example
```

## Local Setup

### 1. Clone the repository

```powershell
git clone <your-repo-url>
cd codeforge
```

### 2. Create a virtual environment

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

If `python` is not available on your machine, use the Python launcher:

```powershell
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

```powershell
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy the example file and set your Groq API key:

```powershell
Copy-Item backend\.env.example backend\.env
```

Then update `backend/.env` with your own values.

## Run Locally

### Start the backend

```powershell
cd backend
python app.py
```

### Start the frontend

Serve the `frontend/` folder with a simple static server, then open it in your browser.

Examples:

```powershell
cd frontend
python -m http.server 5500
```

or with VS Code Live Server.

## Notes Before Publishing

- Never commit `backend/.env`
- Keep API keys and secrets only in local env files or hosting provider secret managers
- This repo is best shared as a prototype/demo until production features are added

## Suggested First Git Commands

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

