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

## Local note (why `/saoud` 404s on port 8000)

This repo also has a separate static HTML dev server (`serve.py`) that runs on `http://127.0.0.1:8000`.
That server **cannot serve** the Next.js app under `saoud/`, so `http://127.0.0.1:8000/saoud/` will return **404** locally.

To preview the portfolio, run this Next app and open:
- `http://localhost:3000`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Serving at `sillylittletools.com/saoud` (Vercel multi-zone)

Your main site is static HTML at the repo root, and the portfolio is a Next.js app in `saoud/`.
To serve the portfolio at `/saoud`:

1. Create **two Vercel projects** from the same repo:\n+   - **Main site project**: Root Directory = `./` (repo root)\n+   - **Portfolio project**: Root Directory = `saoud/`\n+
2. In the Vercel project that owns `sillylittletools.com`, add a route so:\n+   - `/saoud` and `/saoud/*` are forwarded to the **Portfolio project**\n+\n+This is typically done via Vercel **Multi-Zone** routing in the dashboard.\n+The Next app stays mounted at its own `/` internally, but the domain routes `/saoud/*` to it.
