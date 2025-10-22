-- =====================================================================
-- MEAUXBILITY.ORG - BACKUP EMAIL SUPPORT
-- =====================================================================
-- Version: 1.0.1
-- Purpose: Add backup email support for admin users
-- =====================================================================

-- Add backup email column to profiles
ALTER TABLE public.profiles
ADD COLUMN backup_email TEXT,
ADD COLUMN backup_email_verified BOOLEAN DEFAULT false;

-- Add constraint to ensure backup email is valid format
ALTER TABLE public.profiles
ADD CONSTRAINT valid_backup_email 
CHECK (backup_email IS NULL OR backup_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create index for backup email lookups
CREATE INDEX idx_profiles_backup_email ON public.profiles(backup_email);

-- Function to find user by either primary or backup email
CREATE OR REPLACE FUNCTION public.get_user_by_email(search_email TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  backup_email TEXT,
  full_name TEXT,
  role user_role,
  admin_type admin_type
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.backup_email,
    p.full_name,
    p.role,
    p.admin_type
  FROM public.profiles p
  WHERE p.email = search_email OR p.backup_email = search_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policy to allow users to view by backup email
CREATE POLICY "Users can view profile by backup email"
  ON public.profiles FOR SELECT
  USING (backup_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Insert/update admin backup emails
-- These will be set after admin accounts are created

-- Function to update admin backup email
CREATE OR REPLACE FUNCTION public.set_admin_backup_email(
  admin_email TEXT,
  new_backup_email TEXT
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET backup_email = new_backup_email,
      updated_at = NOW()
  WHERE email = admin_email;
  
  RAISE NOTICE 'Updated backup email for % to %', admin_email, new_backup_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- USAGE EXAMPLES
-- =====================================================================

-- After admin users are created, run these to set backup emails:

-- Set Sam's backup email
-- SELECT public.set_admin_backup_email('sam@meauxbility.org', 'meauxbility@gmail.com');

-- Set Connor's backup email
-- SELECT public.set_admin_backup_email('connor@meauxbility.org', 'connordmcneely@gmail.com');

-- Set Fred's backup email
-- SELECT public.set_admin_backup_email('fred@meauxbility.org', 'williamsfred336@gmail.com');

-- Verify backup emails are set
-- SELECT email, backup_email, full_name, role, admin_type 
-- FROM public.profiles 
-- WHERE role IN ('ceo', 'cto', 'cmo');

-- =====================================================================
-- COMPLETED: Backup Email Support Added
-- =====================================================================
