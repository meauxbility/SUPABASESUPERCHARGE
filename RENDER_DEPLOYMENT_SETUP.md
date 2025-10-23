# 🚀 Render Deployment Setup Guide

This guide walks you through setting up automated deployments for the Meauxbility dashboard using Render and GitHub Actions.

## 📋 Prerequisites

- ✅ Render account with API access
- ✅ GitHub repository with Actions enabled
- ✅ Supabase project configured
- ✅ Node.js 18+ installed locally

## 🔧 Step-by-Step Setup

### Step 1: Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the `apps/dashboard-render` folder
5. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18

### Step 2: Create Render Webhook

1. In your Render service settings, go to "Webhooks"
2. Click "Add Webhook"
3. Configure the webhook:
   - **Name**: `GitHub Deploy Trigger`
   - **URL**: `https://api.github.com/repos/YOUR_USERNAME/meauxbility/dispatches`
   - **Events**: `deploy.succeeded`, `deploy.failed`
   - **Secret**: Generate a secure random string (save this!)

### Step 3: Create Render API Key

1. Go to [Render API Keys](https://dashboard.render.com/account/api-keys)
2. Click "Create API Key"
3. Give it a descriptive name (e.g., "Meauxbility Deploy")
4. Copy the API key (save this securely!)

### Step 4: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
4. Copy the token (save this securely!)

### Step 5: Configure Environment Variables

Run the setup script to configure all environment variables:

```bash
./scripts/setup-render-deployment.sh
```

Or manually set these in your Render service:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Render Webhook Configuration
RENDER_WEBHOOK_SECRET=your_webhook_secret_from_step_2
RENDER_API_KEY=your_render_api_key_from_step_3

# GitHub Integration
GITHUB_API_TOKEN=your_github_token_from_step_4
GITHUB_OWNER_NAME=your_github_username
GITHUB_REPO_NAME=meauxbility
GITHUB_WORKFLOW_ID=render-deploy.yml

# Node Environment
NODE_ENV=production
PORT=3000
```

### Step 6: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add the following repository secrets:

```
RENDER_WEBHOOK_SECRET=your_webhook_secret_from_step_2
RENDER_API_KEY=your_render_api_key_from_step_3
RENDER_SERVICE_ID=your_render_service_id
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 7: Set Up GitHub Webhook

1. Go to your repository → Settings → Webhooks
2. Click "Add webhook"
3. Configure:
   - **Payload URL**: Your Render webhook URL
   - **Content type**: `application/json`
   - **Secret**: The secret from step 2
   - **Events**: Select "Repository dispatch" and "Workflow runs"

## 🧪 Testing the Setup

### Test 1: Manual Workflow Trigger

1. Go to your repository → Actions
2. Select "Render Deploy Trigger" workflow
3. Click "Run workflow"
4. Choose environment (production/staging)
5. Click "Run workflow"

### Test 2: Render Service Deploy

1. Go to your Render service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Watch the deployment logs
4. Verify the service is running

### Test 3: Webhook Integration

1. Make a small change to your code
2. Push to the main branch
3. Check that Render automatically deploys
4. Verify the GitHub workflow is triggered

## 🔍 Troubleshooting

### Common Issues

#### 1. "Webhook secret mismatch"
- **Cause**: Webhook secret doesn't match between GitHub and Render
- **Fix**: Verify secrets are identical in both services

#### 2. "API key invalid"
- **Cause**: Render API key is incorrect or expired
- **Fix**: Generate a new API key in Render dashboard

#### 3. "Workflow not triggered"
- **Cause**: GitHub webhook not configured properly
- **Fix**: Check webhook URL and events in GitHub settings

#### 4. "Build failed"
- **Cause**: Environment variables missing or incorrect
- **Fix**: Verify all required environment variables are set

### Debug Steps

1. **Check Render logs** for deployment errors
2. **Check GitHub Actions logs** for workflow errors
3. **Verify environment variables** are set correctly
4. **Test API connections** using the setup script
5. **Check webhook delivery** in GitHub webhook settings

## 📊 Monitoring

### Render Dashboard
- Monitor service health and performance
- Check deployment logs
- Review error rates and response times

### GitHub Actions
- Monitor workflow runs
- Check for failed deployments
- Review webhook deliveries

### Application Logs
- Check Next.js application logs
- Monitor Supabase connection
- Review user authentication

## 🔄 Maintenance

### Regular Tasks
1. **Update dependencies** monthly
2. **Review security** quarterly
3. **Monitor performance** weekly
4. **Backup data** daily

### Updates
1. **Code changes**: Push to main branch triggers auto-deploy
2. **Environment changes**: Update in Render dashboard
3. **Secrets rotation**: Update in both GitHub and Render

## 📞 Support

### Getting Help
1. **Check logs** in Render dashboard
2. **Review GitHub Actions** for workflow issues
3. **Test API connections** using setup script
4. **Verify webhook configuration** in GitHub settings

### Common Solutions
- **Clear cache** for build issues
- **Restart service** for runtime issues
- **Check environment variables** for configuration issues
- **Verify API keys** for authentication issues

---

**🎉 Your automated deployment pipeline is now ready!**

**Next Steps:**
1. Test all functionality thoroughly
2. Set up monitoring and alerts
3. Configure staging environment
4. Set up regular backups
5. Document deployment procedures
