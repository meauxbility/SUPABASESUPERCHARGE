# 🚀 Meauxbility Standalone Site Setup Guide

This guide will help you connect your Render, Supabase, and Stripe services to deploy your first standalone Meauxbility site.

## 📋 Prerequisites Checklist

- ✅ Render account with API access
- ✅ Supabase project with database schema
- ✅ Stripe account with API keys
- ✅ GitHub repository with Actions enabled
- ✅ Node.js 18+ installed locally

## 🔐 Step 1: Collect Service Credentials

Run the interactive credential collection script:

```bash
./scripts/collect-service-credentials.sh
```

This script will:
- ✅ Test connections to all your services
- ✅ Validate API keys and credentials
- ✅ Create production environment files
- ✅ Generate GitHub secrets configuration

### Required Credentials

#### Supabase
- **Project URL**: `https://your-project.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (optional)

#### Render
- **API Key**: `rnd_...` (from Render dashboard)
- **Service ID**: `srv-...` (will be created if not provided)
- **Webhook Secret**: Random string for GitHub integration

#### Stripe
- **Secret Key**: `sk_live_...` or `sk_test_...`
- **Publishable Key**: `pk_live_...` or `pk_test_...`
- **Webhook Secret**: `whsec_...` (configured after deployment)

#### GitHub
- **Personal Access Token**: `ghp_...`
- **Repository Owner**: Your GitHub username
- **Repository Name**: `meauxbility`

## 🗄️ Step 2: Configure Supabase

### Database Schema
Ensure your Supabase project has the required schema:

```sql
-- Run these in your Supabase SQL editor
-- File: migrations/007_dashboard_schema.sql
```

### Edge Functions
Deploy the required edge functions:

```bash
# If you have Supabase CLI installed
supabase functions deploy agent_gateway
supabase functions deploy asset_signer
```

### Storage Buckets
Configure storage for file uploads:

```sql
-- Create team-assets bucket
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('team-assets', 'team-assets', false);
```

## 💳 Step 3: Configure Stripe

### API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers → API Keys
3. Copy your Secret Key and Publishable Key

### Webhooks (After Deployment)
1. Go to Developers → Webhooks
2. Add endpoint: `https://your-app.onrender.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook secret

## 🚀 Step 4: Deploy Standalone Site

Run the deployment script:

```bash
./scripts/deploy-standalone-site.sh
```

This script will:
- ✅ Deploy database schema to Supabase
- ✅ Create Render service with all configurations
- ✅ Set up Stripe webhook endpoints
- ✅ Configure all environment variables
- ✅ Trigger the deployment

## 🔧 Step 5: Manual Configuration

### Render Service Settings
1. Go to your Render service dashboard
2. Navigate to Environment
3. Add these environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
NODE_ENV=production
PORT=3000
```

### GitHub Secrets
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add all secrets from `github-secrets.txt`

### Stripe Webhooks
1. Update webhook URL to your Render service URL
2. Test webhook delivery
3. Verify webhook secret matches

## 🧪 Step 6: Testing Your Site

### Test Authentication
1. Open your deployed site
2. Try signing up with email
3. Check email for magic link
4. Verify login works

### Test Database
1. Create a test organization
2. Add yourself as a member
3. Create a test project
4. Verify data appears in Supabase dashboard

### Test Stripe Integration
1. Use Stripe test cards for payments
2. Test successful payments
3. Test failed payments
4. Verify webhook events

### Test File Uploads
1. Upload a test file
2. Verify it appears in Supabase storage
3. Check file permissions and access

## 📊 Step 7: Monitoring Setup

### Render Monitoring
- Monitor service health and performance
- Check deployment logs
- Set up alerts for downtime

### Supabase Monitoring
- Monitor database performance
- Check authentication logs
- Review storage usage

### Stripe Monitoring
- Monitor payment success rates
- Check webhook delivery
- Review transaction logs

## 🔍 Troubleshooting

### Common Issues

#### 1. "Supabase connection failed"
- **Cause**: Incorrect URL or API key
- **Fix**: Verify credentials in Supabase dashboard

#### 2. "Render deployment failed"
- **Cause**: Missing environment variables
- **Fix**: Check all required variables are set

#### 3. "Stripe webhook failed"
- **Cause**: Incorrect webhook URL or secret
- **Fix**: Verify webhook configuration in Stripe dashboard

#### 4. "Database schema missing"
- **Cause**: Migrations not applied
- **Fix**: Run SQL migrations in Supabase SQL editor

### Debug Steps

1. **Check Render logs** for application errors
2. **Check Supabase logs** for database errors
3. **Check Stripe webhook logs** for payment issues
4. **Test API connections** using the credential script
5. **Verify environment variables** in all services

## 🔄 Maintenance

### Regular Tasks
1. **Update dependencies** monthly
2. **Review security** quarterly
3. **Monitor performance** weekly
4. **Backup data** daily

### Updates
1. **Code changes**: Push to main branch triggers auto-deploy
2. **Environment changes**: Update in Render dashboard
3. **Secrets rotation**: Update in all services

## 📞 Support

### Getting Help
1. **Check service logs** for specific errors
2. **Test API connections** using provided scripts
3. **Verify configuration** in all service dashboards
4. **Review documentation** for each service

### Quick Fixes
- **Clear cache** for build issues
- **Restart service** for runtime issues
- **Check environment variables** for configuration issues
- **Verify API keys** for authentication issues

---

## 🎉 Success Checklist

- ✅ Supabase database schema deployed
- ✅ Render service created and configured
- ✅ Stripe integration working
- ✅ GitHub Actions configured
- ✅ All environment variables set
- ✅ Webhooks configured
- ✅ Authentication working
- ✅ File uploads working
- ✅ Payment processing working
- ✅ Monitoring set up

**Your Meauxbility standalone site is now live! 🚀**

**Next Steps:**
1. Test all functionality thoroughly
2. Add more users and organizations
3. Set up production monitoring
4. Configure custom domain (optional)
5. Set up regular backups
