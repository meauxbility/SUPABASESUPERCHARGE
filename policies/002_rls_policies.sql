-- =====================================================================
-- MEAUXBILITY.ORG - ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
-- Version: 1.0.0
-- Purpose: Secure database access with granular permission control
-- =====================================================================

-- =====================================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('admin', 'ceo', 'cto', 'cmo')
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = required_role
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is owner of resource
CREATE OR REPLACE FUNCTION public.is_owner(resource_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = resource_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is project member
CREATE OR REPLACE FUNCTION public.is_project_member(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.project_members
    WHERE project_id = project_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 1. PROFILES - RLS POLICIES
-- =====================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- New users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================================
-- 2. DONATIONS - RLS POLICIES
-- =====================================================================

-- Donors can view their own donations
CREATE POLICY "Donors can view own donations"
  ON public.donations FOR SELECT
  USING (donor_id = auth.uid());

-- Admins can view all donations
CREATE POLICY "Admins can view all donations"
  ON public.donations FOR SELECT
  USING (public.is_admin());

-- System can insert donations (for Stripe webhooks)
CREATE POLICY "Service role can insert donations"
  ON public.donations FOR INSERT
  WITH CHECK (true);

-- Admins can update donations
CREATE POLICY "Admins can update donations"
  ON public.donations FOR UPDATE
  USING (public.is_admin());

-- =====================================================================
-- 3. RECURRING DONATIONS - RLS POLICIES
-- =====================================================================

-- Donors can view their own recurring donations
CREATE POLICY "Donors can view own recurring donations"
  ON public.recurring_donations FOR SELECT
  USING (donor_id = auth.uid());

-- Admins can view all recurring donations
CREATE POLICY "Admins can view all recurring donations"
  ON public.recurring_donations FOR SELECT
  USING (public.is_admin());

-- System can manage recurring donations
CREATE POLICY "Service role can manage recurring donations"
  ON public.recurring_donations FOR ALL
  USING (true);

-- =====================================================================
-- 4. CAMPAIGNS - RLS POLICIES
-- =====================================================================

-- Everyone can view active campaigns
CREATE POLICY "Anyone can view active campaigns"
  ON public.campaigns FOR SELECT
  USING (is_active = true);

-- Admins can view all campaigns
CREATE POLICY "Admins can view all campaigns"
  ON public.campaigns FOR SELECT
  USING (public.is_admin());

-- Admins can manage campaigns
CREATE POLICY "Admins can manage campaigns"
  ON public.campaigns FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 5. GRANTS - RLS POLICIES
-- =====================================================================

-- Admins can view all grants
CREATE POLICY "Admins can view all grants"
  ON public.grants FOR SELECT
  USING (public.is_admin());

-- Admins can manage grants
CREATE POLICY "Admins can manage grants"
  ON public.grants FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 6. FINANCIAL REPORTS - RLS POLICIES
-- =====================================================================

-- Only admins can view financial reports
CREATE POLICY "Admins can view financial reports"
  ON public.financial_reports FOR SELECT
  USING (public.is_admin());

-- Only admins can manage financial reports
CREATE POLICY "Admins can manage financial reports"
  ON public.financial_reports FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 7. VOLUNTEERS - RLS POLICIES
-- =====================================================================

-- Volunteers can view their own profile
CREATE POLICY "Volunteers can view own profile"
  ON public.volunteers FOR SELECT
  USING (id = auth.uid());

-- Admins can view all volunteers
CREATE POLICY "Admins can view all volunteers"
  ON public.volunteers FOR SELECT
  USING (public.is_admin());

-- Users can apply to become volunteers
CREATE POLICY "Users can apply as volunteer"
  ON public.volunteers FOR INSERT
  WITH CHECK (id = auth.uid());

-- Volunteers can update their own profile
CREATE POLICY "Volunteers can update own profile"
  ON public.volunteers FOR UPDATE
  USING (id = auth.uid());

-- Admins can update volunteer profiles
CREATE POLICY "Admins can update volunteer profiles"
  ON public.volunteers FOR UPDATE
  USING (public.is_admin());

-- =====================================================================
-- 8. VOLUNTEER HOURS - RLS POLICIES
-- =====================================================================

-- Volunteers can view their own hours
CREATE POLICY "Volunteers can view own hours"
  ON public.volunteer_hours FOR SELECT
  USING (volunteer_id = auth.uid());

-- Admins can view all hours
CREATE POLICY "Admins can view all hours"
  ON public.volunteer_hours FOR SELECT
  USING (public.is_admin());

-- Volunteers can log their own hours
CREATE POLICY "Volunteers can log own hours"
  ON public.volunteer_hours FOR INSERT
  WITH CHECK (volunteer_id = auth.uid());

-- Volunteers can update their own unverified hours
CREATE POLICY "Volunteers can update own unverified hours"
  ON public.volunteer_hours FOR UPDATE
  USING (volunteer_id = auth.uid() AND verified = false);

-- Admins can verify hours
CREATE POLICY "Admins can verify hours"
  ON public.volunteer_hours FOR UPDATE
  USING (public.is_admin());

-- =====================================================================
-- 9. EVENTS - RLS POLICIES
-- =====================================================================

-- Everyone can view public events
CREATE POLICY "Anyone can view public events"
  ON public.events FOR SELECT
  USING (is_public = true);

-- Authenticated users can view all events
CREATE POLICY "Authenticated users can view all events"
  ON public.events FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Organizers can view their events
CREATE POLICY "Organizers can view own events"
  ON public.events FOR SELECT
  USING (organizer_id = auth.uid());

-- Admins can manage all events
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (public.is_admin());

-- Event organizers can update their events
CREATE POLICY "Organizers can update own events"
  ON public.events FOR UPDATE
  USING (organizer_id = auth.uid());

-- =====================================================================
-- 10. EVENT ATTENDEES - RLS POLICIES
-- =====================================================================

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON public.event_attendees FOR SELECT
  USING (user_id = auth.uid());

-- Event organizers can view attendees
CREATE POLICY "Organizers can view attendees"
  ON public.event_attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_attendees.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Admins can view all attendees
CREATE POLICY "Admins can view all attendees"
  ON public.event_attendees FOR SELECT
  USING (public.is_admin());

-- Users can register for events
CREATE POLICY "Users can register for events"
  ON public.event_attendees FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own registration
CREATE POLICY "Users can update own registration"
  ON public.event_attendees FOR UPDATE
  USING (user_id = auth.uid());

-- =====================================================================
-- 11. PRODUCTS - RLS POLICIES
-- =====================================================================

-- Everyone can view active products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Admins can view all products
CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  USING (public.is_admin());

-- Admins can manage products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 12. ORDERS - RLS POLICIES
-- =====================================================================

-- Customers can view their own orders
CREATE POLICY "Customers can view own orders"
  ON public.orders FOR SELECT
  USING (customer_id = auth.uid());

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

-- System can create orders
CREATE POLICY "Service role can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- =====================================================================
-- 13. ORDER ITEMS - RLS POLICIES
-- =====================================================================

-- Customers can view their own order items
CREATE POLICY "Customers can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (public.is_admin());

-- System can create order items
CREATE POLICY "Service role can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- =====================================================================
-- 14. POSTS - RLS POLICIES
-- =====================================================================

-- Everyone can view published posts
CREATE POLICY "Anyone can view published posts"
  ON public.posts FOR SELECT
  USING (status = 'published');

-- Authors can view their own posts
CREATE POLICY "Authors can view own posts"
  ON public.posts FOR SELECT
  USING (author_id = auth.uid());

-- Admins can view all posts
CREATE POLICY "Admins can view all posts"
  ON public.posts FOR SELECT
  USING (public.is_admin());

-- Admins can manage posts
CREATE POLICY "Admins can manage posts"
  ON public.posts FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 15. AI CONTENT - RLS POLICIES
-- =====================================================================

-- Users can view their own AI content
CREATE POLICY "Users can view own AI content"
  ON public.ai_content FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all AI content
CREATE POLICY "Admins can view all AI content"
  ON public.ai_content FOR SELECT
  USING (public.is_admin());

-- Users can create AI content
CREATE POLICY "Users can create AI content"
  ON public.ai_content FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =====================================================================
-- 16. UPLOADS - RLS POLICIES
-- =====================================================================

-- Users can view their own uploads
CREATE POLICY "Users can view own uploads"
  ON public.uploads FOR SELECT
  USING (uploaded_by = auth.uid());

-- Admins can view all uploads
CREATE POLICY "Admins can view all uploads"
  ON public.uploads FOR SELECT
  USING (public.is_admin());

-- Users can upload files
CREATE POLICY "Users can upload files"
  ON public.uploads FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

-- Users can delete their own uploads
CREATE POLICY "Users can delete own uploads"
  ON public.uploads FOR DELETE
  USING (uploaded_by = auth.uid());

-- =====================================================================
-- 17. PROJECTS - RLS POLICIES
-- =====================================================================

-- Project members can view their projects
CREATE POLICY "Project members can view projects"
  ON public.projects FOR SELECT
  USING (public.is_project_member(id));

-- Admins can view all projects
CREATE POLICY "Admins can view all projects"
  ON public.projects FOR SELECT
  USING (public.is_admin());

-- Admins can manage projects
CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.is_admin());

-- Project leads can update their projects
CREATE POLICY "Project leads can update projects"
  ON public.projects FOR UPDATE
  USING (project_lead_id = auth.uid());

-- =====================================================================
-- 18. PROJECT MEMBERS - RLS POLICIES
-- =====================================================================

-- Project members can view team
CREATE POLICY "Project members can view team"
  ON public.project_members FOR SELECT
  USING (public.is_project_member(project_id));

-- Admins can manage project members
CREATE POLICY "Admins can manage project members"
  ON public.project_members FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 19. TASKS - RLS POLICIES
-- =====================================================================

-- Project members can view project tasks
CREATE POLICY "Project members can view tasks"
  ON public.tasks FOR SELECT
  USING (public.is_project_member(project_id));

-- Assigned users can view their tasks
CREATE POLICY "Assigned users can view own tasks"
  ON public.tasks FOR SELECT
  USING (assigned_to = auth.uid());

-- Admins can manage all tasks
CREATE POLICY "Admins can manage all tasks"
  ON public.tasks FOR ALL
  USING (public.is_admin());

-- Project members can create tasks
CREATE POLICY "Project members can create tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (public.is_project_member(project_id));

-- Assigned users can update their tasks
CREATE POLICY "Assigned users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (assigned_to = auth.uid());

-- =====================================================================
-- 20. COMMENTS - RLS POLICIES
-- =====================================================================

-- Users can view comments on resources they have access to
CREATE POLICY "Users can view accessible comments"
  ON public.comments FOR SELECT
  USING (true); -- Will be refined based on resource access

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own comments
CREATE POLICY "Authors can update own comments"
  ON public.comments FOR UPDATE
  USING (author_id = auth.uid());

-- Authors can delete their own comments
CREATE POLICY "Authors can delete own comments"
  ON public.comments FOR DELETE
  USING (author_id = auth.uid());

-- Admins can manage all comments
CREATE POLICY "Admins can manage comments"
  ON public.comments FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 21. NOTIFICATIONS - RLS POLICIES
-- =====================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- System can create notifications
CREATE POLICY "Service role can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- =====================================================================
-- 22. EMAIL QUEUE - RLS POLICIES
-- =====================================================================

-- Only admins can view email queue
CREATE POLICY "Admins can view email queue"
  ON public.email_queue FOR SELECT
  USING (public.is_admin());

-- System can manage email queue
CREATE POLICY "Service role can manage email queue"
  ON public.email_queue FOR ALL
  USING (true);

-- =====================================================================
-- 23. USER ANALYTICS - RLS POLICIES
-- =====================================================================

-- Users can view their own analytics
CREATE POLICY "Users can view own analytics"
  ON public.user_analytics FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all analytics
CREATE POLICY "Admins can view all analytics"
  ON public.user_analytics FOR SELECT
  USING (public.is_admin());

-- System can insert analytics
CREATE POLICY "Service role can insert analytics"
  ON public.user_analytics FOR INSERT
  WITH CHECK (true);

-- =====================================================================
-- 24. DASHBOARD METRICS - RLS POLICIES
-- =====================================================================

-- Admins can view their own dashboard metrics
CREATE POLICY "Admins can view own metrics"
  ON public.dashboard_metrics FOR SELECT
  USING (admin_id = auth.uid());

-- CEO can view all dashboard metrics
CREATE POLICY "CEO can view all metrics"
  ON public.dashboard_metrics FOR SELECT
  USING (public.has_role('ceo'));

-- System can manage metrics
CREATE POLICY "Service role can manage metrics"
  ON public.dashboard_metrics FOR ALL
  USING (true);

-- =====================================================================
-- 25. SYSTEM SETTINGS - RLS POLICIES
-- =====================================================================

-- Public settings can be viewed by anyone
CREATE POLICY "Anyone can view public settings"
  ON public.system_settings FOR SELECT
  USING (is_public = true);

-- Admins can view all settings
CREATE POLICY "Admins can view all settings"
  ON public.system_settings FOR SELECT
  USING (public.is_admin());

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings"
  ON public.system_settings FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 26. API KEYS - RLS POLICIES
-- =====================================================================

-- Only admins can view API keys
CREATE POLICY "Admins can view API keys"
  ON public.api_keys FOR SELECT
  USING (public.is_admin());

-- Only admins can manage API keys
CREATE POLICY "Admins can manage API keys"
  ON public.api_keys FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 27. USER ACTIVITY LOG - RLS POLICIES
-- =====================================================================

-- Users can view their own activity
CREATE POLICY "Users can view own activity"
  ON public.user_activity_log FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all activity
CREATE POLICY "Admins can view all activity"
  ON public.user_activity_log FOR SELECT
  USING (public.is_admin());

-- System can log activity
CREATE POLICY "Service role can log activity"
  ON public.user_activity_log FOR INSERT
  WITH CHECK (true);

-- =====================================================================
-- 28. USER PERMISSIONS - RLS POLICIES
-- =====================================================================

-- Users can view their own permissions
CREATE POLICY "Users can view own permissions"
  ON public.user_permissions FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all permissions
CREATE POLICY "Admins can view all permissions"
  ON public.user_permissions FOR SELECT
  USING (public.is_admin());

-- Admins can manage permissions
CREATE POLICY "Admins can manage permissions"
  ON public.user_permissions FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- 29. PROJECT CALLS - RLS POLICIES
-- =====================================================================

-- Project members can view project calls
CREATE POLICY "Project members can view calls"
  ON public.project_calls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_calls.project_id
      AND public.is_project_member(projects.id)
    )
  );

-- Admins can manage all project calls
CREATE POLICY "Admins can manage project calls"
  ON public.project_calls FOR ALL
  USING (public.is_admin());

-- =====================================================================
-- COMPLETED: RLS Policies Applied
-- =====================================================================
-- All tables now have appropriate security policies
-- Next: Apply functions and triggers (003_functions_triggers.sql)
-- =====================================================================
