# React Frontend

## Setup

### Environment variables

```bash
cp .env.template .env.local
```

Configure `.env.local`. In particular:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`: Get from Clerk dashboard. Production configs are stored in AWS Secrets Manager.
- `NEXT_PUBLIC_APP_BACKEND_URL`: Set to `http://127.0.0.1:8000` for local dev.
- `NEXT_PUBLIC_POSTHOG_KEY`: Optional, can be left empty.
- `NEXT_PUBLIC_SENTRY_DSN`: Optional, can be left empty.

### Dependencies

```bash
npm install
```

## Run

```bash
npm run dev
```

## Deployment

The frontend is deployed to vercel. New deployment is created for every change on the main branch.
