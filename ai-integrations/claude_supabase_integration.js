// =====================================================================
// CLAUDE + SUPABASE INTEGRATION
// =====================================================================
// Purpose: Connect Claude AI to Supabase for automated workflows
// Usage: Run this in your Supabase Edge Functions or viaSocket
// =====================================================================

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// =====================================================================
// CONFIGURATION
// =====================================================================

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anthropicApiKey = process.env.ANTHROPIC_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)
const anthropic = new Anthropic({ apiKey: anthropicApiKey })

// =====================================================================
// CLAUDE WORKFLOW FUNCTIONS
// =====================================================================

// 1. Donation Thank You Generation
export async function generateDonationThankYou(donationData) {
  try {
    const prompt = `
    Generate a personalized thank you email for a donation to Meauxbility.
    
    Donation Details:
    - Amount: $${(donationData.amount_cents / 100).toFixed(2)}
    - Donor: ${donationData.donor_name || 'Anonymous'}
    - Campaign: ${donationData.campaign_name || 'General Fund'}
    - Date: ${new Date(donationData.created_at).toLocaleDateString()}
    
    Requirements:
    - Warm, personal tone
    - Mention specific impact of donation
    - Include tax deduction information if applicable
    - Keep under 200 words
    - Professional but heartfelt
    `
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })
    
    return {
      success: true,
      content: response.content[0].text,
      donor_email: donationData.donor_email,
      subject: `Thank you for your generous donation to Meauxbility`
    }
  } catch (error) {
    console.error('Error generating thank you:', error)
    return { success: false, error: error.message }
  }
}

// 2. Volunteer Application Review
export async function reviewVolunteerApplication(volunteerData) {
  try {
    const prompt = `
    Review this volunteer application for Meauxbility and provide a recommendation.
    
    Application Details:
    - Name: ${volunteerData.full_name}
    - Skills: ${volunteerData.skills?.join(', ') || 'Not specified'}
    - Interests: ${volunteerData.interests?.join(', ') || 'Not specified'}
    - Available Hours: ${volunteerData.available_hours_per_week || 'Not specified'}
    - Background Check: ${volunteerData.background_check_completed ? 'Completed' : 'Pending'}
    
    Provide:
    1. Overall recommendation (Approve/Review/Decline)
    2. Key strengths
    3. Areas of concern
    4. Suggested volunteer roles
    5. Next steps
    `
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    })
    
    return {
      success: true,
      recommendation: response.content[0].text,
      volunteer_id: volunteerData.id
    }
  } catch (error) {
    console.error('Error reviewing application:', error)
    return { success: false, error: error.message }
  }
}

// 3. Campaign Content Generation
export async function generateCampaignContent(campaignData) {
  try {
    const prompt = `
    Create comprehensive marketing content for this Meauxbility campaign.
    
    Campaign Details:
    - Name: ${campaignData.name}
    - Description: ${campaignData.description}
    - Goal: $${(campaignData.goal_amount_cents / 100).toLocaleString()}
    - Raised: $${(campaignData.raised_amount_cents / 100).toLocaleString()}
    
    Generate:
    1. Social media post (Facebook, Instagram, Twitter)
    2. Email newsletter content
    3. Website banner text
    4. Call-to-action suggestions
    5. Hashtag recommendations
    
    Tone: Inspiring, community-focused, accessible
    `
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
    
    return {
      success: true,
      content: response.content[0].text,
      campaign_id: campaignData.id
    }
  } catch (error) {
    console.error('Error generating campaign content:', error)
    return { success: false, error: error.message }
  }
}

// 4. Financial Report Analysis
export async function analyzeFinancialReport(reportData) {
  try {
    const prompt = `
    Analyze this financial report for Meauxbility and provide executive insights.
    
    Report Data:
    - Period: ${reportData.period_start} to ${reportData.period_end}
    - Total Donations: $${(reportData.total_donations_cents / 100).toLocaleString()}
    - Total Expenses: $${(reportData.total_expenses_cents / 100).toLocaleString()}
    - Net Income: $${(reportData.net_income_cents / 100).toLocaleString()}
    - Grants: $${(reportData.total_grants_cents / 100).toLocaleString()}
    
    Provide:
    1. Key financial highlights
    2. Trends and patterns
    3. Areas of concern
    4. Recommendations for improvement
    5. Next quarter projections
    `
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }]
    })
    
    return {
      success: true,
      analysis: response.content[0].text,
      report_id: reportData.id
    }
  } catch (error) {
    console.error('Error analyzing financial report:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// SUPABASE TRIGGER FUNCTIONS
// =====================================================================

// Trigger: New Donation
export async function handleNewDonation(donationId) {
  try {
    // Get donation data
    const { data: donation, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single()
    
    if (error) throw error
    
    // Generate thank you with Claude
    const thankYou = await generateDonationThankYou(donation)
    
    if (thankYou.success) {
      // Queue email
      await supabase
        .from('email_queue')
        .insert({
          to_email: thankYou.donor_email,
          subject: thankYou.subject,
          body_html: thankYou.content,
          priority: 1,
          metadata: { source: 'claude_automation', donation_id: donationId }
        })
      
      // Log AI activity
      await supabase
        .from('ai_content')
        .insert({
          content_type: 'email',
          prompt: 'Donation thank you generation',
          response: thankYou.content,
          model: 'claude-3-5-sonnet',
          user_id: donation.donor_id,
          related_resource_type: 'donation',
          related_resource_id: donationId
        })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error handling new donation:', error)
    return { success: false, error: error.message }
  }
}

// Trigger: New Volunteer Application
export async function handleNewVolunteerApplication(volunteerId) {
  try {
    // Get volunteer data
    const { data: volunteer, error } = await supabase
      .from('volunteers')
      .select('*, profiles(*)')
      .eq('id', volunteerId)
      .single()
    
    if (error) throw error
    
    // Review application with Claude
    const review = await reviewVolunteerApplication(volunteer)
    
    if (review.success) {
      // Create notification for admins
      await supabase
        .from('notifications')
        .insert({
          user_id: volunteer.id,
          type: 'in_app',
          title: 'Volunteer Application Reviewed',
          message: 'AI has reviewed your application and provided recommendations.',
          resource_type: 'volunteer',
          resource_id: volunteerId
        })
      
      // Log AI activity
      await supabase
        .from('ai_content')
        .insert({
          content_type: 'review',
          prompt: 'Volunteer application review',
          response: review.recommendation,
          model: 'claude-3-5-sonnet',
          related_resource_type: 'volunteer',
          related_resource_id: volunteerId
        })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error handling volunteer application:', error)
    return { success: false, error: error.message }
  }
}

// Trigger: New Campaign
export async function handleNewCampaign(campaignId) {
  try {
    // Get campaign data
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()
    
    if (error) throw error
    
    // Generate content with Claude
    const content = await generateCampaignContent(campaign)
    
    if (content.success) {
      // Store generated content
      await supabase
        .from('ai_content')
        .insert({
          content_type: 'marketing',
          prompt: 'Campaign content generation',
          response: content.content,
          model: 'claude-3-5-sonnet',
          related_resource_type: 'campaign',
          related_resource_id: campaignId
        })
      
      // Create task for marketing team
      await supabase
        .from('tasks')
        .insert({
          title: `Review AI-generated content for ${campaign.name}`,
          description: content.content,
          project_id: null, // Will be assigned to marketing project
          assigned_to: null, // Will be assigned to Fred (CMO)
          priority: 'medium',
          status: 'todo'
        })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error handling new campaign:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

// Get AI usage statistics
export async function getAIUsageStats() {
  try {
    const { data, error } = await supabase
      .from('ai_content')
      .select('model, created_at, tokens_used')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    
    if (error) throw error
    
    const stats = data.reduce((acc, item) => {
      const model = item.model || 'unknown'
      if (!acc[model]) {
        acc[model] = { count: 0, tokens: 0 }
      }
      acc[model].count++
      acc[model].tokens += item.tokens_used || 0
      return acc
    }, {})
    
    return { success: true, stats }
  } catch (error) {
    console.error('Error getting AI usage stats:', error)
    return { success: false, error: error.message }
  }
}

// Test Claude connection
export async function testClaudeConnection() {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Hello! Please respond with "Claude is connected to Meauxbility successfully."' }]
    })
    
    return {
      success: true,
      message: response.content[0].text,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error testing Claude connection:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// EXPORT ALL FUNCTIONS
// =====================================================================

export default {
  generateDonationThankYou,
  reviewVolunteerApplication,
  generateCampaignContent,
  analyzeFinancialReport,
  handleNewDonation,
  handleNewVolunteerApplication,
  handleNewCampaign,
  getAIUsageStats,
  testClaudeConnection
}
