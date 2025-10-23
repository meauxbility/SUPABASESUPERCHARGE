# 🚀 Convert Static Site to Web Service

## Current Issue
You have a **Static Site** deployment on Render, but we need a **Web Service** to run your full Next.js application with:
- Server-side rendering
- API routes  
- Dynamic pages
- Admin portal functionality
- Supabase integration

## Solution: Convert to Web Service

### Step 1: Delete Current Static Site
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your current `meauxbility-app` static site
3. Go to **Settings** → **Delete Service**
4. Confirm deletion

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repository: `meauxbility/SUPABASESUPERCHARGE`
3. Configure the service:

**Basic Settings:**
- **Name:** `meauxbility-app`
- **Root Directory:** `apps/dashboard-render`
- **Runtime:** `Node`
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm run start`

**Advanced Settings:**
- **Node Version:** `18` (or latest)
- **Auto-Deploy:** `Yes`
- **Branch:** `main`

### Step 3: Add Environment Variables
In the **Environment** tab, add:
```
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA
NODE_ENV=production
PORT=3000
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Your app will be available at the provided URL

## What You'll Get

### Full Application Features:
✅ **Landing Page** - `meauxbility.com/`
✅ **Admin Portal** - `meauxbility.com/admin`
✅ **About Sam** - `meauxbility.com/about-sam`
✅ **Team Page** - `meauxbility.com/team`
✅ **FAQ** - `meauxbility.com/faq`
✅ **Contact** - `meauxbility.com/contact`
✅ **Apply for Funding** - `meauxbility.com/apply-for-funding`

### Dynamic Features:
✅ **Server-side rendering**
✅ **API routes**
✅ **Supabase integration**
✅ **Real-time data**
✅ **Admin dashboard**
✅ **Form handling**

## Custom Domain Setup
1. In Render service settings, go to **Custom Domains**
2. Add `meauxbility.com`
3. Update your DNS records as instructed
4. SSL certificate will be automatically provisioned

## Expected Build Time
- Initial build: 5-10 minutes
- Subsequent deployments: 2-3 minutes
- Auto-deploy on every GitHub push

## Troubleshooting
- If build fails, check the logs in Render dashboard
- Ensure all environment variables are set correctly
- Verify Node.js version compatibility
- Check that all dependencies are in package.json

## Success Indicators
✅ Build completes without errors
✅ Service shows "Live" status
✅ All pages load correctly
✅ Admin portal connects to Supabase
✅ Forms and interactions work
