# Deployment Guide

## Recommended Route: One DigitalOcean Droplet

For this course project, use one small Ubuntu Droplet and the root `docker-compose.yml`. Caddy exposes the Next.js frontend and proxies `/api` to FastAPI, so Audire has one public origin and the OpenAI key stays only in the backend container.

A purchased domain is **not required**. With `AUDIRE_SITE_ADDRESS=:80`, the professor can open `http://YOUR_DROPLET_IP`. A domain is only needed for a memorable address and normal browser-trusted HTTPS. When a domain points to the Droplet, set `AUDIRE_SITE_ADDRESS=audire.example.com`; Caddy will request and renew HTTPS certificates automatically.

DigitalOcean App Platform is a valid alternative and supplies a default `.ondigitalocean.app` URL, but splitting the app between Vercel and DigitalOcean adds CORS, two deployments, and an HTTPS requirement for the backend. The single-Droplet route is simpler for this submission.

## 1. Create the Droplet

- Choose a current Ubuntu LTS image.
- The smallest practical shared-CPU plan with at least 1 GB RAM should be enough for this short-lived prototype; 2 GB gives Docker builds more breathing room.
- Add an SSH key.
- Allow inbound SSH, HTTP, and HTTPS in the firewall.

Official references: [Create a Droplet](https://docs.digitalocean.com/products/droplets/how-to/create/) and [DigitalOcean Cloud Firewalls](https://docs.digitalocean.com/products/networking/firewalls/how-to/create/).

## 2. Install Docker

Follow Docker’s [Ubuntu installation guide](https://docs.docker.com/engine/install/ubuntu/), including the Compose plugin. Then clone the repository on the Droplet.

## 3. Configure Secrets

From the repository root on the Droplet:

```bash
cp .env.production.example .env
nano .env
```

Put the real OpenAI key in `.env`. Do not put it in Vercel, frontend build arguments, Git, screenshots, or the demo video.

For an IP-only launch, keep:

```text
AUDIRE_SITE_ADDRESS=:80
```

For a domain whose DNS already points to the Droplet:

```text
AUDIRE_SITE_ADDRESS=audire.example.com
```

## 4. Build and Start

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=100
```

Verify:

```bash
curl http://127.0.0.1/api/health
```

Then open `http://YOUR_DROPLET_IP`. With a configured domain, open its `https://` URL.

## 5. Update or Stop

```bash
git pull
docker compose up -d --build
```

```bash
docker compose down
```

Do not add `-v` to `down` unless you intentionally want to remove Caddy’s certificate data.

## Vercel + DigitalOcean Alternative

If the frontend is deployed to Vercel, the backend must have a public HTTPS URL. DigitalOcean App Platform provides a default `.ondigitalocean.app` hostname, so a purchased domain is not required. Set `NEXT_PUBLIC_API_BASE_URL` in Vercel to that backend URL, and set `FRONTEND_ORIGINS` on the backend to the exact Vercel production URL. This works, but the two-service setup is more configuration than the Droplet Compose deployment.
