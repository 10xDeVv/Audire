# Audire Frontend

Next.js frontend for Audire.

## Setup

```powershell
npm install
npm run dev
```

The app expects the backend at `http://localhost:8000` by default.

## Environment

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`

## Production

The standalone Next.js image accepts `NEXT_PUBLIC_API_BASE_URL` as a build argument. The root Compose stack builds it as `/api`, allowing Caddy to serve the frontend and backend from one origin.
