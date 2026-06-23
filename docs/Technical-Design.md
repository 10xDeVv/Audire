# Technical Design Document — Audire MVP

## 1. Tech Stack

> **As-built update (June 2026):** The split Next.js/FastAPI architecture remains in place. The implemented AI provider is the OpenAI Responses API with Pydantic structured output. Production deployment is now supported either as one Docker Compose stack on a DigitalOcean Droplet or as separately hosted services. The recommended course-submission route is the single Droplet behind Caddy; see `docs/Deployment.md`.

Use a split frontend/backend architecture.

### Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* Deployed on Vercel

### Backend

* FastAPI
* Pydantic
* Python
* Deployed on Render, Railway, Fly.io, or Google Cloud Run

### AI

* OpenAI API or Gemini API
* Backend owns all AI calls
* API keys must never be exposed to the frontend

### Future Music Libraries

Do not add these yet unless needed:

* `music21`
* `pretty_midi`
* `librosa`

They are useful later for MIDI/audio analysis, but the MVP is text/chord-progression based.

## 2. Project Structure

```text
audire/
  frontend/
    app/
      page.tsx
      layout.tsx
      globals.css
    components/
      Hero.tsx
      MusicIdeaForm.tsx
      FeedbackResult.tsx
      FeedbackSection.tsx
      SampleIdeas.tsx
      AboutProject.tsx
    lib/
      api.ts
      types.ts
    .env.local

  backend/
    app/
      main.py
      models.py
      prompts.py
      services/
        ai_service.py
    requirements.txt
    .env
    README.md
```

## 3. Backend API

### Health Check

```text
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

### Analyze Music Idea

```text
POST /analyze
```

Request body:

```json
{
  "idea": "C - Am - F - G",
  "style": "Gospel",
  "skillLevel": "Intermediate",
  "goal": "Make it sound less basic and more gospel-inspired."
}
```

Response body:

```json
{
  "musicalAnalysis": "...",
  "whatWorks": "...",
  "suggestions": "...",
  "creativeAlternative": "...",
  "practiceExercise": "...",
  "personalStyleReminder": "..."
}
```

## 4. Backend Models

Create `backend/app/models.py`:

```python
from pydantic import BaseModel, Field
from typing import Literal, Optional

MusicStyle = Literal[
    "Gospel",
    "Jazz",
    "R&B",
    "Pop",
    "Worship",
    "Classical",
    "Other",
]

SkillLevel = Literal[
    "Beginner",
    "Intermediate",
    "Advanced",
]

class AnalyzeRequest(BaseModel):
    idea: str = Field(..., min_length=1, max_length=2000)
    style: MusicStyle
    skillLevel: SkillLevel
    goal: Optional[str] = Field(default="", max_length=1000)

class AnalyzeResponse(BaseModel):
    musicalAnalysis: str
    whatWorks: str
    suggestions: str
    creativeAlternative: str
    practiceExercise: str
    personalStyleReminder: str
```

## 5. Prompt Builder

Create `backend/app/prompts.py`:

```python
from app.models import AnalyzeRequest

def build_analysis_prompt(payload: AnalyzeRequest) -> str:
    goal = payload.goal or "No specific goal provided."

    return f"""
You are Audire, an AI-assisted music learning coach for self-taught musicians.

The name Audire comes from Latin audīre, meaning "to hear" or "to listen."
Your role is to help musicians understand and develop their own musical ideas.
You should support the musician's personal style, not replace it.

Analyze the following musical idea:
Musical idea or chord progression: {payload.idea}
Style: {payload.style}
Skill level: {payload.skillLevel}
Practice goal: {goal}

Return feedback in JSON only with these exact keys:
musicalAnalysis
whatWorks
suggestions
creativeAlternative
practiceExercise
personalStyleReminder

Rules:
- Be supportive and educational.
- Explain concepts clearly.
- Treat advice as suggestions, not absolute rules.
- Preserve the musician's personal style.
- Avoid making the musician sound generic.
- Avoid claiming there is only one correct way to play the idea.
- If the input is vague, give useful general feedback and suggest how the user could make it clearer.
- Keep each section concise.
"""
```

## 6. FastAPI App

Create `backend/app/main.py`:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import AnalyzeRequest, AnalyzeResponse
from app.services.ai_service import analyze_music_idea

app = FastAPI(title="Audire API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    try:
        return await analyze_music_idea(payload)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while analyzing your musical idea.",
        ) from exc
```

## 7. AI Service

Create `backend/app/services/ai_service.py`.

Start with a placeholder response first so the frontend can be built before the AI API is connected:

```python
from app.models import AnalyzeRequest, AnalyzeResponse
from app.prompts import build_analysis_prompt

async def analyze_music_idea(payload: AnalyzeRequest) -> AnalyzeResponse:
    prompt = build_analysis_prompt(payload)

    # TODO: Replace this placeholder with OpenAI or Gemini API call.
    # The function should always return AnalyzeResponse.

    return AnalyzeResponse(
        musicalAnalysis="This progression uses a familiar movement that creates a clear and accessible sound.",
        whatWorks="The idea is easy to follow and gives a strong foundation for practice.",
        suggestions="Try adding passing chords, chord extensions, or rhythmic variation to create more movement.",
        creativeAlternative="For a gospel-inspired variation, try Cmaj7 - E7 - Am7 - D7 - G7.",
        practiceExercise="Play the original progression slowly, then add one variation at a time while listening for what changes.",
        personalStyleReminder="Use these suggestions as options, not rules. Keep the parts that fit your own sound.",
    )
```

## 8. Requirements

Create `backend/requirements.txt`:

```text
fastapi
uvicorn[standard]
python-dotenv
pydantic
openai
```

If using Gemini instead of OpenAI, add the required Google package later.

## 9. Running the Backend

Mac/Linux:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Windows PowerShell:

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 10. Frontend Types

Create `frontend/lib/types.ts`:

```ts
export type MusicStyle =
  | "Gospel"
  | "Jazz"
  | "R&B"
  | "Pop"
  | "Worship"
  | "Classical"
  | "Other";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export interface AnalyzeRequest {
  idea: string;
  style: MusicStyle;
  skillLevel: SkillLevel;
  goal?: string;
}

export interface AnalyzeResponse {
  musicalAnalysis: string;
  whatWorks: string;
  suggestions: string;
  creativeAlternative: string;
  practiceExercise: string;
  personalStyleReminder: string;
}
```

## 11. Frontend API Client

Create `frontend/lib/api.ts`:

```ts
import type { AnalyzeRequest, AnalyzeResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function analyzeMusicIdea(
  payload: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze musical idea.");
  }

  return response.json();
}
```

## 12. Frontend State

The main page should manage:

```ts
const [idea, setIdea] = useState("");
const [style, setStyle] = useState<MusicStyle>("Gospel");
const [skillLevel, setSkillLevel] = useState<SkillLevel>("Intermediate");
const [goal, setGoal] = useState("");
const [result, setResult] = useState<AnalyzeResponse | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
```

## 13. Frontend Components

### Hero.tsx

Include:

* App name: **Audire**
* Pronunciation hint: **ow-DEE-ray**
* Tagline: “AI feedback for self-taught musicians.”
* Short description: “A reflective music-learning prototype that listens to your ideas and helps you develop them without replacing your personal style.”

### MusicIdeaForm.tsx

Include:

* Textarea for musical idea
* Style select
* Skill level select
* Optional goal textarea
* Submit button
* Disabled/loading state

### FeedbackResult.tsx

Render six cards:

* Musical Analysis
* What Works
* Suggestions
* Creative Alternative
* Practice Exercise
* Personal Style Reminder

### SampleIdeas.tsx

Include clickable sample inputs:

```text
Idea: C - Am - F - G
Style: Gospel
Skill level: Intermediate
Goal: Make it sound less basic and more gospel-inspired.
```

```text
Idea: Dm7 - G7 - Cmaj7
Style: Jazz
Skill level: Intermediate
Goal: Add smoother movement between chords.
```

```text
Idea: F - Bb - C - F
Style: Worship
Skill level: Beginner
Goal: Make it more emotional without making it too complex.
```

### AboutProject.tsx

Include course framing:

Audire is a prototype exploring how AI can support self-taught musicians through feedback, explanation, and practice suggestions. The goal is not to let AI decide what “good” music is, but to use it as a reflective learning tool. This project connects to course themes such as AI/ML music tools, human versus machine creativity, authorship, agency, accessibility, and standardization.

## 14. Environment Variables

Frontend `.env.local`:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Backend `.env`:

```text
OPENAI_API_KEY=your_key_here
```

## 15. Deployment Notes

Frontend:

* Deploy to Vercel.

Backend:

* Deploy to Render, Railway, Fly.io, or Google Cloud Run.

After deployment, update backend CORS:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-audire-frontend.vercel.app",
]
```

Update frontend environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
```

## 16. Manual Testing Checklist

Test:

1. Empty input shows validation error.
2. Valid chord progression returns feedback.
3. Loading state appears.
4. API failure shows friendly error.
5. Sample idea buttons work.
6. Result renders as separate cards.
7. Mobile layout is readable.
8. API key is not exposed in browser.
9. `/health` endpoint returns `{"status": "ok"}`.
10. CORS works between frontend and backend.
