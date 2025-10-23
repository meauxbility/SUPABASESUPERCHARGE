# 🚀 Dashboard Deployment Guide

## Overview

This guide covers deploying both dashboard versions for Meauxbility:

1. **GitHub Pages Dashboard** - Static SPA for GitHub Pages
2. **Render Dashboard** - Next.js app for Render deployment

## 📋 Prerequisites

- ✅ Supabase project configured
- ✅ Database schema applied (migration 007)
- ✅ Edge functions deployed
- ✅ Storage buckets configured

## 🗄️ Database Setup

### 1. Apply Dashboard Schema

```sql
-- Run this migration in your Supabase SQL editor
-- File: migrations/007_dashboard_schema.sql
```

### 2. Create Sample Organization

```sql
-- Insert a sample organization for testing
INSERT INTO public.organizations (id, name, description) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Meauxbility Foundation', 'Main organization for Meauxbility operations');

-- Add yourself as an admin member (replace with your user ID)
INSERT INTO public.org_members (organization_id, user_id, role) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'YOUR_USER_ID_HERE', 'admin');
```

## 🔧 Edge Functions Setup

### 1. Deploy Agent Gateway

```bash
# Deploy the agent gateway function
supabase functions deploy agent_gateway
```

### 2. Deploy Asset Signer

```bash
# Deploy the asset signer function
supabase functions deploy asset_signer
```

### 3. Configure Storage Bucket

```sql
-- Create team-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('team-assets', 'team-assets', false);

-- Set up RLS policies for the bucket
CREATE POLICY "Users can upload to their organization's assets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'team-assets' AND
        auth.uid() IN (
            SELECT user_id FROM public.org_members
        )
    );

CREATE POLICY "Users can view their organization's assets" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'team-assets' AND
        auth.uid() IN (
            SELECT user_id FROM public.org_members
        )
    );
```

## 🌐 GitHub Pages Dashboard

### 1. Build the Dashboard

```bash
cd apps/dashboard-gh-pages
npm install
npm run build
```

### 2. Configure for GitHub Pages

Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/SUPABASESUPERCHARGE/', // Your GitHub Pages path
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

### 3. Update Environment Variables

In `index.html`, replace the placeholder values:
```javascript
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key';
```

### 4. Deploy to GitHub Pages

1. Copy the `dist` folder contents to your GitHub Pages repository
2. Push to the `gh-pages` branch
3. Enable GitHub Pages in repository settings

## 🚀 Render Dashboard

### 1. Build the Dashboard

```bash
cd apps/dashboard-render
npm install
npm run build
```

### 2. Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the `apps/dashboard-render` folder

### 3. Configure Environment Variables

Add these environment variables in Render:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Your dashboard will be available at the provided URL

## 🔐 Security Configuration

### 1. RLS Policies

The database schema includes comprehensive RLS policies:

- ✅ **Organizations**: Users can only see organizations they're members of
- ✅ **Projects**: Users can only access projects in their organizations
- ✅ **Tasks**: Users can only view tasks in their organizations
- ✅ **Assets**: Users can only upload/view assets in their organizations

### 2. Edge Function Security

- ✅ **JWT Verification**: All requests require valid JWT tokens
- ✅ **Organization Access**: Users can only access their organizations
- ✅ **CORS Headers**: Proper CORS configuration for web requests

## 🧪 Testing the Dashboards

### 1. Test Authentication

1. Open the dashboard URL
2. Enter your email address
3. Check your email for the magic link
4. Click the link to sign in

### 2. Test Organization Access

1. Verify you can see your organization in the dropdown
2. Switch between organizations (if you have multiple)
3. Check that data loads correctly

### 3. Test Project Management

1. Create a new project
2. Verify it appears in the projects list
3. Check that it's associated with the correct organization

### 4. Test Task Management

1. Create a new task
2. Assign it to a project
3. Verify it appears in the tasks list

### 5. Test Asset Uploads

1. Select a file to upload
2. Provide a path (e.g., `documents/report.pdf`)
3. Click upload and verify success

## 🐛 Troubleshooting

### Common Issues

#### 1. "No organizations found"
- **Cause**: User not added to any organizations
- **Fix**: Add user to organization via SQL or admin panel

#### 2. "Access denied to organization"
- **Cause**: User not a member of the organization
- **Fix**: Check `org_members` table for user membership

#### 3. "Failed to create signed URL"
- **Cause**: Storage bucket not configured or RLS policies missing
- **Fix**: Set up storage bucket and RLS policies

#### 4. Edge functions not working
- **Cause**: Functions not deployed or environment variables missing
- **Fix**: Deploy functions and check environment configuration

### Debug Steps

1. **Check browser console** for JavaScript errors
2. **Check Supabase logs** for database errors
3. **Check Edge function logs** for function errors
4. **Verify RLS policies** are correctly applied
5. **Test with different user accounts** to isolate issues

## 📊 Monitoring

### 1. Supabase Dashboard

- Monitor database queries and performance
- Check authentication logs
- Review storage usage

### 2. Render Dashboard

- Monitor application performance
- Check deployment logs
- Review error rates

### 3. Edge Functions

- Monitor function execution times
- Check error rates
- Review request patterns

## 🔄 Updates and Maintenance

### 1. Database Updates

When updating the schema:
1. Create new migration files
2. Test in development first
3. Apply to production via Supabase SQL editor

### 2. Code Updates

For GitHub Pages:
1. Update code in repository
2. Run `npm run build`
3. Deploy new `dist` folder

For Render:
1. Push changes to repository
2. Render automatically redeploys
3. Monitor deployment status

### 3. Edge Function Updates

1. Update function code
2. Deploy with `supabase functions deploy`
3. Test functionality

## 📞 Support

### Getting Help

1. **Check Supabase logs** for database issues
2. **Check Render logs** for deployment issues
3. **Check browser console** for client-side errors
4. **Review RLS policies** for permission issues

### Common Solutions

- **Clear browser cache** for authentication issues
- **Check environment variables** for configuration issues
- **Verify database schema** for data access issues
- **Test with different browsers** for compatibility issues

---

**🎉 Your Meauxbility dashboards are now ready for production use!**

**Next Steps:**
1. Test all functionality thoroughly
2. Add more users to organizations
3. Create sample projects and tasks
4. Monitor performance and usage
5. Set up regular backups and monitoring
