-- =====================================================================
-- MEAUXBILITY.ORG - SEED DATA
-- =====================================================================
-- Version: 1.0.0
-- Purpose: Initial data for system configuration and admin users
-- =====================================================================

-- =====================================================================
-- 1. SYSTEM SETTINGS
-- =====================================================================

-- Application Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', '"Meauxbility"', 'string', 'Organization name', true),
('app_tagline', '"Empowering communities through accessibility"', 'string', 'Organization tagline', true),
('app_url', '"https://meauxbility.org"', 'string', 'Primary website URL', true),
('support_email', '"meauxbility@gmail.com"', 'string', 'Primary support email', true);

-- Email Templates
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('email_templates', '{
  "donation_receipt_template": "d-donation-receipt-template-id",
  "welcome_email_template": "d-welcome-email-template-id",
  "volunteer_approval_template": "d-volunteer-approval-template-id",
  "weekly_report_template": "d-weekly-report-template-id",
  "event_reminder_template": "d-event-reminder-template-id"
}'::jsonb, 'json', 'SendGrid template IDs', false);

-- Feature Flags
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('feature_donations_enabled', 'true', 'boolean', 'Enable donation functionality', true),
('feature_volunteers_enabled', 'true', 'boolean', 'Enable volunteer management', true),
('feature_events_enabled', 'true', 'boolean', 'Enable event management', true),
('feature_ecommerce_enabled', 'true', 'boolean', 'Enable e-commerce features', true),
('feature_ai_content_enabled', 'true', 'boolean', 'Enable AI content generation', false);

-- Donation Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('donation_minimum_cents', '500', 'number', 'Minimum donation amount ($5.00)', true),
('donation_suggested_amounts', '[1000, 2500, 5000, 10000]', 'json', 'Suggested donation amounts in cents', true),
('donation_receipt_auto_send', 'true', 'boolean', 'Automatically send donation receipts', false),
('tax_deductible_default', 'true', 'boolean', 'Donations are tax deductible by default', true);

-- Volunteer Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('volunteer_background_check_required', 'false', 'boolean', 'Require background checks for volunteers', false),
('volunteer_auto_approve', 'false', 'boolean', 'Automatically approve volunteer applications', false),
('volunteer_min_age', '16', 'number', 'Minimum age for volunteers', true);

-- Event Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('event_default_timezone', '"America/Chicago"', 'string', 'Default timezone for events', false),
('event_max_attendees_default', '50', 'number', 'Default max attendees for events', false);

-- Analytics Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('analytics_enabled', 'true', 'boolean', 'Enable analytics tracking', false),
('analytics_retention_days', '365', 'number', 'Days to retain analytics data', false);

-- Payment Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('stripe_test_mode', 'true', 'boolean', 'Use Stripe test mode', false),
('payment_currency', '"USD"', 'string', 'Default payment currency', true);

-- Email Report Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('weekly_report_enabled', 'true', 'boolean', 'Send weekly reports to CEO', false),
('weekly_report_day', '1', 'number', 'Day of week for weekly report (1=Monday)', false),
('weekly_report_email', '"meauxbility@gmail.com"', 'string', 'Email address for weekly reports', false);

-- Social Media Links (public)
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('social_links', '{
  "facebook": "https://facebook.com/meauxbility",
  "instagram": "https://instagram.com/meauxbility",
  "twitter": "https://twitter.com/meauxbility",
  "linkedin": "https://linkedin.com/company/meauxbility"
}'::jsonb, 'json', 'Social media profile links', true);

-- =====================================================================
-- 2. INITIAL CAMPAIGNS
-- =====================================================================

-- General Operating Fund
INSERT INTO public.campaigns (
  name,
  slug,
  description,
  goal_amount_cents,
  is_active,
  start_date
) VALUES (
  'General Operating Fund',
  'general-operating-fund',
  'Support the day-to-day operations of Meauxbility and help us continue our mission to empower communities through accessibility.',
  100000000, -- $1,000,000
  true,
  NOW()
);

-- Emergency Response Fund
INSERT INTO public.campaigns (
  name,
  slug,
  description,
  goal_amount_cents,
  is_active,
  start_date
) VALUES (
  'Emergency Response Fund',
  'emergency-response-fund',
  'Help us respond quickly to urgent community needs with our emergency response fund.',
  25000000, -- $250,000
  true,
  NOW()
);

-- =====================================================================
-- 3. SAMPLE PRODUCTS (Optional - remove if not needed immediately)
-- =====================================================================

-- Digital Volunteer Handbook
INSERT INTO public.products (
  name,
  slug,
  description,
  type,
  price_cents,
  sku,
  is_active,
  is_featured
) VALUES (
  'Volunteer Handbook (Digital)',
  'volunteer-handbook-digital',
  'Comprehensive guide for Meauxbility volunteers including policies, procedures, and best practices.',
  'digital',
  0, -- Free
  'VH-DIGITAL-001',
  true,
  false
);

-- =====================================================================
-- 4. ADMIN USER SETUP INSTRUCTIONS
-- =====================================================================

-- NOTE: Admin users (Sam, Connor, Fred) will be created through Supabase Auth
-- After users sign up, run the following SQL to upgrade them to admins:

-- STEP 1: Have Sam, Connor, and Fred sign up via the application
-- STEP 2: Find their user IDs in Supabase Dashboard > Authentication > Users
-- STEP 3: Run the appropriate SQL below (replace {user_id} with actual UUID)

-- Example SQL to upgrade users to admin roles:
--
-- -- Upgrade Sam to CEO
-- UPDATE public.profiles
-- SET role = 'ceo', admin_type = 'sam_ceo'
-- WHERE email = 'sam@meauxbility.org';
--
-- -- Upgrade Connor to CTO
-- UPDATE public.profiles
-- SET role = 'cto', admin_type = 'connor_cto'
-- WHERE email = 'connor@meauxbility.org';
--
-- -- Upgrade Fred to CMO
-- UPDATE public.profiles
-- SET role = 'cmo', admin_type = 'fred_cmo'
-- WHERE email = 'fred@meauxbility.org';

-- =====================================================================
-- 5. SAMPLE PROJECT (Optional)
-- =====================================================================

-- Initial Platform Development Project
-- This will be created after admin users are set up
-- Example SQL (run after admins are created):
--
-- INSERT INTO public.projects (
--   name,
--   slug,
--   description,
--   status,
--   priority,
--   start_date,
--   project_lead_id
-- ) VALUES (
--   'Platform Development',
--   'platform-development',
--   'Initial development and launch of the Meauxbility platform',
--   'active',
--   'high',
--   '2025-10-20',
--   (SELECT id FROM public.profiles WHERE admin_type = 'connor_cto')
-- );

-- =====================================================================
-- 6. SAMPLE NOTIFICATIONS SETUP
-- =====================================================================

-- These will be created automatically by triggers as users interact with the system
-- No seed data needed for notifications

-- =====================================================================
-- 7. CONTENT PAGES (Optional)
-- =====================================================================

-- About Us Page
-- INSERT INTO public.posts (
--   title,
--   slug,
--   content,
--   excerpt,
--   status,
--   published_at,
--   author_id
-- ) VALUES (
--   'About Meauxbility',
--   'about',
--   'Content here...',
--   'Learn about our mission and vision',
--   'published',
--   NOW(),
--   (SELECT id FROM public.profiles WHERE admin_type = 'sam_ceo')
-- );

-- =====================================================================
-- POST-DEPLOYMENT CHECKLIST
-- =====================================================================

/*
After running this seed data, complete the following:

1. [ ] Create admin user accounts via Supabase Auth
2. [ ] Upgrade admin users using the SQL above
3. [ ] Configure Stripe API keys in api_keys table (encrypted)
4. [ ] Configure SendGrid API key
5. [ ] Set up SendGrid email templates
6. [ ] Upload initial images to storage buckets
7. [ ] Test donation flow end-to-end
8. [ ] Test volunteer application flow
9. [ ] Test event registration
10. [ ] Configure weekly report scheduled job
11. [ ] Set up daily metrics calculation scheduled job
12. [ ] Configure Google OAuth settings
13. [ ] Configure Apple Sign In (if needed)
14. [ ] Test RLS policies with different user roles
15. [ ] Set up monitoring and error tracking (Sentry)

SCHEDULED JOBS TO SET UP IN SUPABASE:

1. Weekly CEO Report (Sundays at 8 AM)
   SELECT cron.schedule(
     'weekly-ceo-report',
     '0 8 * * 0',
     'SELECT public.generate_weekly_ceo_report()'
   );

2. Daily Dashboard Metrics (Every day at midnight)
   SELECT cron.schedule(
     'daily-dashboard-metrics',
     '0 0 * * *',
     'SELECT public.update_daily_dashboard_metrics()'
   );

3. Process Email Queue (Every 5 minutes)
   SELECT cron.schedule(
     'process-email-queue',
     '*/5 * * * *',
     'SELECT public.process_email_queue()' -- You'll need to create this function
   );
*/

-- =====================================================================
-- COMPLETED: Seed Data Loaded
-- =====================================================================
-- System is now ready for initial configuration
-- Follow the post-deployment checklist above
-- =====================================================================
