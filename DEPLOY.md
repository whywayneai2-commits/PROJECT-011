# Deployment Guide

This project is built with **Next.js** and uses **Supabase** for the backend. You have chosen to deploy it using **Render**.

## 1. Prerequisites

- A [GitHub](https://github.com/) account.
- A [Render](https://render.com/) account (you can sign up with GitHub).
- A [Supabase](https://supabase.com/) project.

## 2. Test Production Build Locally

Before deploying, it's good practice to ensure the app builds correctly on your machine.

```bash
npm run build
npm run start
```

If this works and you can use the app at `http://localhost:3000`, you are ready to deploy.

## 3. Push to GitHub

Ensure your project is pushed to a GitHub repository (This step is already completed).

## 4. Deploy to Render

1.  **Log in to Render:** Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2.  **New Web Service:** Click **"New +"** and select **"Web Service"**.
3.  **Connect GitHub:**
    *   Find your repository (`PROJECT-011`) in the list.
    *   Click **"Connect"**.
4.  **Configure Service:**
    *   **Name:** Choose a name for your service (e.g., `project-011`).
    *   **Region:** Select the region closest to your users.
    *   **Branch:** `main`.
    *   **Root Directory:** Leave empty (defaults to root).
    *   **Runtime:** `Node`.
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`
    *   **Instance Type:** **Free** (or your preferred plan).
5.  **Environment Variables:**
    *   Scroll down to the "Environment Variables" section.
    *   Click **"Add Environment Variable"** for each of the following:
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase Project URL)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
6.  **Deploy:** Click **"Create Web Service"**.

Render will now clone your repo, install dependencies, build the Next.js app, and start the server. You can watch the progress in the logs.

## 5. Supabase Configuration (Production)

Ensure your production database schema matches your local development.
If you have SQL files (like `migration_v1.sql`, `supabase_schema.sql`), run them in the **Supabase Dashboard** -> **SQL Editor**.

### Authentication Redirects
If you are using Supabase Auth Redirects, go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
Add your new Render production URL to the "Site URL" or "Redirect URLs" list (e.g., `https://project-011.onrender.com/auth/callback` if applicable, or just the base domain).

## Troubleshooting

- **Build Failures:** Check the "Logs" tab in Render to see if there were TypeScript or ESLint errors preventing the build.
- **Port Binding:** Next.js automatically listens on the port provided by Render (via `PORT` env var). You usually don't need to change anything.
- **Environment Variables:** If the app loads but data is missing, verify you copied the correct Supabase keys into Render's Environment Variables settings.
