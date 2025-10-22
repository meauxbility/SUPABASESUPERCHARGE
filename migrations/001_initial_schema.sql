-- =====================================================================
-- MEAUXBILITY.ORG - SUPABASE SCHEMA
-- 501(c)(3) Nonprofit Platform - Complete Database Schema
-- =====================================================================
-- Version: 1.0.0
-- Created: 2025-10-20
-- Purpose: Donation platform, community, volunteer management, e-commerce
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- =====================================================================
-- 1. ENUMS - Define all enum types first
-- =====================================================================

CREATE TYPE user_role AS ENUM (
  'admin',
  'ceo',
  'cto', 
  'cmo',
  'volunteer',
  'donor',
  'subscriber',
  'guest'
);

CREATE TYPE admin_type AS ENUM (
  'sam_ceo',
  'connor_cto',
  'fred_cmo'
);

CREATE TYPE donation_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded',
  'disputed'
);

CREATE TYPE subscription_status AS ENUM (
  'active',
  'past_due',
  'canceled',
  'paused',
  'trialing'
);

CREATE TYPE volunteer_status AS ENUM (
  'pending',
  'active',
  'inactive',
  'suspended'
);

CREATE TYPE product_type AS ENUM (
  'digital',
  'service',
  'subscription',
  'physical'
);

CREATE TYPE event_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE task_status AS ENUM (
  'todo',
  'in_progress',
  'review',
  'completed',
  'blocked'
);

CREATE TYPE task_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE grant_status AS ENUM (
  'prospecting',
  'applied',
  'pending',
  'awarded',
  'rejected',
  'completed'
);

-- =====================================================================
-- 2. CORE USER MANAGEMENT
-- =====================================================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  
  -- Role & Permissions
  role user_role DEFAULT 'guest' NOT NULL,
  admin_type admin_type,
  is_active BOOLEAN DEFAULT true,
  
  -- OAuth Providers
  google_id TEXT UNIQUE,
  apple_id TEXT UNIQUE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User Permissions (granular permissions)
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMPTZ,
  
  UNIQUE(user_id, permission_name, resource_type, resource_id)
);

-- User Activity Log
CREATE TABLE public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 3. DONATION & FINANCIAL MANAGEMENT
-- =====================================================================

-- Donations
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Donor Information
  donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  donor_email TEXT NOT NULL,
  donor_name TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  
  -- Payment Information
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT DEFAULT 'USD' NOT NULL,
  
  -- Donation Details
  status donation_status DEFAULT 'pending' NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  frequency TEXT, -- 'monthly', 'quarterly', 'yearly'
  
  -- Tax & Reporting
  is_tax_deductible BOOLEAN DEFAULT true,
  receipt_sent BOOLEAN DEFAULT false,
  receipt_sent_at TIMESTAMPTZ,
  receipt_url TEXT,
  
  -- Campaign/Fund Tracking
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  fund_designation TEXT,
  tribute_name TEXT, -- "In honor of" or "In memory of"
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- Recurring Donations (Subscriptions)
CREATE TABLE public.recurring_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Subscriber Information
  donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  
  -- Subscription Details
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT DEFAULT 'USD' NOT NULL,
  frequency TEXT NOT NULL, -- 'monthly', 'quarterly', 'yearly'
  status subscription_status DEFAULT 'active' NOT NULL,
  
  -- Dates
  start_date TIMESTAMPTZ DEFAULT NOW(),
  next_payment_date TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  
  -- Campaign/Fund
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  fund_designation TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fundraising Campaigns
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Campaign Details
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  goal_amount_cents INTEGER,
  raised_amount_cents INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  -- Media
  image_url TEXT,
  video_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant Management
CREATE TABLE public.grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Grant Details
  name TEXT NOT NULL,
  grantor_name TEXT NOT NULL,
  grantor_contact_email TEXT,
  grantor_contact_phone TEXT,
  
  -- Financial
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Status & Dates
  status grant_status DEFAULT 'prospecting' NOT NULL,
  applied_date DATE,
  deadline_date DATE,
  award_date DATE,
  start_date DATE,
  end_date DATE,
  
  -- Requirements & Reporting
  requirements TEXT,
  reporting_frequency TEXT,
  next_report_due DATE,
  
  -- Tracking
  assigned_to UUID REFERENCES public.profiles(id),
  notes TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Reports (for treasurer)
CREATE TABLE public.financial_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Report Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report_type TEXT NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'annual'
  
  -- Financial Summary
  total_donations_cents INTEGER DEFAULT 0,
  total_expenses_cents INTEGER DEFAULT 0,
  total_grants_cents INTEGER DEFAULT 0,
  net_income_cents INTEGER DEFAULT 0,
  
  -- Report Data
  report_data JSONB DEFAULT '{}'::jsonb,
  report_url TEXT,
  
  -- Generated By
  generated_by UUID REFERENCES public.profiles(id),
  sent_to_treasurer BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 4. VOLUNTEER MANAGEMENT
-- =====================================================================

-- Volunteer Profiles
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Volunteer Details
  status volunteer_status DEFAULT 'pending' NOT NULL,
  background_check_completed BOOLEAN DEFAULT false,
  background_check_date DATE,
  
  -- Availability
  available_hours_per_week INTEGER,
  preferred_days JSONB DEFAULT '[]'::jsonb,
  time_zone TEXT,
  
  -- Skills & Interests
  skills JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Statistics
  total_hours_logged DECIMAL(10,2) DEFAULT 0,
  total_events_attended INTEGER DEFAULT 0,
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteer Hours Log
CREATE TABLE public.volunteer_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Volunteer & Event
  volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  
  -- Time Tracking
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  hours_worked DECIMAL(10,2) GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (end_time - start_time)) / 3600
  ) STORED,
  
  -- Details
  activity_description TEXT NOT NULL,
  location TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- =====================================================================
-- 5. EVENTS & BOOKING MANAGEMENT
-- =====================================================================

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Event Details
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_type TEXT, -- 'volunteer', 'fundraiser', 'meeting', 'call', 'workshop'
  
  -- Status
  status event_status DEFAULT 'scheduled' NOT NULL,
  is_public BOOLEAN DEFAULT true,
  
  -- Date & Time
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  time_zone TEXT,
  
  -- Location (virtual or physical)
  location_type TEXT, -- 'virtual', 'physical', 'hybrid'
  physical_address TEXT,
  virtual_link TEXT,
  
  -- Capacity
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  
  -- Organizer
  organizer_id UUID REFERENCES public.profiles(id),
  
  -- Media
  image_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_event_time CHECK (end_time > start_time)
);

-- Event Attendees
CREATE TABLE public.event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Event & Attendee
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- RSVP Details
  status TEXT DEFAULT 'registered', -- 'registered', 'attended', 'no_show', 'cancelled'
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  checked_in_at TIMESTAMPTZ,
  
  -- Notes
  notes TEXT,
  
  UNIQUE(event_id, user_id)
);

-- Project Calls/Meetings
CREATE TABLE public.project_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Call Details
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  
  -- Agenda
  agenda TEXT,
  meeting_notes TEXT,
  action_items JSONB DEFAULT '[]'::jsonb,
  
  -- Recording
  recording_url TEXT,
  transcript_url TEXT,
  
  -- AI-Generated Summary
  ai_summary TEXT,
  ai_action_items JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 6. E-COMMERCE & PRODUCTS
-- =====================================================================

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Product Details
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type product_type NOT NULL,
  
  -- Pricing
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency TEXT DEFAULT 'USD',
  
  -- Inventory (for physical/digital products)
  sku TEXT UNIQUE,
  stock_quantity INTEGER,
  track_inventory BOOLEAN DEFAULT false,
  
  -- Digital Product Details
  digital_file_url TEXT,
  download_limit INTEGER,
  access_duration_days INTEGER,
  
  -- Subscription Details
  subscription_interval TEXT, -- 'month', 'year'
  subscription_interval_count INTEGER DEFAULT 1,
  trial_period_days INTEGER,
  
  -- Shopify Integration
  shopify_product_id TEXT UNIQUE,
  shopify_variant_id TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Customer
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  
  -- Order Details
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'refunded', 'failed'
  
  -- Payment
  stripe_payment_intent_id TEXT UNIQUE,
  shopify_order_id TEXT UNIQUE,
  
  -- Amounts
  subtotal_cents INTEGER NOT NULL,
  tax_cents INTEGER DEFAULT 0,
  shipping_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Fulfillment
  fulfillment_status TEXT, -- 'unfulfilled', 'fulfilled', 'partially_fulfilled'
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Metadata
  billing_address JSONB,
  shipping_address JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Order & Product
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  
  -- Item Details
  product_name TEXT NOT NULL,
  product_type product_type NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  
  -- Pricing
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,
  
  -- Digital Product Access
  download_url TEXT,
  download_count INTEGER DEFAULT 0,
  access_expires_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 7. CONTENT MANAGEMENT & AI
-- =====================================================================

-- Content Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Post Details
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  content_html TEXT,
  
  -- Author
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Status
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMPTZ,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  
  -- Featured
  is_featured BOOLEAN DEFAULT false,
  featured_image_url TEXT,
  
  -- AI-Generated
  is_ai_generated BOOLEAN DEFAULT false,
  ai_model TEXT,
  ai_prompt TEXT,
  
  -- Metadata
  tags JSONB DEFAULT '[]'::jsonb,
  categories JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Content Storage
CREATE TABLE public.ai_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content Details
  content_type TEXT NOT NULL, -- 'text', 'image', 'code', 'summary'
  prompt TEXT NOT NULL,
  response TEXT,
  
  -- AI Model Info
  model TEXT NOT NULL, -- 'claude-3-5-sonnet', 'gpt-4', etc.
  model_version TEXT,
  tokens_used INTEGER,
  
  -- Usage Context
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  related_resource_type TEXT,
  related_resource_id UUID,
  
  -- Quality & Feedback
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Uploads
CREATE TABLE public.uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Uploader
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- File Details
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Storage
  storage_bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  
  -- Metadata
  alt_text TEXT,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 8. TEAM COLLABORATION & PROJECTS
-- =====================================================================

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project Details
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'active', -- 'planning', 'active', 'on_hold', 'completed', 'cancelled'
  priority task_priority DEFAULT 'medium',
  
  -- Timeline
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  
  -- Team
  project_lead_id UUID REFERENCES public.profiles(id),
  
  -- Financial
  budget_cents INTEGER,
  spent_cents INTEGER DEFAULT 0,
  
  -- Progress
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  
  -- Metadata
  tags JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Members
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project & Member
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Role
  role TEXT DEFAULT 'member', -- 'lead', 'member', 'contributor', 'observer'
  
  -- Timestamps
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, user_id)
);

-- Tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Task Details
  title TEXT NOT NULL,
  description TEXT,
  
  -- Assignment
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Status & Priority
  status task_status DEFAULT 'todo' NOT NULL,
  priority task_priority DEFAULT 'medium' NOT NULL,
  
  -- Timeline
  due_date DATE,
  estimated_hours DECIMAL(10,2),
  actual_hours DECIMAL(10,2),
  
  -- Completion
  completed_at TIMESTAMPTZ,
  
  -- Dependencies
  blocked_by JSONB DEFAULT '[]'::jsonb, -- Array of task IDs
  
  -- Metadata
  tags JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments (for tasks, projects, etc.)
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Author
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Resource
  resource_type TEXT NOT NULL, -- 'task', 'project', 'post', etc.
  resource_id UUID NOT NULL,
  
  -- Content
  content TEXT NOT NULL,
  
  -- Threading
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 9. NOTIFICATIONS & COMMUNICATION
-- =====================================================================

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Recipient
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Notification Details
  type TEXT NOT NULL, -- 'email', 'in_app', 'sms'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Resource Link
  resource_type TEXT,
  resource_id UUID,
  action_url TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Email Specific
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Queue
CREATE TABLE public.email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Recipient
  to_email TEXT NOT NULL,
  to_name TEXT,
  
  -- Email Details
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  
  -- SendGrid
  sendgrid_template_id TEXT,
  sendgrid_message_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
  sent_at TIMESTAMPTZ,
  failed_reason TEXT,
  
  -- Priority
  priority INTEGER DEFAULT 5, -- 1 (highest) to 10 (lowest)
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 10. ANALYTICS & TRACKING
-- =====================================================================

-- User Analytics
CREATE TABLE public.user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Analytics Data
  event_type TEXT NOT NULL, -- 'page_view', 'donation', 'signup', 'purchase', etc.
  event_name TEXT NOT NULL,
  
  -- Event Details
  page_url TEXT,
  referrer TEXT,
  
  -- Session Info
  session_id TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  
  -- Location
  ip_address INET,
  country TEXT,
  region TEXT,
  city TEXT,
  
  -- Metadata
  properties JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Dashboard Metrics (for personalized dashboards)
CREATE TABLE public.dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Admin User
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Metric Period
  metric_date DATE NOT NULL,
  metric_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  
  -- CEO Metrics (Sam)
  total_donations_cents INTEGER DEFAULT 0,
  total_volunteers INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  operational_costs_cents INTEGER DEFAULT 0,
  active_projects INTEGER DEFAULT 0,
  
  -- CTO Metrics (Connor)
  system_uptime_percentage DECIMAL(5,2),
  api_calls_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  active_integrations INTEGER DEFAULT 0,
  
  -- CMO Metrics (Fred)
  website_visitors INTEGER DEFAULT 0,
  social_media_reach INTEGER DEFAULT 0,
  email_open_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,2),
  
  -- Metadata
  detailed_metrics JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(admin_id, metric_date, metric_type)
);

-- =====================================================================
-- 11. SYSTEM & CONFIGURATION
-- =====================================================================

-- System Settings
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Setting Details
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL, -- 'string', 'number', 'boolean', 'json'
  
  -- Metadata
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys (encrypted storage)
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Service Details
  service_name TEXT UNIQUE NOT NULL, -- 'stripe', 'shopify', 'sendgrid', etc.
  key_name TEXT NOT NULL,
  encrypted_key TEXT NOT NULL, -- Use pgcrypto to encrypt
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- =====================================================================
-- 12. INDEXES FOR PERFORMANCE
-- =====================================================================

-- Profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

-- Donations
CREATE INDEX idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX idx_donations_status ON public.donations(status);
CREATE INDEX idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX idx_donations_stripe_payment_intent ON public.donations(stripe_payment_intent_id);

-- Volunteers
CREATE INDEX idx_volunteers_status ON public.volunteers(status);
CREATE INDEX idx_volunteer_hours_volunteer_id ON public.volunteer_hours(volunteer_id);
CREATE INDEX idx_volunteer_hours_date ON public.volunteer_hours(start_time DESC);

-- Events
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);

-- Projects & Tasks
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

-- Products & Orders
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Posts
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_posts_slug ON public.posts(slug);

-- Full-text search
CREATE INDEX idx_posts_title_search ON public.posts USING gin(to_tsvector('english', title));
CREATE INDEX idx_posts_content_search ON public.posts USING gin(to_tsvector('english', content));
CREATE INDEX idx_products_name_search ON public.products USING gin(to_tsvector('english', name));

-- Analytics
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON public.user_analytics(event_type);
CREATE INDEX idx_user_analytics_timestamp ON public.user_analytics(timestamp DESC);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Comments
CREATE INDEX idx_comments_resource ON public.comments(resource_type, resource_id);
CREATE INDEX idx_comments_author ON public.comments(author_id);

-- =====================================================================
-- COMPLETED: Initial Schema Created
-- =====================================================================
-- Next Steps:
-- 1. Run this migration in Supabase
-- 2. Apply RLS policies (002_rls_policies.sql)
-- 3. Create functions and triggers (003_functions_triggers.sql)
-- 4. Configure storage buckets (004_storage_buckets.sql)
-- 5. Load seed data (005_seed_data.sql)
-- =====================================================================
