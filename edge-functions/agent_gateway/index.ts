import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // Route to appropriate handler
    if (path === '/agent_gateway/projects' && method === 'GET') {
      return await handleGetProjects(req, supabaseClient, user)
    } else if (path === '/agent_gateway/tasks' && method === 'GET') {
      return await handleGetTasks(req, supabaseClient, user)
    } else if (path === '/agent_gateway/tasks' && method === 'POST') {
      return await handleCreateTask(req, supabaseClient, user)
    } else {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleGetProjects(req: Request, supabaseClient: any, user: any) {
  const url = new URL(req.url)
  const organizationId = url.searchParams.get('organization_id')

  if (!organizationId) {
    return new Response(
      JSON.stringify({ error: 'organization_id is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Verify user has access to this organization
  const { data: membership, error: membershipError } = await supabaseClient
    .from('org_members')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .single()

  if (membershipError || !membership) {
    return new Response(
      JSON.stringify({ error: 'Access denied to organization' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get projects for the organization
  const { data: projects, error: projectsError } = await supabaseClient
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (projectsError) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch projects' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ projects: projects || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetTasks(req: Request, supabaseClient: any, user: any) {
  const url = new URL(req.url)
  const organizationId = url.searchParams.get('organization_id')

  if (!organizationId) {
    return new Response(
      JSON.stringify({ error: 'organization_id is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Verify user has access to this organization
  const { data: membership, error: membershipError } = await supabaseClient
    .from('org_members')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .single()

  if (membershipError || !membership) {
    return new Response(
      JSON.stringify({ error: 'Access denied to organization' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get tasks for the organization
  const { data: tasks, error: tasksError } = await supabaseClient
    .from('tasks')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (tasksError) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tasks' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ tasks: tasks || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleCreateTask(req: Request, supabaseClient: any, user: any) {
  const body = await req.json()
  const { organization_id, project_id, title, description } = body

  if (!organization_id || !project_id || !title) {
    return new Response(
      JSON.stringify({ error: 'organization_id, project_id, and title are required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Verify user has access to this organization
  const { data: membership, error: membershipError } = await supabaseClient
    .from('org_members')
    .select('role')
    .eq('organization_id', organization_id)
    .eq('user_id', user.id)
    .single()

  if (membershipError || !membership) {
    return new Response(
      JSON.stringify({ error: 'Access denied to organization' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Create the task
  const { data: task, error: taskError } = await supabaseClient
    .from('tasks')
    .insert([{
      organization_id,
      project_id,
      title,
      description: description || null,
      assigned_to: user.id
    }])
    .select('*')
    .single()

  if (taskError) {
    return new Response(
      JSON.stringify({ error: 'Failed to create task' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ task }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
