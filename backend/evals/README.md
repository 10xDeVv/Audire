# Audire Music-Theory Evaluations

This suite tests whether Audire is specific, theory-aware, transparent about uncertainty, and structurally complete.

## Contract Checks

Runs every case without making API calls:

```powershell
cd backend
.venv\Scripts\python.exe -m evals.run_evals
```

## Live Checks

Calls the configured model and writes a Markdown report:

```powershell
.venv\Scripts\python.exe -m evals.run_evals --live
```

Useful focused runs:

```powershell
.venv\Scripts\python.exe -m evals.run_evals --live --tag regression
.venv\Scripts\python.exe -m evals.run_evals --live --case c_major_ii_v_i
.venv\Scripts\python.exe -m evals.run_evals --live --limit 3
```

Live evaluations use API quota. Reports are written to `evals/reports/latest.md` by default.

## What Is Scored

- Six required feedback sections are non-empty
- Creative paths are exactly Preserve, Develop, and Explore
- Practice plans contain three steps
- AI evidence and unknowns are visible
- Confidence matches the amount of supplied context
- Case-specific theory claims appear
- Known false claims do not appear

The suite is deliberately deterministic. It does not use another language model to grade Audire's answer.
