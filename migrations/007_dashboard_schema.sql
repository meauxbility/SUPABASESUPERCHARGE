-- Dashboard Schema for Meauxbility
-- This migration adds tables for organizations, projects, tasks, and asset management

-- Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization members table
CREATE TABLE IF NOT EXISTS public.org_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'on_hold')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES auth.users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset uploads table
CREATE TABLE IF NOT EXISTS public.asset_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON public.org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON public.org_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_org_id ON public.tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_asset_uploads_org_id ON public.asset_uploads(organization_id);
CREATE INDEX IF NOT EXISTS idx_asset_uploads_project_id ON public.asset_uploads(project_id);

-- RLS Policies for Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view organizations they are members of" ON public.organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can insert organizations" ON public.organizations
    FOR INSERT WITH CHECK (true); -- Will be restricted by application logic

CREATE POLICY "Admins can update organizations" ON public.organizations
    FOR UPDATE USING (
        id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for Organization Members
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view members of their organizations" ON public.org_members
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage members" ON public.org_members
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects in their organizations" ON public.projects
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Members can create projects" ON public.projects
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Members can update projects" ON public.projects
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for Tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks in their organizations" ON public.tasks
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Members can create tasks" ON public.tasks
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Members can update tasks" ON public.tasks
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for Asset Uploads
ALTER TABLE public.asset_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assets in their organizations" ON public.asset_uploads
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Members can upload assets" ON public.asset_uploads
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM public.org_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data for testing
INSERT INTO public.organizations (id, name, description) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Meauxbility Foundation', 'Main organization for Meauxbility operations')
ON CONFLICT (id) DO NOTHING;

-- Create a function to get user's organizations
CREATE OR REPLACE FUNCTION public.get_user_organizations(user_uuid UUID)
RETURNS TABLE (
    organization_id UUID,
    organization_name TEXT,
    user_role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        om.organization_id,
        o.name as organization_name,
        om.role as user_role
    FROM public.org_members om
    JOIN public.organizations o ON om.organization_id = o.id
    WHERE om.user_id = user_uuid
    ORDER BY o.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.organizations TO anon, authenticated;
GRANT ALL ON public.org_members TO anon, authenticated;
GRANT ALL ON public.projects TO anon, authenticated;
GRANT ALL ON public.tasks TO anon, authenticated;
GRANT ALL ON public.asset_uploads TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_organizations(UUID) TO anon, authenticated;
