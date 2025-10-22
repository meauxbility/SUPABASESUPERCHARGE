// =====================================================================
// AI INTEGRATIONS SETUP SCRIPT
// =====================================================================
// Purpose: Set up all AI integrations for Meauxbility platform
// Usage: npm run setup
// =====================================================================

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// =====================================================================
// CONFIGURATION
// =====================================================================

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anthropicApiKey = process.env.ANTHROPIC_API_KEY
const openaiApiKey = process.env.OPENAI_API_KEY
const teamOpenaiApiKey = process.env.TEAM_OPENAI_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)
const anthropic = new Anthropic({ apiKey: anthropicApiKey })
const openai = new OpenAI({ apiKey: openaiApiKey })
const teamOpenai = new OpenAI({ apiKey: teamOpenaiApiKey })

// =====================================================================
// SETUP FUNCTIONS
// =====================================================================

async function testSupabaseConnection() {
  console.log('🔗 Testing Supabase connection...')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return false
  }
}

async function testClaudeConnection() {
  console.log('🤖 Testing Claude connection...')
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Hello! Please respond with "Claude is connected to Meauxbility successfully."' }]
    })
    
    console.log('✅ Claude connection successful')
    console.log('📝 Response:', response.content[0].text)
    return true
  } catch (error) {
    console.error('❌ Claude connection failed:', error.message)
    return false
  }
}

async function testChatGPTConnection() {
  console.log('💬 Testing ChatGPT connection...')
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello! Please respond with "ChatGPT is connected to Meauxbility successfully."' }],
      max_tokens: 50
    })
    
    console.log('✅ ChatGPT connection successful')
    console.log('📝 Response:', response.choices[0].message.content)
    return true
  } catch (error) {
    console.error('❌ ChatGPT connection failed:', error.message)
    return false
  }
}

async function testTeamChatGPTConnection() {
  console.log('👥 Testing Team ChatGPT connection...')
  try {
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello! Please respond with "Team ChatGPT is connected to Meauxbility successfully."' }],
      max_tokens: 50
    })
    
    console.log('✅ Team ChatGPT connection successful')
    console.log('📝 Response:', response.choices[0].message.content)
    return true
  } catch (error) {
    console.error('❌ Team ChatGPT connection failed:', error.message)
    return false
  }
}

async function createAITables() {
  console.log('📊 Creating AI-related tables...')
  try {
    // Create ai_content table if it doesn't exist
    const { error: aiContentError } = await supabase.rpc('create_ai_content_table')
    if (aiContentError && !aiContentError.message.includes('already exists')) {
      throw aiContentError
    }
    
    // Create ai_workflows table if it doesn't exist
    const { error: workflowsError } = await supabase.rpc('create_ai_workflows_table')
    if (workflowsError && !workflowsError.message.includes('already exists')) {
      throw workflowsError
    }
    
    console.log('✅ AI tables created successfully')
    return true
  } catch (error) {
    console.error('❌ Error creating AI tables:', error.message)
    return false
  }
}

async function setupAITriggers() {
  console.log('⚡ Setting up AI triggers...')
  try {
    // Create trigger for new donations
    const { error: donationTrigger } = await supabase.rpc('create_donation_ai_trigger')
    if (donationTrigger && !donationTrigger.message.includes('already exists')) {
      throw donationTrigger
    }
    
    // Create trigger for new volunteers
    const { error: volunteerTrigger } = await supabase.rpc('create_volunteer_ai_trigger')
    if (volunteerTrigger && !volunteerTrigger.message.includes('already exists')) {
      throw volunteerTrigger
    }
    
    // Create trigger for new campaigns
    const { error: campaignTrigger } = await supabase.rpc('create_campaign_ai_trigger')
    if (campaignTrigger && !campaignTrigger.message.includes('already exists')) {
      throw campaignTrigger
    }
    
    console.log('✅ AI triggers set up successfully')
    return true
  } catch (error) {
    console.error('❌ Error setting up AI triggers:', error.message)
    return false
  }
}

async function testAIIntegrations() {
  console.log('🧪 Testing AI integrations...')
  try {
    // Test Claude integration
    const claudeTest = await testClaudeConnection()
    
    // Test ChatGPT integration
    const chatgptTest = await testChatGPTConnection()
    
    // Test Team ChatGPT integration
    const teamTest = await testTeamChatGPTConnection()
    
    const allTestsPassed = claudeTest && chatgptTest && teamTest
    
    if (allTestsPassed) {
      console.log('✅ All AI integrations working correctly')
    } else {
      console.log('⚠️ Some AI integrations failed - check your API keys')
    }
    
    return allTestsPassed
  } catch (error) {
    console.error('❌ Error testing AI integrations:', error.message)
    return false
  }
}

async function createSampleWorkflows() {
  console.log('📋 Creating sample AI workflows...')
  try {
    // Create sample workflow for donation thank you
    const { error: donationWorkflow } = await supabase
      .from('ai_workflows')
      .insert({
        name: 'Donation Thank You Automation',
        description: 'Automatically generate personalized thank you emails for donations',
        trigger_type: 'database',
        trigger_table: 'donations',
        trigger_event: 'INSERT',
        ai_model: 'claude-3-5-sonnet',
        is_active: true,
        created_by: 'system'
      })
    
    if (donationWorkflow) throw donationWorkflow
    
    // Create sample workflow for volunteer onboarding
    const { error: volunteerWorkflow } = await supabase
      .from('ai_workflows')
      .insert({
        name: 'Volunteer Onboarding Automation',
        description: 'Automatically generate onboarding content for new volunteers',
        trigger_type: 'database',
        trigger_table: 'volunteers',
        trigger_event: 'INSERT',
        ai_model: 'gpt-4o',
        is_active: true,
        created_by: 'system'
      })
    
    if (volunteerWorkflow) throw volunteerWorkflow
    
    // Create sample workflow for team collaboration
    const { error: teamWorkflow } = await supabase
      .from('ai_workflows')
      .insert({
        name: 'Team Collaboration Assistant',
        description: 'AI-powered team task assignment and collaboration',
        trigger_type: 'manual',
        trigger_table: 'projects',
        trigger_event: 'INSERT',
        ai_model: 'gpt-4o-team',
        is_active: true,
        created_by: 'system'
      })
    
    if (teamWorkflow) throw teamWorkflow
    
    console.log('✅ Sample AI workflows created successfully')
    return true
  } catch (error) {
    console.error('❌ Error creating sample workflows:', error.message)
    return false
  }
}

// =====================================================================
// MAIN SETUP FUNCTION
// =====================================================================

async function setupAIIntegrations() {
  console.log('🚀 Starting AI integrations setup for Meauxbility...')
  console.log('')
  
  const results = {
    supabase: false,
    claude: false,
    chatgpt: false,
    teamChatgpt: false,
    tables: false,
    triggers: false,
    workflows: false
  }
  
  // Test connections
  results.supabase = await testSupabaseConnection()
  results.claude = await testClaudeConnection()
  results.chatgpt = await testChatGPTConnection()
  results.teamChatgpt = await testTeamChatGPTConnection()
  
  console.log('')
  
  // Set up database components
  if (results.supabase) {
    results.tables = await createAITables()
    results.triggers = await setupAITriggers()
    results.workflows = await createSampleWorkflows()
  }
  
  console.log('')
  console.log('📊 Setup Results:')
  console.log('================')
  console.log(`Supabase: ${results.supabase ? '✅' : '❌'}`)
  console.log(`Claude: ${results.claude ? '✅' : '❌'}`)
  console.log(`ChatGPT: ${results.chatgpt ? '✅' : '❌'}`)
  console.log(`Team ChatGPT: ${results.teamChatgpt ? '✅' : '❌'}`)
  console.log(`AI Tables: ${results.tables ? '✅' : '❌'}`)
  console.log(`AI Triggers: ${results.triggers ? '✅' : '❌'}`)
  console.log(`Sample Workflows: ${results.workflows ? '✅' : '❌'}`)
  
  console.log('')
  
  const allSuccessful = Object.values(results).every(result => result === true)
  
  if (allSuccessful) {
    console.log('🎉 All AI integrations set up successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Test your workflows in the Supabase dashboard')
    console.log('2. Set up viaSocket for visual workflow management')
    console.log('3. Configure your team permissions')
    console.log('4. Start using AI-powered automation!')
  } else {
    console.log('⚠️ Some integrations failed. Please check your API keys and try again.')
    console.log('')
    console.log('Required API keys:')
    console.log('- ANTHROPIC_API_KEY (for Claude)')
    console.log('- OPENAI_API_KEY (for ChatGPT)')
    console.log('- TEAM_OPENAI_API_KEY (for Team ChatGPT)')
    console.log('- SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return allSuccessful
}

// =====================================================================
// RUN SETUP
// =====================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  setupAIIntegrations()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Setup failed:', error)
      process.exit(1)
    })
}

export default setupAIIntegrations
