# Vercel Deployment Not Triggering - Troubleshooting Guide

## Issue
When pushing code to GitHub, Vercel deployments are not being triggered automatically.

## Possible Causes & Solutions

### 1. Check Vercel GitHub Integration

**Steps to verify:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (SOG1)
3. Go to **Settings** → **Git**
4. Verify:
   - ✅ Repository is connected: `Patrickcudjoe1/SOG1`
   - ✅ Production Branch: `main` (or `master`)
   - ✅ Auto-deploy is enabled

### 2. Reconnect GitHub Repository (If needed)

If the connection is broken:
1. Go to **Settings** → **Git**
2. Click **Disconnect** or **Change Repository**
3. Click **Connect Git Repository**
4. Select `Patrickcudjoe1/SOG1`
5. Ensure **Production Branch** is set to `main`
6. Enable **Auto-deploy on push**

### 3. Trigger Manual Deployment

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **Redeploy**
4. Or click **Create Deployment** to deploy latest commit

**Option B: Via Vercel CLI** (if installed)
```bash
vercel --prod
```

### 4. Check Deployment Logs

1. Go to **Deployments** tab in Vercel
2. Check the latest deployment:
   - Is it failing?
   - Does it show the latest commit hash?
   - What errors are in the build logs?

### 5. Verify Git Webhook is Working

1. Go to your GitHub repository: https://github.com/Patrickcudjoe1/SOG1
2. Go to **Settings** → **Webhooks**
3. Look for a Vercel webhook
4. Check if it has recent deliveries
5. If missing or failed, Vercel needs to reconnect

### 6. Check Environment Variables

After the Supabase migration, ensure Vercel has the correct environment variables:

**Required Environment Variables:**
```
JWT_SECRET=your-secure-jwt-secret-here
DATABASE_URL=your-postgresql-connection-string
NEXT_PUBLIC_API_URL=http://localhost:4000 (or your backend URL)
```

**To add/update:**
1. Go to Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Add/update the variables above
4. Redeploy after adding

### 7. Force a New Deployment

You can trigger a deployment by making a small change:

```bash
# Add a comment or empty commit
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

### 8. Check Build Settings

1. Go to **Settings** → **General**
2. Verify **Build & Development Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run vercel-build` (or leave empty for auto-detection)
   - Install Command: `npm install`
   - Output Directory: (leave empty for Next.js)

### 9. Clear Build Cache

Sometimes cached builds cause issues:
1. Go to **Settings** → **General**
2. Scroll to **Build Cache**
3. Click **Clear Build Cache**
4. Trigger a new deployment

## Current Build Configuration

Your `vercel.json` is configured correctly:
```json
{
  "buildCommand": "npm run vercel-build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

Your `package.json` has:
- `vercel-build`: `prisma generate && next build`
- `postinstall`: `prisma generate`

## Quick Fix Steps (Recommended Order)

1. ✅ **Check Vercel Dashboard** → Deployments tab to see latest status
2. ✅ **Verify Git Integration** → Settings → Git → Ensure connected
3. ✅ **Check Environment Variables** → Add JWT_SECRET and DATABASE_URL
4. ✅ **Trigger Manual Deployment** → Deployments → Create Deployment
5. ✅ **Check Build Logs** → Look for any errors

## After Migration Changes

Since we migrated from Supabase to JWT auth, make sure:
- ✅ Remove any Supabase environment variables from Vercel
- ✅ Add `JWT_SECRET` environment variable
- ✅ Keep `DATABASE_URL` (if using PostgreSQL)
- ✅ Update any frontend API URLs if needed

## Next Steps

1. Check your Vercel dashboard now
2. If deployments are failing, share the error logs
3. If no deployments exist, reconnect the GitHub integration
4. Once connected, future pushes should auto-deploy

