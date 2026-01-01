# Deployment Guide

This project is built with **Next.js** and uses **Supabase** for the backend. You are currently trying to deploy on **Netlify**.

## 1. Prerequisites

- A [GitHub](https://github.com/) account.
- A [Netlify](https://www.netlify.com/) account.
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
git commit -m "Netlify config"
git push origin main
```

## 4. Deploy to Netlify

1.  **Log in to Netlify:** Go to [app.netlify.com](https://app.netlify.com) and log in.
2.  **Add New Site:** Click **"Add new site"** -> **"Import an existing project"**.
3.  **Connect GitHub:** Select GitHub and choose your repository (`PROJECT-011`).
4.  **Configure Site:**
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `.next` (Netlify usually detects this, but we added a `netlify.toml` file to force it).
5.  **Environment Variables:**
    *   Click **"Add environment variables"**.
    *   Add the keys from your `.env.local` file:
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6.  **Deploy:** Click **"Deploy project"**.

## 5. Supabase Configuration (Production)

### Authentication Redirects
If you are using Supabase Auth Redirects, go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
Add your new Netlify production URL to the "Site URL" or "Redirect URLs" list (e.g., `https://your-site-name.netlify.app/auth/callback`).

## Troubleshooting

- **Page Not Found:** This usually means Netlify didn't detect the Next.js runtime. We added `netlify.toml` to fix this.
- **Environment Variables:** Verify Supabase keys are correct in Netlify Site Settings -> Environment variables.
