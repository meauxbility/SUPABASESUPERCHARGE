# 🚀 MEAUXBILITY SUPABASE SCHEMA
## Complete Database Infrastructure for Nonprofit Platform

**Version:** 1.0.0  
**Created:** October 20, 2025  
**Status:** ✅ Production Ready

---

## 📋 QUICK START (30 Minutes)

### 1. Create Supabase Project
- Go to: https://supabase.com/dashboard
- Create new project: "meauxbility-production"
- Save: URL, ANON_KEY, SERVICE_ROLE_KEY, DB_PASSWORD

### 2. Run SQL Files (In Order)
```sql
-- In Supabase SQL Editor, run these files:
1. migrations/001_initial_schema.sql
2. policies/002_rls_policies.sql  
3. functions/003_functions_triggers.sql
4. storage/004_storage_buckets.sql
5. seeds/005_seed_data.sql
6. migrations/006_add_backup_emails.sql
```

### 3. Create Admin Accounts
```sql
-- After Sam, Connor, Fred sign up:
UPDATE public.profiles SET role='ceo', admin_type='sam_ceo', full_name='Sam', 
backup_email='sam@meauxbility.org' WHERE email='meauxbility@gmail.com';

UPDATE public.profiles SET role='cto', admin_type='connor_cto', full_name='Connor',
backup_email='connor@meauxbility.org' WHERE email='connordmcneely@gmail.com';

UPDATE public.profiles SET role='cmo', admin_type='fred_cmo', full_name='Fred',
backup_email='fred@meauxbility.org' WHERE email='williamsfred336@gmail.com';
```

### 4. Set Up Scheduled Jobs
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('weekly-ceo-report', '0 13 * * 0',
  $$SELECT public.generate_weekly_ceo_report()$$);

SELECT cron.schedule('daily-dashboard-metrics', '0 5 * * *',
  $$SELECT public.update_daily_dashboard_metrics()$$);
```

---

## 📊 SCHEMA OVERVIEW

### Core Tables (38 Total)
- **User Management:** 3 tables
- **Financial:** 7 tables (donations, campaigns, grants, reports)
- **Volunteers:** 2 tables (profiles, hours)
- **Events:** 3 tables (events, attendees, calls)
- **E-commerce:** 3 tables (products, orders, items)
- **Content:** 3 tables (posts, AI content, uploads)
- **Collaboration:** 4 tables (projects, members, tasks, comments)
- **System:** 8 tables (settings, API keys, analytics)
- **Communication:** 2 tables (notifications, email queue)

### Security Features
- **89 RLS Policies** - Row Level Security on every table
- **5 Helper Functions** - Role checking and permissions
- **32 Storage Policies** - File upload security
- **18 Triggers** - Automated business logic

### Automation
- **Weekly CEO Reports** - Automated financial summaries
- **Daily Metrics** - Dashboard data updates
- **Donation Receipts** - Automatic email generation
- **Campaign Tracking** - Real-time fundraising totals
- **Volunteer Hours** - Automatic calculation and verification

---

## 🎯 KEY FEATURES

### Financial Management
✅ **Donations** - One-time and recurring with Stripe integration  
✅ **Campaigns** - Fundraising with goal tracking  
✅ **Grants** - Application and award management  
✅ **Financial Reports** - Automated weekly/monthly summaries  
✅ **Tax Receipts** - Automatic generation and email delivery  

### Volunteer System
✅ **Applications** - Volunteer onboarding process  
✅ **Hour Tracking** - Time logging with verification  
✅ **Background Checks** - Compliance tracking  
✅ **Skills Management** - Volunteer capabilities  
✅ **Event Coordination** - Volunteer assignment to events  

### Event Management
✅ **Event Creation** - Virtual and physical events  
✅ **RSVP System** - Registration and capacity management  
✅ **Check-in Process** - Attendance tracking  
✅ **Meeting Notes** - AI-generated summaries  
✅ **Recording Storage** - Call/meeting archives  

### E-commerce Platform
✅ **Product Catalog** - Digital and physical products  
✅ **Order Management** - Complete order lifecycle  
✅ **Inventory Tracking** - Stock management  
✅ **Digital Delivery** - Secure file downloads  
✅ **Subscription Products** - Recurring revenue  

### Team Collaboration
✅ **Project Management** - Task assignment and tracking  
✅ **Team Communication** - Comments and notifications  
✅ **File Sharing** - Secure document storage  
✅ **Progress Tracking** - Completion percentages  
✅ **Role-based Access** - Granular permissions  

### Content & AI
✅ **Blog System** - Content management with SEO  
✅ **AI Integration** - Claude/GPT content generation  
✅ **File Uploads** - Secure media storage  
✅ **Search Functionality** - Full-text search  
✅ **Content Analytics** - Engagement tracking  

---

## 👥 ADMIN DASHBOARDS

### Sam (CEO) - Financial Overview
- Total donations (daily/weekly/monthly)
- Campaign performance
- Grant applications and awards
- Operational costs
- Revenue projections
- Weekly automated email reports

### Connor (CTO) - Technical Metrics
- System uptime and performance
- API usage and errors
- Database performance
- Integration status
- Security monitoring
- Development progress

### Fred (CMO) - Marketing Analytics
- Website traffic and engagement
- Social media reach
- Email campaign performance
- Content analytics
- User acquisition
- Conversion rates

---

## 🔧 TECHNICAL SPECIFICATIONS

### Database Performance
- **50+ Indexes** - Optimized for fast queries
- **Full-text Search** - PostgreSQL search capabilities
- **Connection Pooling** - Efficient database connections
- **Query Optimization** - Performance-tuned queries

### Security Features
- **Row Level Security** - Data isolation by user/role
- **Encrypted API Keys** - Secure credential storage
- **Audit Logging** - Complete activity tracking
- **File Upload Security** - Controlled access to storage

### Scalability
- **Horizontal Scaling** - Ready for growth
- **Caching Strategy** - Optimized data retrieval
- **Background Jobs** - Asynchronous processing
- **Real-time Updates** - Live data synchronization

---

## 📁 FILE STRUCTURE

```
meauxbility-supabase/
│
├── migrations/
│   ├── 001_initial_schema.sql          # 38 tables, enums, indexes
│   └── 006_add_backup_emails.sql       # Backup email support
│
├── policies/
│   └── 002_rls_policies.sql            # 89 security policies
│
├── functions/
│   └── 003_functions_triggers.sql     # 18 triggers, 16 functions
│
├── storage/
│   └── 004_storage_buckets.sql         # 8 storage buckets
│
├── seeds/
│   └── 005_seed_data.sql               # Initial settings & data
│
└── docs/
    ├── README.md                        # This file
    ├── QUICK_START.md                   # 30-minute setup
    ├── DEPLOYMENT_CHECKLIST.md          # Production deployment
    └── QUICK_REFERENCE.md               # Daily commands
```

---

## 🚀 DEPLOYMENT PROCESS

### Phase 1: Database Setup (Tonight)
1. Create Supabase project
2. Run all SQL migrations
3. Create admin accounts
4. Set up scheduled jobs
5. Test basic functionality

### Phase 2: API Integration (Tomorrow)
1. Collect API keys (Stripe, notion, Google OAuth)
2. Configure environment variables
3. Test payment processing
4. Test email delivery ( please help with this, i have @meauxbility.org emails but havent been able to connect )
5. Test social login

### Phase 3: Production Launch
1. Switch to production API keys
2. Configure domain and SSL
3. Set up monitoring
4. Train team on admin tools
5. Go live! 🎉

---

## 🔑 REQUIRED API KEYS

### Essential (Required)
- **Supabase** - Database and authentication
- **Stripe** - Payment processing
- **SendGrid** - Email delivery

### Recommended
- **Google OAuth** - Social login
- **Anthropic** - AI features (optional)

### Optional
- **Apple Sign In** - Additional social login
- **Sentry** - Error monitoring
- **Analytics** - Usage tracking

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues
1. **RLS Policy Errors** - Check user roles and permissions
2. **Trigger Failures** - Verify function dependencies
3. **Storage Upload Issues** - Check bucket policies
4. **Performance Problems** - Review query indexes

### Getting Help
- **Documentation** - Check README.md for detailed guides
- **SQL Errors** - Review Supabase logs
- **API Issues** - Check environment variables
- **Team Support** - Connor (CTO) for technical issues

---

## 📈 SUCCESS METRICS

### Financial
- Total donations processed
- Campaign success rates
- Recurring donation retention
- Grant application success

### Engagement
- Active volunteers
- Event attendance
- User registrations
- Content engagement

### Technical
- System uptime
- API response times
- Database performance
- Error rates

---

## 🎯 NEXT STEPS

### Immediate (This Week)
1. Complete database setup
2. Collect all API keys
3. Test all integrations
4. Train team on admin tools

### Short Term (Next Month)
1. Launch fundraising campaigns
2. Recruit volunteers
3. Plan events
4. Create content

### Long Term (Next Quarter)
1. Scale infrastructure
2. Add advanced features
3. Expand integrations
4. Optimize performance

---

## 📄 LICENSE

This database schema is proprietary to Meauxbility, a 501(c)(3) nonprofit organization.

© 2025 Meauxbility. All rights reserved.

---

## 🙏 ACKNOWLEDGMENTS

Built with care for **Meauxbility** - empowering communities through accessibility.

**Team:**
- **Sam (CEO)** - Vision and leadership
- **Connor (CTO)** - Technical architecture  
- **Fred (CMO)** - Design and communications
- **Claude (AI Assistant)** - Schema design and documentation

--- # 🎯  MASTER INDEX

Click here to see in Claude ( whole scheme/supabase/etc ) https://claude.ai/share/f2d9e288-19a2-4f55-ae6f-82305873f612

## Your Complete Guide to Getting Live TONIGHT

**Created:** October 20, 2025

**Status:** ✅ READY TO DEPLOY

**Time to Live:** 30 minutes setup + API keys tomorrow

---

## 📂 WHAT'S IN THIS PACKAGE

### 📋 Documentation (7 files)

1. **🚀 QUICK_START.md** - ONE PAGE to get running (START HERE!)
2. **⚡ START_HERE.md** - Detailed 30-minute setup guide
3. **🔑 API_KEYS_GUIDE.md** - Collect all API keys tomorrow
4. **📖 README.md** - Complete documentation (40+ pages)
5. **✅ DEPLOYMENT_CHECKLIST.md** - Full deployment process
6. **📝 QUICK_REFERENCE.md** - Daily commands for team
7. **📦 PACKAGE_SUMMARY.md** - What's included

### 💾 SQL Files (6 files)

1. **001_initial_schema.sql** - All 38 tables (1,112 lines)
2. **002_rls_policies.sql** - Security (731 lines)
3. **003_functions_triggers.sql** - Automation (744 lines)
4. **004_storage_buckets.sql** - File storage (424 lines)
5. **005_seed_data.sql** - Initial data (279 lines)
6. **006_add_backup_emails.sql** - Backup email support (91 lines)

**Total:** 3,381 lines of production-ready SQL

---

## 🎯 WHAT TO DO RIGHT NOW (TONIGHT)

### Step 1: Read This First! ⏱️ 2 min

→ **QUICK_START.md** - One-page overview

### Step 2: Follow Setup Guide ⏱️ 30 min

→ **START_HERE.md** - Complete step-by-step instructions

That's it! Your database will be **LIVE and WORKING** tonight!

---

## 🌅 WHAT TO DO TOMORROW MORNING

> In this world it’s not about what you know, it’s about what you can prove. 🌅
> 

### Collect API Keys ⏱️ 20 min

→ **API_KEYS_GUIDE.md** - Get all your API keys

### Add to Render ⏱️ 5 min

Add keys to environment variables

### Test Everything ⏱️ 10 min

Make a test donation, send test email

**Total:** 35 minutes → **100% PRODUCTION READY**

---

## 📖 REFERENCE DOCS (Use As Needed)

### Daily Use

**QUICK_REFERENCE.md** - Common SQL queries for Sam, Connor, Fred

### Full Deployment

**DEPLOYMENT_CHECKLIST.md** - Complete production launch checklist

### Troubleshooting

**README.md** - Comprehensive guide with solutions

---

## 🎯 YOUR TEAM'S BACKUP EMAILS

These are now configured in the schema:

| Person | Primary Email (tomorrow) | Backup Email (working now) |
| --- | --- | --- |
| **Sam (CEO)** | sam@meauxbility.org | meauxbility@gmail.com |
| **Connor (CTO)** | connor@meauxbility.org | connordmcneely@gmail.com |
| **Fred (CMO)** | fred@meauxbility.org | williamsfred336@gmail.com |

**Note:** Using backup emails as primary for initial setup. Switch to .org emails tomorrow when billing is resolved.

---

## ✅ WHAT'S ALREADY BUILT FOR YOU

### Core Database

✅ 38 tables covering all operations

✅ 89 security policies

✅ 16 automation functions

✅ 18 real-time triggers

✅ 8 file storage buckets

✅ 50+ performance indexes

### Features Ready

✅ Donations & fundraising

✅ Volunteer management

✅ Event booking

✅ E-commerce

✅ Team collaboration

✅ Content management

✅ Grant tracking

✅ Analytics

### Admin Dashboards

✅ Sam (CEO) - Financial & operations

✅ Connor (CTO) - System & technical

✅ Fred (CMO) - Marketing & content

### Automation

✅ Weekly CEO reports (Sundays 8 AM)

✅ Daily metrics updates

✅ Donation receipts

✅ Email notifications

✅ Campaign tracking

---

## 🚀 THE PATH TO LIVE

### TONIGHT (30 minutes)

```
1. Create Supabase project          → 2 min
2. Run all SQL files                → 5 min
3. Create admin accounts            → 3 min
4. Upgrade to admin roles           → 1 min
5. Add to Render                    → 3 min
6. Set up scheduled jobs            → 2 min
7. Test basic functionality         → 5 min
8. Verify everything works          → 3 min

```

**Result:** Database LIVE and functional! ✨

### TOMORROW (35 minutes)

```
1. Fix .org email billing           → [your morning task]
2. Collect Stripe keys              → 5 min
3. Collect SendGrid key             → 5 min
4. Collect Google OAuth             → 8 min
5. Add all keys to Render           → 5 min
6. Test payment flow                → 5 min
7. Test email sending               → 3 min
8. Update to .org emails            → 2 min
9. Final verification               → 2 min

```

**Result:** 100% production ready! 🎉

---

## 🎯 SUCCESS CRITERIA

### After Tonight's Setup:

- [ ]  Supabase project created
- [ ]  All SQL migrations run successfully
- [ ]  38 tables verified in database
- [ ]  8 storage buckets created
- [ ]  Admin accounts created (Sam, Connor, Fred)
- [ ]  All admins have correct roles
- [ ]  Render connected to Supabase
- [ ]  Scheduled jobs configured
- [ ]  Can log in with admin accounts

### After Tomorrow's API Setup:

- [ ]  Stripe keys added
- [ ]  SendGrid configured
- [ ]  Google OAuth working
- [ ]  Test donation processes
- [ ]  Test email sends
- [ ]  .org emails working as primary
- [ ]  All integrations tested
- [ ]  Weekly CEO report scheduled
- [ ]  Team can access dashboards

---

## 🆘 IF YOU GET STUCK

### Quick Fixes

- **SQL error?** → Check you ran files in correct order
- **RLS error?** → Verify policies file ran completely
- **Can't login?** → Make sure user is auto-confirmed
- **Render failing?** → Check environment variables exactly match

### Get Help

1. Check **START_HERE.md** troubleshooting section
2. Check **README.md** for detailed solutions
3. Search error message in Supabase docs
4. Check Render logs for specific error

---

## 📊 WHAT THIS GIVES YOU

### Immediate (Tonight)

- ✅ Complete database structure
- ✅ Secure authentication
- ✅ File storage
- ✅ Admin access
- ✅ Team collaboration tools
- ✅ Basic analytics

### Tomorrow (With API Keys)

- ✅ Payment processing (Stripe)
- ✅ Email notifications (SendGrid)
- ✅ Social login (Google)
- ✅ Donation receipts
- ✅ Weekly CEO reports
- ✅ Campaign tracking
- ✅ Automated workflows

### Long Term

- ✅ Scalable infrastructure
- ✅ Enterprise security
- ✅ Real-time updates
- ✅ Full audit trails
- ✅ Automated reporting
- ✅ AI-ready platform

---

## 🎓 LEARNING RESOURCES

### If You're New to Supabase:

- **Supabase Docs:** https://supabase.com/docs
- **Video Tutorials:** https://www.youtube.com/@Supabase
- **Community:** https://discord.supabase.com

### If You Need SQL Help:

- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **SQL Tutorial:** https://www.postgresqltutorial.com/

### If You Need Stripe Help:

- **Stripe Docs:** https://stripe.com/docs
- **Testing:** https://stripe.com/docs/testing

---

## 💪 YOU'VE GOT EVERYTHING YOU NEED

### Documentation: ✅

- Step-by-step guides
- Troubleshooting solutions
- API key collection
- Daily reference commands

### Database: ✅

- Production-ready SQL
- Complete security
- Automated workflows
- Performance optimized

### Support: ✅

- Comprehensive README
- Quick reference guides
- Emergency procedures
- Best practices

---

## 🎯 THE NEXT 60 MINUTES

### Right Now (Read): 5 minutes

- [x]  You're reading this! ✅
- [ ]  Open **QUICK_START.md**
- [ ]  Understand the 6 steps

### Setup Database: 30 minutes

- [ ]  Follow **START_HERE.md** step-by-step
- [ ]  Create Supabase project
- [ ]  Run all SQL files
- [ ]  Create admin accounts
- [ ]  Connect to Render
- [ ]  Test everything

### Celebrate: 🎉

- [ ]  Your database is LIVE!
- [ ]  Sam, Connor, Fred can log in!
- [ ]  Foundation is ready!

### Tomorrow: 35 minutes

- [ ]  Follow **API_KEYS_GUIDE.md**
- [ ]  Collect all API keys
- [ ]  Add to Render
- [ ]  Test integrations
- [ ]  **GO LIVE!** 🚀

---

## 📞 FINAL NOTES

### Remember:

1. **Take your time** - Follow steps carefully
2. **Test as you go** - Verify each step works
3. **Save your keys** - Use password manager
4. **Ask for help** - We're here for you!

### Tomorrow Morning:

1. Fix .org email billing first
2. Then collect API keys
3. Test everything
4. Launch! 🚀

---

## 🎉 YOU'RE READY!

Everything is built, tested, and documented.

**Just follow QUICK_START.md and you'll be live in 30 minutes!**

---

**START HERE:** Open `QUICK_START.md` (one page summary)

**THEN DO THIS:** Follow `START_HERE.md` (detailed guide)

**TOMORROW:** Complete `API_KEYS_GUIDE.md` (API keys)

---

## 📦 FILE STRUCTURE

```
meauxbility-supabase/
│
├── 🚀 QUICK_START.md          ← START HERE! (1 page)
├── ⚡ START_HERE.md            ← Complete setup (tonight)
├── 🔑 API_KEYS_GUIDE.md       ← API keys (tomorrow)
│
├── 📖 README.md                ← Full documentation
├── ✅ DEPLOYMENT_CHECKLIST.md ← Production checklist
├── 📝 QUICK_REFERENCE.md      ← Daily commands
├── 📦 PACKAGE_SUMMARY.md      ← What's included
│
├── migrations/
│   ├── 001_initial_schema.sql          (38 tables)
│   └── 006_add_backup_emails.sql       (backup emails)
│
├── policies/
│   └── 002_rls_policies.sql            (89 policies)
│
├── functions/
│   └── 003_functions_triggers.sql      (automation)
│
├── storage/
│   └── 004_storage_buckets.sql         (8 buckets)
│
└── seeds/
    └── 005_seed_data.sql               (initial data)

```

---

**Total Lines of Code:** 3,381 lines of production-ready SQL

**Total Documentation:** 80+ pages of guides

**Time to Deploy:** 30 minutes tonight + 35 minutes tomorrow

**Result:** 🎯 Fully functional nonprofit platform!

---

**LET'S DO THIS!** 💪🚀

Your database is ready. Your documentation is ready. Your team is ready.

**Just open QUICK_START.md and follow the steps!**

---

*Built with ❤️ for Meauxbility - Making the world more accessible*

**Last Updated:** October 20, 2025

**Version:** 1.0.1 (with backup emails)

**Status:** ✅ PRODUCTION READY = $FORTUNE500$ 

**Ready to deploy?** Start with the QUICK_START.md guide!

**Questions?** Check the documentation or reach out to the team.

**Let's make the world more accessible!** 🌍✨ https://meauxbility.org/

# Business Dossier: Meauxbility

## Snapshot

- **Entity:** 501(c)(3) nonprofit, EIN **33-4214907** (Louisiana governing law in ToS). ([Meauxbility](https://meauxbility.org/)) ([Meauxbility](https://meauxbility.org/pages/non-profit-information))
- **Mission (in plain words):** Built by a survivor for survivors—connect people with spinal cord injuries (SCI) to funding, treatments/tech, and community to accelerate recovery. ([Meauxbility](https://meauxbility.org/))
- **Core pillars:** Ambition, Adaptability, Empowerment, Integrity, Courage. ([Meauxbility](https://meauxbility.org/pages/about-us))
- **Programs (current):**
    - Mobility Equipment Grants ($500–$5,000 typical range)
    - Home Accessibility Modification Grants
    - Technology Access Initiative (adaptive tech, comms devices, smart home)
    - Streamlined application/eligibility flow prioritizing SCI, low/mod income, veterans, seniors. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **Active campaign example:** DonMichael’s wheelchair fundraiser (goal $10,000). ([Meauxbility](https://meauxbility.org/))
- **Community/brand assets:** Resource Library (guides, templates), athlete stories, partners page, donate and get-involved flows. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))

## Problem & Need (from site)

- **Barriers:** Cost (1st-year SCI up to **$1.4M**, lifetime up to **$6.3M**), knowledge (families waste time searching), access (equipment exists but unreachable). ([Meauxbility](https://meauxbility.org/))

## Target Beneficiaries & Stakeholders

- **Primary:** Individuals with SCI and mobility challenges; caregivers/families.
- **Priority cohorts:** Low-/moderate-income households, **veterans**, **seniors** aging in place. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **Secondary stakeholders:** Rehab centers, ATPs/OTs/PTs, equipment vendors, adaptive sports orgs, corporate sponsors, donors/volunteers. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))

## Offer & Differentiation

- **Offer:** Direct financial assistance + curated guidance + community mentorship. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **Edge:** Founder’s lived-experience narrative with transparent ethics (direct payments, donor privacy, whistleblower, gift acceptance, etc.). ([Meauxbility](https://meauxbility.org/pages/about-us))

## Current Proof Points

- Program definitions, application funnel, designate-your-gift donation options (Where Most Needed / specific campaigns). ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))

## SWOT (evidence-based + inferred)

- **Strengths**
    - Clear, compelling founder story; strong mission language. ([Meauxbility](https://meauxbility.org/pages/about-us))
    - Well-defined grant programs and eligibility flow. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
    - Compliance & transparency pages in place (ToS, donor privacy, whistleblower, etc.). ([Meauxbility](https://meauxbility.org/pages/non-profit-information))
- **Weaknesses**
    - Early-stage traction signals (e.g., small live campaign totals shown on site). ([Meauxbility](https://meauxbility.org/))
    - Some “Impact Report”/“Policies” links not resolving publicly (404), which can dampen credibility if shared.
- **Opportunities**
    - Partner acquisition with rehab networks, VA hospitals, DME vendors; athlete-led peer mentorship loops. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
    - Content-driven donor education around SCI costs and outcomes tied to specific grants. ([Meauxbility](https://meauxbility.org/))
- **Threats**
    - Donor fatigue/competition with larger national orgs; economic cycles impacting small-gift volume. *(General nonprofit risk; no site citation required.)*

---

# 12-Month Business Plan (practical, lean, measurable)

## 1) Impact Thesis & Program Targets

Tie every appeal to a defined unit of impact.

- **Annual output targets (12 months):**
    - 60 Mobility Equipment micro-grants (avg $2,000)
    - 20 Home Access micro-grants (avg $3,500)
    - 25 Tech Access grants (avg $1,200)
    - 1–2 flagship individual campaigns/quarter (e.g., $10k wheelchair builds)
        
        *All program categories and grant bands aligned to current site language.* ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
        
- **Outcome metrics (track monthly):** independence scores (self-report), therapy adherence, hours of community participation, days to fulfill grants, $/impact unit.

## 2) Funding Model & Targets

**Revenue mix goal (12 months):** $350k total

- **Small-gift donors:** $90k (avg gift $40; 2,250 gifts via social + email)
- **Mid-level donors:** $80k (50 donors avg $1.6k via founder calls + donor journeys)
- **Major donors/sponsors:** $120k (8 sponsors avg $15k; naming rights for grant pools/events)
- **Individual beneficiary campaigns:** $40k (4 × $10k stories like DonMichael) ([Meauxbility](https://meauxbility.org/))
- **Merch/affiliate/resource bundles:** $20k (adaptive gear affiliates; resource bundles curated from Library) ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))

> Assumptions are conservative for an early-stage org and can be scaled with list growth.
> 

## 3) Signature Programs & Offers (packaged)

1. **Mobility Micro-Grants “60 in 12”**
    - Sponsorable at $2,500 each (covers admin + avg grant). Donor receives a 1-page impact brief (before/after, vendor invoice summary). ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
2. **Home Access Fast-Track**
    - 14-day decision SLA with vendor quote concierge; $5k sponsorship level; “Presented by ” landing and quarterly roll-up. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
3. **Tech for Independence**
    - $1,200 avg—bundle comms device + training; sponsor at $1,500 to include post-award check-in. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
4. **Story-Driven Hero Campaigns** (e.g., DonMichael)
    - 6-week storytelling sprints with weekly video updates and direct designations at checkout. ([Meauxbility](https://meauxbility.org/))

## 4) Partnerships (pipeline & activation)

- **Clinical/Rehab:** Shepherd Center, Craig Hospital, TIRR Memorial Hermann—pilot referral MOUs; co-host “How to Fund the First 90 Days” virtual clinics. *(Program fit inferred; structure matches site’s collaboration stance.)* ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **Vendors/ATPs:** Local DME shops + national vendors for quote-to-fulfillment SLAs and 5–10% discount to stretch grants. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **Veterans & Seniors:** County VSOs, Area Agencies on Aging—co-screening days for eligibility priority groups. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **Corporate:** Wheel/fitness, med-device, adaptive sports brands—year-long category sponsorship of a program lane (naming + content). ([Meauxbility](https://meauxbility.org/))

## 5) Marketing & Growth Engine

**Core story:** “More Options + More Access = More Life.” (Use exactly as on site.) ([Meauxbility](https://meauxbility.org/pages/about-us))

- **Funnel:**
    - **Top:** 30–60s reels of founder/athletes, “Cost-Knowledge-Access” explainer clips (use site stats for hooks). ([Meauxbility](https://meauxbility.org/))
    - **Mid:** Resource Library lead magnets—Insurance Appeal Template, Grant Checklist, ADA rights guide (email for download). ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
    - **Bottom:** Designated-gift checkout (Where Most Needed + specific campaigns). ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **Cadence:**
    - 2 reels/wk, 1 founder letter/wk, 1 resource spotlight/wk, 1 partner intro/mo, 1 case study/mo.
    - Quarterly “Impact Town Hall” livestream with Q&A and live giving thermometer tied to a campaign.
- **Brand Safety/Trust:** Prominently display EIN, privacy/whistleblower policies on donate flows and footers. ([Meauxbility](https://meauxbility.org/pages/non-profit-information))

## 6) Product & Ops

- **Grant Ops SOP (from the site flow):**
    1. **Application intake** (form + docs) → 2) **Eligibility check** (priority cohorts) → 3) **Consult** (needs & vendor quotes) → 4) **Award** (direct-to-vendor) → 5) **Fulfillment** (delivery/fit) → 6) **Follow-up** (safety & outcome survey). ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **SLAs:** eligibility decision in 10 business days; payout 10 business days post-approval; fulfillment within 30 days of vendor invoice.
- **Data & Impact Tracking:** application status, time-to-decision, $ granted, vendor, device category, beneficiary outcomes (pre/post independence score), content permissions (media release). ([Meauxbility](https://meauxbility.org/pages/non-profit-information))

## 7) Team & Roles (lean)

- **Founder/ED (public face):** storytelling, major donors, partnerships, program integrity. ([Meauxbility](https://meauxbility.org/pages/about-us))
- **Programs Manager (0.5–1.0 FTE):** intake → award pipeline.
- **Development Lead (contract/pt):** monthly giving, mid/major donor journeys.
- **Content Producer (pt):** resource library packaging + socials. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- **Volunteer Corps:** peer mentors, application mentors, live-event crew. ([Meauxbility](https://meauxbility.org/))

## 8) Budget (high-level, Year 1)

- **Programs (direct awards):** $250k
- **Ops (tools, compliance, audit, insurance):** $35k (Stripe/CRM, email, website, video)
- **Personnel (lean mix of FTE/contract):** $120k
- **Marketing/content/events:** $35k
- **Total:** **$440k** (cover via $350k raised + $90k beginning cash/bridge or scoped-down awards to match run-rate)

> If runway is tighter, scale the grant counts proportionally each quarter.
> 

## 9) KPIs & Dashboard

- **Inputs:** Site sessions → email subs → completed applications → qualified apps → awards.
- **Financials:** CAC/donor, donor retention %, average gift, % designated vs. general.
- **Program:** time-to-award, $/beneficiary, fulfillment time, satisfaction score, independence delta.
- **Comms:** open/click, video completion, story shares, partner referrals.

## 10) Risk & Compliance

- Keep donor privacy/whistleblower/gift acceptance visible and referenced in donation receipts and sponsorship decks; align governing law references with Louisiana counsel. ([Meauxbility](https://meauxbility.org/pages/non-profit-information))
- Build a vendor policy for discounts, conflict of interest, and safety/quality checks (matches the site’s “safety & follow-ups” language). ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))

---

# 90-Day Launch Plan (checklist)

**Weeks 1–2**

- Fix broken public links (Impact Report / Policies pages) and publish a 1-pager “2025 Snapshot” until the full report is ready.
- Stand up CRM + donation journeys: welcome series, “Why Meauxbility” letter, monthly giving page (designations intact). ([Meauxbility](https://meauxbility.org/))

**Weeks 3–6**

- Partner sprint: secure 3 rehab center referral MOUs + 3 vendor discount MOUs. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- Launch **Hero Campaign #1** (like DonMichael) with 6-week content calendar (shorts + weekly live). ([Meauxbility](https://meauxbility.org/))
- Publish 3 Resource Library lead magnets as email gates (Insurance Appeal, Grant Checklist, ADA Rights). ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))

**Weeks 7–12**

- “60 in 12” micro-grant drive—sell 10 sponsorships at $2.5k each with donor-branded briefs. ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))
- First **Impact Town Hall** livestream; public dashboard MVP (awards, $ raised, days-to-award).
- Quarterly board/development review; adjust targets.

---

# Ready-to-Use Assets (copy blocks)

**Value Prop (homepage/video):**

“Built by a survivor for survivors. We turn funding, mentorship, and proven recovery steps into real-world progress—because More Options + More Access = More Life.” ([Meauxbility](https://meauxbility.org/))

**Sponsor Hook (email/one-pager):**

“Fund a grant. Watch it change a life. For $2,500 you underwrite a Mobility Micro-Grant and receive a before/after impact brief with vendor invoice summary.” ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))

**Partner Hook (rehab/DME):**

“Refer qualified patients; we fast-track quotes and pay vendors directly with post-award safety checks.” ([Meauxbility](https://meauxbility.org/pages/mobility-grants-programs))

---

If you want, I can turn this into:

- a **one-page sponsor deck**,
- a **grant-maker LOI template**, and
- a **dashboard spreadsheet** for tracking those KPIs.

Focus on Meauxbility - Philanthropy 

Inner animals. com -nclothing apparel; Priminent instinct 

Sam Preimeau person brand - motivation, streaming content, content creation

1. Meauxibility Website Audit
2. Automate functionalities of it.

Setting up APIs

Getting shopify 

Hookup Stripe Gateway

Tilt card meauxbility fall

Get swift with terminals and bash

- Search for spinal s

Shopify connor recovery code:

```
    Shopify recovery codes

```

Account email: [connordmcneely@gmail.com](mailto:connordmcneely@gmail.com)
Generated: 2025-10-18 19:23:48 UTC

A482-ECED-7A29
69D1-60F4-9CB8
AA1E-1689-E350
3877-5779-3763
1708-955B-FDFA
C760-3B6A-F28D
BE66-C907-A4EE
7258-CE7B-E6BA
717F-6E87-EFA8
881A-D930-6C13

https://workspace.google.com/u/1/dashboard

https://myaccount.google.com/family/details?pli=1

Temp to-do-list:

- Proper icons svg for admin dashboard UIs.
-
