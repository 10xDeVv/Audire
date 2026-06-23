# Audire Backend

FastAPI backend for Audire, an AI-assisted music learning prototype.

## Setup

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Environment

Copy `.env.example` to `.env` and update values as needed.

- `OPENAI_API_KEY`: server-side API key, never exposed to the frontend.
- `OPENAI_MODEL`: model used when OpenAI mode is enabled.
- `AUDIRE_USE_OPENAI`: set to `true` to call OpenAI. Keep `false` for the local placeholder.
- `FRONTEND_ORIGINS`: comma-separated CORS origins.

## Endpoints

- `GET /health`
- `POST /analyze`

## Tests and Evaluations

```powershell
.venv\Scripts\python.exe -m unittest discover -s tests -v
.venv\Scripts\python.exe -m evals.run_evals
```

Live evaluations call the configured model and consume API quota:

```powershell
.venv\Scripts\python.exe -m evals.run_evals --live --tag regression
```

## Container

The production image runs FastAPI as a non-root user on port `8000`. Build it through the root `docker-compose.yml`; production secrets are injected at runtime and are not copied into the image.
