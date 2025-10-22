# ⚡ MEAUXBILITY - ONE-PAGE QUICK START

**GET YOUR DATABASE RUNNING IN 30 MINUTES** 🚀

---

## 🎯 THE ESSENTIALS (Do This First!)

### 1. Create Supabase Project (2 min)
```
→ supabase.com/dashboard
→ New Project: "meauxbility-production"
→ Save: URL, ANON_KEY, SERVICE_ROLE_KEY, DB_PASSWORD
```

### 2. Run SQL Files (5 min)
**Supabase → SQL Editor → New Query**
Run these IN ORDER (copy/paste each file):
```
✓ migrations/001_initial_schema.sql
✓ policies/002_rls_policies.sql  
✓ functions/003_functions_triggers.sql
✓ storage/004_storage_buckets.sql
✓ seeds/005_seed_data.sql
✓ migrations/006_add_backup_emails.sql
```

### 3. Create Admin Accounts (3 min)
**Supabase → Authentication → Users → Add User**
```
Sam:    meauxbility@gmail.com     [password] ✓Auto-confirm
Connor: connordmcneely@gmail.com  [password] ✓Auto-confirm
Fred:   williamsfred336@gmail.com [password] ✓Auto-confirm
```

### 4. Upgrade to Admins (1 min)
**Supabase → SQL Editor:**
```sql
UPDATE profiles SET role='ceo', admin_type='sam_ceo', full_name='Sam', 
backup_email='sam@meauxbility.org' WHERE email='meauxbility@gmail.com';

UPDATE profiles SET role='cto', admin_type='connor_cto', full_name='Connor',
backup_email='connor@meauxbility.org' WHERE email='connordmcneely@gmail.com';

UPDATE profiles SET role='cmo', admin_type='fred_cmo', full_name='Fred',
backup_email='fred@meauxbility.org' WHERE email='williamsfred336@gmail.com';
```

### 5. Add to Render (3 min)
**Render → Your Service → Environment**
```bash
SUPABASE_URL=[from step 1]
SUPABASE_ANON_KEY=[from step 1]
SUPABASE_SERVICE_ROLE_KEY=[from step 1]
NODE_ENV=production
PORT=10000
```

### 6. Set Up Cron Jobs (2 min)
**Supabase → SQL Editor:**
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('weekly-ceo-report', '0 13 * * 0',
  $$SELECT public.generate_weekly_ceo_report()$$);

SELECT cron.schedule('daily-dashboard-metrics', '0 5 * * *',
  $$SELECT public.update_daily_dashboard_metrics()$$);
```

---

## ✅ VERIFY IT WORKS

```sql
-- Should return 38
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';

-- Should show 3 admins
SELECT email, role, admin_type FROM profiles 
WHERE role IN ('ceo','cto','cmo');

-- Should return 2
SELECT name FROM campaigns;
```

---

## 🔑 TOMORROW: Collect API Keys

### Stripe (dashboard.stripe.com)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (after webhook setup)
```

### SendGrid (app.sendgrid.com)
```
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@meauxbility.org
```

### Google OAuth (console.cloud.google.com)
```
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

**Add to:** Render → Environment → Save Changes

---

## 🎯 YOU'RE LIVE!

**Working Now:**
✅ Database (38 tables)
✅ Security (89 RLS policies)  
✅ Storage (8 buckets)
✅ Admins (Sam, Connor, Fred)
✅ Automation (2 cron jobs)
✅ Auth (email login)

**Working Tomorrow (with API keys):**
✅ Payments (Stripe)
✅ Emails (SendGrid)  
✅ Social login (Google)

---

## 🆘 QUICK FIXES

**"RLS error":** Run the policies file again  
**"Function not found":** Run functions file again  
**"Render failing":** Check env vars match exactly  
**"Can't login":** Verify user is auto-confirmed

---

## 📖 FULL DOCS

**Right Now:** `START_HERE.md` (detailed walkthrough)  
**Tomorrow:** `API_KEYS_GUIDE.md` (collect all keys)  
**Reference:** `QUICK_REFERENCE.md` (daily commands)  
**Everything:** `README.md` (complete guide)

---

**⏱️ Total Time:** 30 minutes → **FULLY FUNCTIONAL DATABASE** ✨

**Questions?** Check START_HERE.md for step-by-step guide.

**YOU'VE GOT THIS!** 💪