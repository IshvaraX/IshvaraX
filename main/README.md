This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Backend API (auth)

Login and registration talk to the HFI FastAPI backend. Point the frontend at your
backend by setting a single environment variable (copy `.env.example` to `.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

The base URL lives in one place — [`src/lib/api.ts`](src/lib/api.ts). Change that
env value (or the fallback in that file) to swap between local and deployed backends.
Endpoints used: `POST /auth/register`, `POST /auth/login`.

## Deploy on Vercel

This app deploys to Vercel with zero config — Vercel auto-detects Next.js
(build command `next build`, no special settings). Import the repo at
[vercel.com/new](https://vercel.com/new) and add one environment variable in
the project settings:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url
```

next/image optimization and the App Router run natively on Vercel — no extra
configuration required.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
