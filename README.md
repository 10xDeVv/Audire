# Audire

Audire is an AI-assisted music learning prototype for self-taught musicians. The name comes from Latin *audire*, “to hear” or “to listen,” and is pronounced **ow-DEE-ray**. The app explains short musical ideas, offers contrasting creative directions, and turns feedback into a practice session while keeping artistic judgment with the musician.

**Live demo:** [http://178.128.239.153](http://178.128.239.153)

## Why It Exists

This MVP was built for MAAC 3114: AI in Music. It explores creativity, authorship, agency, access, cultural bias, and standardization. Its central design question is not whether AI can produce the “best” progression, but whether it can help a musician listen and choose more intentionally.

## Features

- Text chord-progression or musical-idea input with optional tonal centre
- Style and skill level controls
- Optional practice goal
- FastAPI `/health` and `/analyze` endpoints
- Structured, context-aware harmonic feedback
- Three creative paths with explicit artistic tradeoffs
- Sampled grand-piano playback for original and suggested progressions
- Guided practice plan with metronome and completion tracking
- Visible AI evidence, assumptions, unknowns, and confidence
- Local personal-agency reflection notes
- Loading and error states
- Clickable sample ideas
- Music-theory evaluation suite for common and ambiguous cases
- About and critical-reflection sections
- Responsive polished UI

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: FastAPI, Pydantic, Python
- AI boundary: backend-only service in `backend/app/services/ai_service.py`

## Architecture

```text
Browser -> Caddy -> Next.js
                -> /api/* -> FastAPI -> OpenAI Responses API
```

The API key is read only by FastAPI. In production, the browser calls the same-origin `/api` route; Caddy removes the prefix and forwards the request to the backend.

## Project Structure

```text
audire/
  docs/
  frontend/
  backend/
  Caddyfile
  docker-compose.yml
```

## Environment Variables

Frontend:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Backend:

```text
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.5
AUDIRE_USE_OPENAI=false
FRONTEND_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

The backend defaults to a structured placeholder response. For live AI feedback, add a real server-side key and set `AUDIRE_USE_OPENAI=true`. Never use the OpenAI key in a `NEXT_PUBLIC_*` variable.

## Run the Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Run the Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run with Docker

Copy `.env.production.example` to `.env`, add the server-side key, then run:

```bash
docker compose up -d --build
```

Open [http://localhost](http://localhost). The Compose stack is also the recommended DigitalOcean Droplet deployment. See [docs/Deployment.md](docs/Deployment.md).

## Manual Test Checklist

- Empty input shows a friendly validation error.
- Valid chord progression returns structured feedback.
- Loading state appears while the backend request is running.
- API failure shows a friendly error.
- Sample idea buttons fill the form.
- Result renders as six separate sections.
- Mobile layout remains readable.
- `/health` returns `{"status":"ok"}`.

## Music-Theory Evaluations

Audire includes a deterministic evaluation suite covering ambiguous harmony, major and minor cadences, gospel secondary dominants, slash chords, common beginner progressions, and insufficient-context inputs.

```powershell
cd backend
.venv\Scripts\python.exe -m evals.run_evals
.venv\Scripts\python.exe -m evals.run_evals --live --tag regression
```

See `backend/evals/README.md` for focused runs and report details.

The current representative live suite passed 5/5 cases and 115/115 contract and music-theory checks. Stored reports are in `backend/evals/reports/`.

## Audio Credit

Listening Lab playback uses a compact subset of Alexander Holm's [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3), licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). The browser-ready MP3 samples are distributed by the Tone.js project; detailed attribution is stored with the audio files.

## Final Project Materials

- [Final critical reflection](docs/Final-Critical-Reflection.md)
- [Demo and submission guide](docs/Final-Submission-Guide.md)
- [Deployment guide](docs/Deployment.md)
- [Expanded AI and arts design reflection](docs/AI-Arts-Reflection.md)
- [Product requirements](docs/PRD.md)
- [Technical design](docs/Technical-Design.md)

## Scope and Future Work

- MIDI upload and analysis
- Audio upload and chord detection
- Practice history
- Personalized learning plans
- AI accompaniment generation
- Side-by-side before/after ideas
- Export feedback as PDF

Authentication, accounts, a database, and analytics are intentionally absent. The next musically meaningful improvements would be MIDI import and audio-informed analysis, provided those additions continue to expose uncertainty and preserve musician agency.
