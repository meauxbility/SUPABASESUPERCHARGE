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

    // Route to appropriate handler
    if (path === '/asset_signer/sign' && req.method === 'POST') {
      return await handleSignUpload(req, supabaseClient, user)
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

async function handleSignUpload(req: Request, supabaseClient: any, user: any) {
  const body = await req.json()
  const { organization_id, path, expires_in = 900 } = body

  if (!organization_id || !path) {
    return new Response(
      JSON.stringify({ error: 'organization_id and path are required' }),
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

  try {
    // Generate signed URL for upload
    const { data, error } = await supabaseClient.storage
      .from('team-assets')
      .createSignedUploadUrl(path, {
        expiresIn: expires_in
      })

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to create signed URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        url: data.signedUrl,
        path: data.path,
        expires_at: data.expiresAt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Sign upload error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to sign upload URL' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
