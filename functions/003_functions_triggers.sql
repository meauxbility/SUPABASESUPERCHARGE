-- =====================================================================
-- MEAUXBILITY.ORG - FUNCTIONS & TRIGGERS
-- =====================================================================
-- Version: 1.0.0
-- Purpose: Automation, calculations, and business logic
-- =====================================================================

-- =====================================================================
-- 1. TIMESTAMP TRIGGERS
-- =====================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at
  BEFORE UPDATE ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_volunteer_hours_updated_at
  BEFORE UPDATE ON public.volunteer_hours
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grants_updated_at
  BEFORE UPDATE ON public.grants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recurring_donations_updated_at
  BEFORE UPDATE ON public.recurring_donations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_queue_updated_at
  BEFORE UPDATE ON public.email_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_calls_updated_at
  BEFORE UPDATE ON public.project_calls
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 2. NEW USER SETUP
-- =====================================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'guest'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 3. DONATION TRACKING & RECEIPTS
-- =====================================================================

-- Function to update campaign raised amount
CREATE OR REPLACE FUNCTION public.update_campaign_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.campaigns
    SET raised_amount_cents = raised_amount_cents + NEW.amount_cents
    WHERE id = NEW.campaign_id;
  END IF;
  
  IF OLD IS NOT NULL AND OLD.status = 'completed' AND NEW.status = 'refunded' THEN
    UPDATE public.campaigns
    SET raised_amount_cents = raised_amount_cents - OLD.amount_cents
    WHERE id = OLD.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaign_total
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_campaign_raised_amount();

-- Function to send donation receipt email
CREATE OR REPLACE FUNCTION public.send_donation_receipt()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND NOT NEW.receipt_sent THEN
    INSERT INTO public.email_queue (
      to_email,
      to_name,
      subject,
      body_html,
      body_text,
      sendgrid_template_id,
      priority,
      metadata
    )
    VALUES (
      NEW.donor_email,
      NEW.donor_name,
      'Thank you for your donation to Meauxbility',
      '', -- Will be populated by SendGrid template
      '',
      (SELECT setting_value->>'donation_receipt_template' FROM public.system_settings WHERE setting_key = 'email_templates'),
      1, -- High priority
      jsonb_build_object(
        'donation_id', NEW.id,
        'amount_cents', NEW.amount_cents,
        'currency', NEW.currency,
        'donation_date', NEW.created_at,
        'is_tax_deductible', NEW.is_tax_deductible
      )
    );
    
    -- Mark receipt as sent
    UPDATE public.donations
    SET receipt_sent = true, receipt_sent_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER send_receipt_on_donation
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.send_donation_receipt();

-- =====================================================================
-- 4. VOLUNTEER HOURS TRACKING
-- =====================================================================

-- Function to update volunteer total hours
CREATE OR REPLACE FUNCTION public.update_volunteer_total_hours()
RETURNS TRIGGER AS $$
DECLARE
  total DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(hours_worked), 0)
  INTO total
  FROM public.volunteer_hours
  WHERE volunteer_id = COALESCE(NEW.volunteer_id, OLD.volunteer_id)
  AND verified = true;
  
  UPDATE public.volunteers
  SET total_hours_logged = total
  WHERE id = COALESCE(NEW.volunteer_id, OLD.volunteer_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_volunteer_hours_total
  AFTER INSERT OR UPDATE OR DELETE ON public.volunteer_hours
  FOR EACH ROW EXECUTE FUNCTION public.update_volunteer_total_hours();

-- =====================================================================
-- 5. EVENT ATTENDEE TRACKING
-- =====================================================================

-- Function to update event current attendees count
CREATE OR REPLACE FUNCTION public.update_event_attendees_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events
  SET current_attendees = (
    SELECT COUNT(*)
    FROM public.event_attendees
    WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
    AND status = 'registered'
  )
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_count
  AFTER INSERT OR UPDATE OR DELETE ON public.event_attendees
  FOR EACH ROW EXECUTE FUNCTION public.update_event_attendees_count();

-- =====================================================================
-- 6. PROJECT FINANCIAL TRACKING
-- =====================================================================

-- Function to update project spent amount
CREATE OR REPLACE FUNCTION public.update_project_spent()
RETURNS TRIGGER AS $$
BEGIN
  -- This would be triggered by expense records (not in current schema)
  -- Placeholder for future implementation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 7. TASK COMPLETION TRACKING
-- =====================================================================

-- Function to set completed_at timestamp
CREATE OR REPLACE FUNCTION public.set_task_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status != 'completed' AND OLD IS NOT NULL AND OLD.status = 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_completion_timestamp
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_task_completed_at();

-- Function to update project completion percentage
CREATE OR REPLACE FUNCTION public.update_project_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  percentage INTEGER;
BEGIN
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO total_tasks, completed_tasks
  FROM public.tasks
  WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
  
  IF total_tasks > 0 THEN
    percentage := ROUND((completed_tasks::DECIMAL / total_tasks) * 100);
  ELSE
    percentage := 0;
  END IF;
  
  UPDATE public.projects
  SET completion_percentage = percentage
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_percentage
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_project_completion();

-- =====================================================================
-- 8. NOTIFICATION CREATION
-- =====================================================================

-- Function to create notification on task assignment
CREATE OR REPLACE FUNCTION public.notify_on_task_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.assigned_to IS NOT NULL AND (OLD IS NULL OR OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to) THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      resource_type,
      resource_id,
      action_url
    )
    VALUES (
      NEW.assigned_to,
      'in_app',
      'New Task Assigned',
      'You have been assigned to task: ' || NEW.title,
      'task',
      NEW.id,
      '/tasks/' || NEW.id::TEXT
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER task_assignment_notification
  AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_task_assignment();

-- Function to notify on comment
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
BEGIN
  -- Determine who to notify based on resource type
  -- This is a simplified version - expand based on your needs
  IF NEW.resource_type = 'task' THEN
    SELECT assigned_to INTO recipient_id
    FROM public.tasks
    WHERE id = NEW.resource_id;
  ELSIF NEW.resource_type = 'project' THEN
    SELECT project_lead_id INTO recipient_id
    FROM public.projects
    WHERE id = NEW.resource_id;
  END IF;
  
  IF recipient_id IS NOT NULL AND recipient_id != NEW.author_id THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      resource_type,
      resource_id,
      action_url
    )
    VALUES (
      recipient_id,
      'in_app',
      'New Comment',
      'New comment on ' || NEW.resource_type,
      NEW.resource_type,
      NEW.resource_id,
      '/' || NEW.resource_type || 's/' || NEW.resource_id::TEXT
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER comment_notification
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();

-- =====================================================================
-- 9. ORDER NUMBER GENERATION
-- =====================================================================

-- Function to generate unique order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'MXB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- =====================================================================
-- 10. INVENTORY MANAGEMENT
-- =====================================================================

-- Function to update product inventory on order
CREATE OR REPLACE FUNCTION public.update_product_inventory()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.product_type != 'digital' AND NEW.product_type != 'service' THEN
    UPDATE public.products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id
    AND track_inventory = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_on_order
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.update_product_inventory();

-- =====================================================================
-- 11. USER ACTIVITY LOGGING
-- =====================================================================

-- Function to log significant user actions
CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_activity_log (
    user_id,
    action,
    resource_type,
    resource_id,
    metadata
  )
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object('operation', TG_OP, 'timestamp', NOW())
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply activity logging to critical tables
-- (Commented out to avoid excessive logging, enable as needed)
-- CREATE TRIGGER log_donation_activity
--   AFTER INSERT ON public.donations
--   FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

-- CREATE TRIGGER log_grant_activity
--   AFTER INSERT OR UPDATE ON public.grants
--   FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

-- =====================================================================
-- 12. WEEKLY CEO EMAIL REPORT
-- =====================================================================

-- Function to generate weekly financial report
CREATE OR REPLACE FUNCTION public.generate_weekly_ceo_report()
RETURNS void AS $$
DECLARE
  ceo_id UUID;
  ceo_email TEXT;
  report_data JSONB;
  week_start DATE;
  week_end DATE;
BEGIN
  -- Get CEO information
  SELECT id, email INTO ceo_id, ceo_email
  FROM public.profiles
  WHERE admin_type = 'sam_ceo'
  LIMIT 1;
  
  -- Calculate week dates
  week_end := CURRENT_DATE;
  week_start := week_end - INTERVAL '7 days';
  
  -- Compile report data
  report_data := jsonb_build_object(
    'period_start', week_start,
    'period_end', week_end,
    'total_donations', (
      SELECT COALESCE(SUM(amount_cents), 0)
      FROM public.donations
      WHERE created_at >= week_start AND created_at <= week_end
      AND status = 'completed'
    ),
    'new_donors', (
      SELECT COUNT(DISTINCT donor_id)
      FROM public.donations
      WHERE created_at >= week_start AND created_at <= week_end
    ),
    'new_volunteers', (
      SELECT COUNT(*)
      FROM public.volunteers
      WHERE applied_at >= week_start AND applied_at <= week_end
    ),
    'volunteer_hours', (
      SELECT COALESCE(SUM(hours_worked), 0)
      FROM public.volunteer_hours
      WHERE start_time >= week_start AND start_time <= week_end
      AND verified = true
    ),
    'active_projects', (
      SELECT COUNT(*)
      FROM public.projects
      WHERE status = 'active'
    ),
    'completed_tasks', (
      SELECT COUNT(*)
      FROM public.tasks
      WHERE completed_at >= week_start AND completed_at <= week_end
    )
  );
  
  -- Create financial report record
  INSERT INTO public.financial_reports (
    period_start,
    period_end,
    report_type,
    total_donations_cents,
    report_data,
    generated_by
  )
  VALUES (
    week_start,
    week_end,
    'weekly',
    (report_data->>'total_donations')::INTEGER,
    report_data,
    ceo_id
  );
  
  -- Queue email to CEO
  INSERT INTO public.email_queue (
    to_email,
    to_name,
    subject,
    body_html,
    priority,
    metadata
  )
  VALUES (
    ceo_email,
    'Sam',
    'Meauxbility Weekly Report - ' || TO_CHAR(week_start, 'Mon DD') || ' to ' || TO_CHAR(week_end, 'Mon DD, YYYY'),
    '', -- Will use SendGrid template
    1,
    jsonb_build_object(
      'report_type', 'weekly',
      'report_data', report_data
    )
  );
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 13. ADMIN DASHBOARD METRICS UPDATE
-- =====================================================================

-- Function to update daily dashboard metrics
CREATE OR REPLACE FUNCTION public.update_daily_dashboard_metrics()
RETURNS void AS $$
DECLARE
  admin_record RECORD;
  metric_date DATE := CURRENT_DATE;
BEGIN
  -- Update metrics for each admin
  FOR admin_record IN 
    SELECT id, admin_type
    FROM public.profiles
    WHERE role IN ('admin', 'ceo', 'cto', 'cmo')
  LOOP
    INSERT INTO public.dashboard_metrics (
      admin_id,
      metric_date,
      metric_type,
      total_donations_cents,
      total_volunteers,
      total_events,
      operational_costs_cents,
      active_projects,
      website_visitors,
      detailed_metrics
    )
    VALUES (
      admin_record.id,
      metric_date,
      'daily',
      (SELECT COALESCE(SUM(amount_cents), 0) FROM public.donations WHERE DATE(created_at) = metric_date AND status = 'completed'),
      (SELECT COUNT(*) FROM public.volunteers WHERE status = 'active'),
      (SELECT COUNT(*) FROM public.events WHERE DATE(start_time) = metric_date),
      0, -- Placeholder for operational costs
      (SELECT COUNT(*) FROM public.projects WHERE status = 'active'),
      (SELECT COUNT(DISTINCT user_id) FROM public.user_analytics WHERE DATE(timestamp) = metric_date),
      jsonb_build_object(
        'admin_type', admin_record.admin_type,
        'calculated_at', NOW()
      )
    )
    ON CONFLICT (admin_id, metric_date, metric_type)
    DO UPDATE SET
      total_donations_cents = EXCLUDED.total_donations_cents,
      total_volunteers = EXCLUDED.total_volunteers,
      total_events = EXCLUDED.total_events,
      active_projects = EXCLUDED.active_projects,
      website_visitors = EXCLUDED.website_visitors,
      detailed_metrics = EXCLUDED.detailed_metrics;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 14. SLUG GENERATION
-- =====================================================================

-- Function to generate URL-friendly slug
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^\w\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================================
-- 15. SEARCH FUNCTIONS
-- =====================================================================

-- Function for full-text search on posts
CREATE OR REPLACE FUNCTION public.search_posts(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  excerpt TEXT,
  published_at TIMESTAMPTZ,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.excerpt,
    p.published_at,
    ts_rank(
      to_tsvector('english', COALESCE(p.title, '') || ' ' || COALESCE(p.content, '')),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM public.posts p
  WHERE p.status = 'published'
  AND (
    to_tsvector('english', COALESCE(p.title, '') || ' ' || COALESCE(p.content, ''))
    @@ plainto_tsquery('english', search_query)
  )
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 16. ANALYTICS AGGREGATION
-- =====================================================================

-- Function to get user engagement summary
CREATE OR REPLACE FUNCTION public.get_user_engagement_summary(
  user_uuid UUID,
  days_back INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_donations', (
      SELECT COUNT(*) FROM public.donations
      WHERE donor_id = user_uuid
      AND created_at >= NOW() - (days_back || ' days')::INTERVAL
    ),
    'total_donated_cents', (
      SELECT COALESCE(SUM(amount_cents), 0) FROM public.donations
      WHERE donor_id = user_uuid
      AND status = 'completed'
      AND created_at >= NOW() - (days_back || ' days')::INTERVAL
    ),
    'volunteer_hours', (
      SELECT COALESCE(SUM(hours_worked), 0) FROM public.volunteer_hours
      WHERE volunteer_id = user_uuid
      AND verified = true
      AND start_time >= NOW() - (days_back || ' days')::INTERVAL
    ),
    'events_attended', (
      SELECT COUNT(*) FROM public.event_attendees
      WHERE user_id = user_uuid
      AND status = 'attended'
      AND registered_at >= NOW() - (days_back || ' days')::INTERVAL
    ),
    'tasks_completed', (
      SELECT COUNT(*) FROM public.tasks
      WHERE assigned_to = user_uuid
      AND status = 'completed'
      AND completed_at >= NOW() - (days_back || ' days')::INTERVAL
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- COMPLETED: Functions & Triggers Created
-- =====================================================================
-- All automation and business logic implemented
-- Next: Configure storage buckets (004_storage_buckets.sql)
-- =====================================================================
