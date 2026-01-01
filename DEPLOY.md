# Deployment Guide

This project is built with **Next.js** and uses **Supabase** for the backend. The recommended way to deploy it is using **Vercel**, which provides zero-configuration deployment for Next.js.

## 1. Prerequisites

- A [GitHub](https://github.com/) account.
- A [Vercel](https://vercel.com/) account (you can sign up with GitHub).
- A [Supabase](https://supabase.com/) project.

## 2. Test Production Build Locally

Before deploying, it's good practice to ensure the app builds correctly on your machine.

```bash
npm run build
npm run start
```

If this works and you can use the app at `http://localhost:3000`, you are ready to deploy.

## 3. Push to GitHub

Ensure your project is pushed to a GitHub repository.

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 4. Deploy to Vercel

1.  **Log in to Vercel:** Go to [vercel.com](https://vercel.com) and log in.
2.  **Add New Project:** Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository:** Find your repository in the list and click **"Import"**.
4.  **Configure Project:**
    *   **Framework Preset:** Next.js (should be auto-detected).
    *   **Root Directory:** `./` (default).
    *   **Environment Variables:** You MUST add the Supabase variables here. Expand the "Environment Variables" section and add:
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase Project URL)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
5.  **Deploy:** Click **"Deploy"**.

Vercel will now build your application and deploy it. Once finished, you will get a production URL (e.g., `your-project.vercel.app`).

## 5. Supabase Configuration (Production)

Ensure your production database schema matches your local development.
If you have SQL files (like `migration_v1.sql`, `supabase_schema.sql`), run them in the **Supabase Dashboard** -> **SQL Editor**.

### Authentication Redirects
If you are using Supabase Auth Redirects, go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
Add your new Vercel production URL to the "Site URL" or "Redirect URLs" list (e.g., `https://your-project.vercel.app/auth/callback` if applicable, or just the base domain).

## Troubleshooting

- **Build Failures:** Check the "Logs" tab in Vercel to see if there were TypeScript or ESLint errors preventing the build.
- **Environment Variables:** If the app loads but data is missing, verify you copied the correct Supabase keys into Vercel's Environment Variables settings.
