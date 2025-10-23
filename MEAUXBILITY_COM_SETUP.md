# 🌐 Meauxbility.com Live Setup Guide

This guide will help you deploy your full app to [meauxbility.com](https://meauxbility.com/) using Render and Supabase.

## 🎯 Current Status

- ✅ **Domain**: [meauxbility.com](https://meauxbility.com/) is live
- ✅ **Static page**: Currently showing "Site is provisioning"
- 🚀 **Goal**: Replace with full app (authentication, projects, tasks, payments)

## 📋 What You Need

### 1. Render Account
- API key from [Render Dashboard](https://dashboard.render.com/account/api-keys)
- Service creation permissions

### 2. Supabase Project
- Project URL (https://xxx.supabase.co)
- Anon key and Service key
- Authentication configuration

### 3. Domain Access
- DNS management access for meauxbility.com
- Ability to add CNAME records

## 🚀 Quick Setup (5 Minutes)

### Step 1: Collect Credentials
```bash
./scripts/collect-service-credentials.sh
```

### Step 2: Deploy to meauxbility.com
```bash
./scripts/deploy-to-meauxbility-com.sh
```

### Step 3: Configure DNS
Add these CNAME records to your domain registrar:
- `@` → `your-render-service-url.onrender.com`
- `www` → `your-render-service-url.onrender.com`

### Step 4: Update Supabase
In your Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: `https://meauxbility.com`
- **Redirect URLs**:
  - `https://meauxbility.com/app`
  - `https://meauxbility.com/auth/callback`

## 🔧 Manual Configuration

### Render Service Setup
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select `apps/dashboard-render` folder
5. Configure environment variables (see below)

### Environment Variables for Render
```bash
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://meauxbility.com
```

### Custom Domain in Render
1. Go to your service settings
2. Click "Custom Domains"
3. Add `meauxbility.com`
4. Follow DNS configuration instructions

## 🧪 Testing Your Live Site

### 1. Test Authentication
- Go to [meauxbility.com](https://meauxbility.com/)
- Should redirect to `/app`
- Try signing up with email
- Check email for magic link

### 2. Test App Features
- Create a project
- Add tasks
- Upload files
- Test organization switching

### 3. Test Payments (if configured)
- Use Stripe test cards
- Verify webhook delivery

## 🔍 Troubleshooting

### Common Issues

#### 1. "Site is provisioning" still shows
- **Cause**: DNS not pointing to Render
- **Fix**: Check CNAME records are correct

#### 2. "Authentication failed"
- **Cause**: Supabase URLs not configured
- **Fix**: Update Supabase authentication settings

#### 3. "Render service not found"
- **Cause**: Service not created or wrong ID
- **Fix**: Check Render dashboard for service status

#### 4. "Database connection failed"
- **Cause**: Supabase credentials incorrect
- **Fix**: Verify environment variables in Render

### Debug Steps
1. **Check Render logs** for deployment errors
2. **Check Supabase logs** for database errors
3. **Verify DNS propagation** using `nslookup meauxbility.com`
4. **Test service URL** directly (bypass domain)

## 📊 Monitoring

### Render Dashboard
- Monitor service health
- Check deployment logs
- Review performance metrics

### Supabase Dashboard
- Monitor database queries
- Check authentication logs
- Review storage usage

### Domain Health
- Check DNS propagation
- Monitor SSL certificate
- Test site speed

## 🔄 Updates

### Code Updates
1. Push changes to GitHub
2. Render automatically redeploys
3. Changes go live at meauxbility.com

### Environment Updates
1. Update variables in Render dashboard
2. Restart service if needed
3. Test changes

## 🎉 Success Checklist

- ✅ Domain points to Render service
- ✅ Full app loads at meauxbility.com
- ✅ Authentication works
- ✅ Database connections work
- ✅ File uploads work
- ✅ Payments work (if configured)
- ✅ Mobile responsive
- ✅ Fast loading times

---

## 🚀 Ready to Deploy?

Run these commands to get your site live:

```bash
# 1. Collect your service credentials
./scripts/collect-service-credentials.sh

# 2. Deploy to meauxbility.com
./scripts/deploy-to-meauxbility-com.sh

# 3. Configure DNS and Supabase (manual steps)
```

**Your epic standalone site will be live at [meauxbility.com](https://meauxbility.com/)! 🎉**
