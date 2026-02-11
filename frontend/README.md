# CareCompass Frontend

## Getting Started

Install dependencies

```bash
npm install
```

Add the environment variables

```bash
cp .env.template .env.local
```

Add the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from AWS Secrets Manager. API keys for analytics can be left empety for local development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The frontend is deployed to vercel. New deployment is created for every change on the main branch.
