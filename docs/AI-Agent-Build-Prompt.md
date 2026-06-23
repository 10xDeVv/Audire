# AI Agent Build Prompt — Audire MVP

You are building a polished MVP called **Audire**.

Audire is pronounced **ow-DEE-ray** and comes from Latin *audīre*, meaning “to hear” or “to listen.”

This is a university final project prototype for a course about AI/ML music tools, creativity, authorship, agency, accessibility, and standardization. The user is a self-taught gospel pianist and computer science student. The app should demonstrate how AI can help self-taught musicians understand and develop musical ideas without replacing their personal style.

## Product Goal

Build a small web app where a user enters a short musical idea, chord progression, melody description, or practice goal. The app sends this input to a FastAPI backend, which calls an AI model and returns structured educational feedback.

The final app should feel like a thoughtful prototype, not a full commercial SaaS product.

## App Name

**Audire**

## Tagline

```text
AI feedback for self-taught musicians.
```

## Core Idea

Audire should feel like a tool that “listens” to musical ideas and helps the musician understand them. It should not feel like an app that replaces taste, creativity, or personal style.

## Tech Stack

Use a split frontend/backend architecture.

### Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* Calls the FastAPI backend
* Deployed on Vercel

### Backend

* FastAPI
* Pydantic
* Python
* `/health` endpoint
* `/analyze` endpoint
* Prompt builder in `prompts.py`
* AI call isolated in `services/ai_service.py`
* CORS configured for local frontend
* Deployed on Render, Railway, Fly.io, or Google Cloud Run

### AI

* OpenAI API or Gemini API
* API key must stay server-side only
* AI response must be returned as structured JSON

## Required MVP Features

Build:

1. A modern landing page.
2. A form where users can enter:

   * Musical idea/chord progression
   * Style
   * Skill level
   * Practice goal
3. A FastAPI backend endpoint that receives the form data.
4. An AI service that returns structured feedback.
5. Loading and error states.
6. Clickable sample ideas.
7. An About/Reflection section explaining the course relevance.
8. Clean responsive design.

## Do Not Build

Do not build:

* Login
* Database
* User accounts
* Payment
* Social features
* Full MIDI editor
* Raw audio analysis
* Real-time recording
* DAW integration

This MVP is text/chord-progression based. Audio and MIDI can be future work.

## Required Output Sections

The AI feedback must always include:

1. What is happening musically
2. What already works
3. Suggestions for improvement
4. Creative alternative
5. Practice exercise
6. Personal style reminder

Use this response shape:

```ts
interface AnalyzeResponse {
  musicalAnalysis: string;
  whatWorks: string;
  suggestions: string;
  creativeAlternative: string;
  practiceExercise: string;
  personalStyleReminder: string;
}
```

## Backend Request Shape

```ts
interface AnalyzeRequest {
  idea: string;
  style: "Gospel" | "Jazz" | "R&B" | "Pop" | "Worship" | "Classical" | "Other";
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  goal?: string;
}
```

## Backend Prompt

Use this prompt structure:

```text
You are Audire, an AI-assisted music learning coach for self-taught musicians.

The name Audire comes from Latin audīre, meaning "to hear" or "to listen."
Your role is to help musicians understand and develop their own musical ideas.
You should support the musician's personal style, not replace it.

Analyze the following musical idea:
Musical idea or chord progression: {idea}
Style: {style}
Skill level: {skillLevel}
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
- Treat your advice as suggestions, not absolute rules.
- Preserve the musician's personal style.
- Avoid making the musician sound generic.
- Avoid claiming there is only one correct way to play the idea.
- If the idea is vague, give useful general feedback and suggest how the user could make the input clearer.
- Keep each section concise.
```

## UI Direction

Make the app look polished and creative.

Design vibe:

* Warm
* Modern
* Music-focused
* Reflective
* Slightly artistic
* Not corporate

Suggested layout:

* Hero section at top
* Form card
* Results card/grid
* Sample ideas section
* About the project section

Use:

* Strong typography
* Rounded cards
* Soft gradients
* Clean spacing
* Responsive layout
* Subtle musical/listening visual language

Avoid:

* Generic dashboard feel
* Too many colors
* Too much text
* Cluttered layout
* Overbuilding

## Sample Inputs

Include these sample buttons:

### Sample 1

```text
Idea: C - Am - F - G
Style: Gospel
Skill level: Intermediate
Goal: Make it sound less basic and more gospel-inspired.
```

### Sample 2

```text
Idea: Dm7 - G7 - Cmaj7
Style: Jazz
Skill level: Intermediate
Goal: Add smoother movement between chords.
```

### Sample 3

```text
Idea: F - Bb - C - F
Style: Worship
Skill level: Beginner
Goal: Make it more emotional without making it too complex.
```

## About/Reflection Section Copy

Include this in the app:

```text
Audire is a prototype exploring how AI can support self-taught musicians through feedback, explanation, and practice suggestions. The goal is not to let AI decide what “good” music is, but to use it as a reflective learning tool. This project connects to course themes such as AI/ML music tools, human versus machine creativity, authorship, agency, accessibility, and standardization.
```

## Development Steps

1. Create the monorepo-style folder structure with `frontend/` and `backend/`.
2. Build the FastAPI backend with `/health` and `/analyze`.
3. Add Pydantic request/response models.
4. Add the prompt builder.
5. Add placeholder AI response first.
6. Build the Next.js frontend.
7. Build the hero, form, sample ideas, result cards, and about section.
8. Connect the frontend to the FastAPI backend.
9. Add loading and error states.
10. Replace placeholder AI service with real OpenAI or Gemini call.
11. Polish responsive styling.
12. Add README files.
13. Test the full flow.

## Acceptance Criteria

The project is complete when:

* The app loads successfully.
* The backend health endpoint works.
* A user can enter a chord progression or musical idea.
* A user can choose style and skill level.
* A user can enter a goal.
* The frontend calls the FastAPI backend.
* The backend returns structured feedback.
* Loading and error states work.
* Sample idea buttons work.
* The About section explains the course connection.
* The design is responsive and polished.
* No API key is exposed to the frontend.
* README explains setup and project purpose.

## README Requirements

Create a README with:

* Project title: Audire
* Meaning of the name
* Short description
* Course context
* Features
* Tech stack
* Setup instructions
* Environment variables
* How to run frontend/backend
* Future improvements
* Critical reflection summary

## Final Instruction

Build Audire as a focused MVP. Do not overengineer. Prioritize a working, polished prototype that clearly demonstrates the course idea: AI as a reflective listening assistant for self-taught musicians, not a replacement for musical agency or personal style.
