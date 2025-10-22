// =====================================================================
// CHATGPT + SUPABASE INTEGRATION
// =====================================================================
// Purpose: Connect ChatGPT to Supabase for automated workflows
// Usage: Run this in your Supabase Edge Functions or viaSocket
// =====================================================================

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// =====================================================================
// CONFIGURATION
// =====================================================================

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({ apiKey: openaiApiKey })

// =====================================================================
// CHATGPT WORKFLOW FUNCTIONS
// =====================================================================

// 1. Customer Support Automation
export async function generateSupportResponse(supportTicket) {
  try {
    const prompt = `
    Generate a helpful customer support response for this Meauxbility support ticket.
    
    Ticket Details:
    - Subject: ${supportTicket.subject}
    - Description: ${supportTicket.description}
    - Category: ${supportTicket.category}
    - Priority: ${supportTicket.priority}
    - User: ${supportTicket.user_name || 'Anonymous'}
    
    Requirements:
    - Professional and empathetic tone
    - Address the specific issue
    - Provide clear next steps
    - Include relevant resources if applicable
    - Keep under 300 words
    - End with "How else can we help you today?"
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      ticket_id: supportTicket.id,
      response_type: 'automated'
    }
  } catch (error) {
    console.error('Error generating support response:', error)
    return { success: false, error: error.message }
  }
}

// 2. Social Media Content Creation
export async function generateSocialMediaContent(contentRequest) {
  try {
    const prompt = `
    Create engaging social media content for Meauxbility based on this request.
    
    Content Request:
    - Platform: ${contentRequest.platform}
    - Topic: ${contentRequest.topic}
    - Tone: ${contentRequest.tone || 'inspiring'}
    - Length: ${contentRequest.length || 'medium'}
    - Include hashtags: ${contentRequest.include_hashtags ? 'Yes' : 'No'}
    
    Requirements:
    - Platform-appropriate format
    - Engaging and shareable
    - Include relevant hashtags
    - Call-to-action if appropriate
    - Brand voice: Community-focused, accessible, inspiring
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.8
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      platform: contentRequest.platform,
      topic: contentRequest.topic
    }
  } catch (error) {
    console.error('Error generating social media content:', error)
    return { success: false, error: error.message }
  }
}

// 3. Volunteer Onboarding Content
export async function generateVolunteerOnboardingContent(volunteerData) {
  try {
    const prompt = `
    Create personalized onboarding content for this new Meauxbility volunteer.
    
    Volunteer Details:
    - Name: ${volunteerData.full_name}
    - Skills: ${volunteerData.skills?.join(', ') || 'General volunteer'}
    - Interests: ${volunteerData.interests?.join(', ') || 'Community service'}
    - Availability: ${volunteerData.available_hours_per_week || 'Flexible'} hours/week
    
    Generate:
    1. Welcome email content
    2. Training schedule recommendations
    3. Role-specific guidance
    4. First week checklist
    5. Mentor assignment suggestions
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      volunteer_id: volunteerData.id
    }
  } catch (error) {
    console.error('Error generating onboarding content:', error)
    return { success: false, error: error.message }
  }
}

// 4. Event Planning Assistant
export async function generateEventPlanningContent(eventData) {
  try {
    const prompt = `
    Create comprehensive event planning content for this Meauxbility event.
    
    Event Details:
    - Name: ${eventData.name}
    - Description: ${eventData.description}
    - Date: ${eventData.event_date}
    - Location: ${eventData.location}
    - Type: ${eventData.event_type}
    - Expected Attendance: ${eventData.expected_attendance || 'TBD'}
    
    Generate:
    1. Event marketing copy
    2. Social media posts
    3. Email invitations
    4. Volunteer recruitment content
    5. Day-of-event checklist
    6. Follow-up content ideas
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      event_id: eventData.id
    }
  } catch (error) {
    console.error('Error generating event content:', error)
    return { success: false, error: error.message }
  }
}

// 5. Grant Writing Assistant
export async function generateGrantProposalContent(grantData) {
  try {
    const prompt = `
    Create compelling grant proposal content for this Meauxbility grant application.
    
    Grant Details:
    - Foundation: ${grantData.foundation_name}
    - Amount Requested: $${(grantData.amount_requested_cents / 100).toLocaleString()}
    - Project: ${grantData.project_name}
    - Timeline: ${grantData.project_timeline}
    - Impact: ${grantData.expected_impact}
    
    Generate:
    1. Executive summary
    2. Problem statement
    3. Solution description
    4. Expected outcomes
    5. Budget justification
    6. Sustainability plan
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.6
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      grant_id: grantData.id
    }
  } catch (error) {
    console.error('Error generating grant content:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// SUPABASE TRIGGER FUNCTIONS
// =====================================================================

// Trigger: New Support Ticket
export async function handleNewSupportTicket(ticketId) {
  try {
    // Get ticket data
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single()
    
    if (error) throw error
    
    // Generate response with ChatGPT
    const response = await generateSupportResponse(ticket)
    
    if (response.success) {
      // Create automated response
      await supabase
        .from('support_responses')
        .insert({
          ticket_id: ticketId,
          responder_id: null, // AI response
          content: response.content,
          is_automated: true,
          status: 'sent'
        })
      
      // Update ticket status
      await supabase
        .from('support_tickets')
        .update({ status: 'responded' })
        .eq('id', ticketId)
      
      // Log AI activity
      await supabase
        .from('ai_content')
        .insert({
          content_type: 'support',
          prompt: 'Support ticket response',
          response: response.content,
          model: 'gpt-4o',
          related_resource_type: 'support_ticket',
          related_resource_id: ticketId
        })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error handling support ticket:', error)
    return { success: false, error: error.message }
  }
}

// Trigger: New Volunteer
export async function handleNewVolunteer(volunteerId) {
  try {
    // Get volunteer data
    const { data: volunteer, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', volunteerId)
      .single()
    
    if (error) throw error
    
    // Generate onboarding content
    const content = await generateVolunteerOnboardingContent(volunteer)
    
    if (content.success) {
      // Create onboarding email
      await supabase
        .from('email_queue')
        .insert({
          to_email: volunteer.email,
          subject: 'Welcome to Meauxbility! Your Onboarding Guide',
          body_html: content.content,
          priority: 2,
          metadata: { source: 'chatgpt_automation', volunteer_id: volunteerId }
        })
      
      // Create onboarding tasks
      await supabase
        .from('tasks')
        .insert({
          title: `Onboard new volunteer: ${volunteer.full_name}`,
          description: content.content,
          project_id: null, // Will be assigned to volunteer project
          assigned_to: null, // Will be assigned to volunteer coordinator
          priority: 'medium',
          status: 'todo'
        })
      
      // Log AI activity
      await supabase
        .from('ai_content')
        .insert({
          content_type: 'onboarding',
          prompt: 'Volunteer onboarding content',
          response: content.content,
          model: 'gpt-4o',
          related_resource_type: 'volunteer',
          related_resource_id: volunteerId
        })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error handling new volunteer:', error)
    return { success: false, error: error.message }
  }
}

// Trigger: New Event
export async function handleNewEvent(eventId) {
  try {
    // Get event data
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    
    if (error) throw error
    
    // Generate event content
    const content = await generateEventPlanningContent(event)
    
    if (content.success) {
      // Store event content
      await supabase
        .from('ai_content')
        .insert({
          content_type: 'event_planning',
          prompt: 'Event planning content',
          response: content.content,
          model: 'gpt-4o',
          related_resource_type: 'event',
          related_resource_id: eventId
        })
      
      // Create marketing tasks
      await supabase
        .from('tasks')
        .insert({
          title: `Promote event: ${event.name}`,
          description: content.content,
          project_id: null, // Will be assigned to marketing project
          assigned_to: null, // Will be assigned to Fred (CMO)
          priority: 'high',
          status: 'todo'
        })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error handling new event:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// TEAM CHATGPT FUNCTIONS
// =====================================================================

// Team Collaboration Content
export async function generateTeamCollaborationContent(collaborationData) {
  try {
    const prompt = `
    Generate team collaboration content for this Meauxbility project.
    
    Project Details:
    - Name: ${collaborationData.project_name}
    - Team Members: ${collaborationData.team_members?.join(', ') || 'Sam, Connor, Fred'}
    - Goals: ${collaborationData.goals}
    - Timeline: ${collaborationData.timeline}
    - Resources: ${collaborationData.resources}
    
    Generate:
    1. Team meeting agenda
    2. Task distribution suggestions
    3. Communication plan
    4. Milestone tracking
    5. Risk assessment
    6. Success metrics
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      project_id: collaborationData.project_id
    }
  } catch (error) {
    console.error('Error generating team collaboration content:', error)
    return { success: false, error: error.message }
  }
}

// Meeting Summary Generation
export async function generateMeetingSummary(meetingData) {
  try {
    const prompt = `
    Generate a comprehensive meeting summary for this Meauxbility team meeting.
    
    Meeting Details:
    - Date: ${meetingData.meeting_date}
    - Attendees: ${meetingData.attendees?.join(', ') || 'Sam, Connor, Fred'}
    - Topics: ${meetingData.topics}
    - Duration: ${meetingData.duration} minutes
    - Key Points: ${meetingData.key_points}
    
    Generate:
    1. Executive summary
    2. Key decisions made
    3. Action items with owners
    4. Next steps
    5. Follow-up requirements
    6. Important dates
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.6
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      meeting_id: meetingData.id
    }
  } catch (error) {
    console.error('Error generating meeting summary:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

// Get ChatGPT usage statistics
export async function getChatGPTUsageStats() {
  try {
    const { data, error } = await supabase
      .from('ai_content')
      .select('model, created_at, tokens_used')
      .eq('model', 'gpt-4o')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    
    if (error) throw error
    
    const stats = data.reduce((acc, item) => {
      const model = item.model || 'gpt-4o'
      if (!acc[model]) {
        acc[model] = { count: 0, tokens: 0 }
      }
      acc[model].count++
      acc[model].tokens += item.tokens_used || 0
      return acc
    }, {})
    
    return { success: true, stats }
  } catch (error) {
    console.error('Error getting ChatGPT usage stats:', error)
    return { success: false, error: error.message }
  }
}

// Test ChatGPT connection
export async function testChatGPTConnection() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello! Please respond with "ChatGPT is connected to Meauxbility successfully."' }],
      max_tokens: 50
    })
    
    return {
      success: true,
      message: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error testing ChatGPT connection:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// EXPORT ALL FUNCTIONS
// =====================================================================

export default {
  generateSupportResponse,
  generateSocialMediaContent,
  generateVolunteerOnboardingContent,
  generateEventPlanningContent,
  generateGrantProposalContent,
  handleNewSupportTicket,
  handleNewVolunteer,
  handleNewEvent,
  generateTeamCollaborationContent,
  generateMeetingSummary,
  getChatGPTUsageStats,
  testChatGPTConnection
}
