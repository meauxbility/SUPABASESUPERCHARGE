# 🚀 Render Deployment Guide - Meauxbility Dashboard

## Quick Deploy (Recommended)

### Option 1: Using Render CLI
```bash
# Install Render CLI (if not already installed)
curl -fsSL https://cli.render.com/install | sh

# Login to Render
render auth login

# Deploy using our script
./scripts/deploy-to-render.sh
```

### Option 2: Manual Deployment via Render Dashboard

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect GitHub Repository:**
   - Repository: `meauxbility/SUPABASESUPERCHARGE`
   - Branch: `main`
   - Root Directory: `apps/dashboard-render`

4. **Configure Service:**
   - **Name:** `meauxbility-app`
   - **Environment:** `Node`
   - **Plan:** `Starter` (Free)
   - **Region:** `Oregon (US West)`

5. **Build & Deploy Settings:**
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm run start`

## 🔧 Environment Variables Configuration

### Required (Minimum to run):
```
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA
NODE_ENV=production
PORT=3000
```

### Optional (For full functionality):
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GITHUB_TOKEN=your_github_token
NOTION_API_KEY=your_notion_key
```

## 📋 Deployment Checklist

- [ ] Repository connected to Render
- [ ] Root directory set to `apps/dashboard-render`
- [ ] Build command: `npm ci && npm run build`
- [ ] Start command: `npm run start`
- [ ] Environment variables configured
- [ ] Service deployed and running
- [ ] Test Supabase connection at `/test-supabase`

## 🔗 After Deployment

Your app will be available at:
- **URL:** `https://meauxbility-app.onrender.com`
- **Test Page:** `https://meauxbility-app.onrender.com/test-supabase`

## 🛠️ Troubleshooting

### Common Issues:
1. **Build Fails:** Check Node.js version (should be 18+)
2. **Environment Variables:** Ensure all required vars are set
3. **Supabase Connection:** Verify URL and keys are correct
4. **Port Issues:** Render automatically sets PORT, don't override

### Logs:
- Check Render dashboard → Your Service → Logs
- Look for build errors or runtime errors

## 🎯 Next Steps After Deployment

1. **Test the connection:** Visit `/test-supabase`
2. **Configure additional services:** Add Stripe, AI keys, etc.
3. **Set up custom domain:** (Optional) Point your domain to Render
4. **Monitor performance:** Use Render's built-in monitoring

## 🔒 Security Notes

- Never commit real API keys to GitHub
- Use Render's environment variables for secrets
- Rotate keys regularly
- Monitor usage and costs

---

**Ready to deploy?** Run `./scripts/deploy-to-render.sh` or follow the manual steps above!
