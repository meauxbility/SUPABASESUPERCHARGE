// =====================================================================
// TEAM CHATGPT + SUPABASE INTEGRATION
// =====================================================================
// Purpose: Connect Team ChatGPT to Supabase for collaborative workflows
// Usage: Run this in your Supabase Edge Functions or viaSocket
// =====================================================================

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// =====================================================================
// CONFIGURATION
// =====================================================================

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const teamOpenaiApiKey = process.env.TEAM_OPENAI_API_KEY // Team-specific key
const teamOrganizationId = process.env.TEAM_OPENAI_ORG_ID // Team organization ID

const supabase = createClient(supabaseUrl, supabaseKey)
const teamOpenai = new OpenAI({ 
  apiKey: teamOpenaiApiKey,
  organization: teamOrganizationId
})

// =====================================================================
// TEAM COLLABORATION FUNCTIONS
// =====================================================================

// 1. Team Task Assignment
export async function generateTeamTaskAssignments(projectData) {
  try {
    const prompt = `
    Analyze this Meauxbility project and suggest optimal task assignments for the team.
    
    Project Details:
    - Name: ${projectData.name}
    - Description: ${projectData.description}
    - Timeline: ${projectData.timeline}
    - Budget: $${(projectData.budget_cents / 100).toLocaleString()}
    - Priority: ${projectData.priority}
    
    Team Members:
    - Sam (CEO): Strategic planning, leadership, fundraising
    - Connor (CTO): Technical development, system architecture, security
    - Fred (CMO): Marketing, content creation, social media, events
    
    Generate:
    1. Task breakdown by team member
    2. Dependencies and sequencing
    3. Timeline recommendations
    4. Resource requirements
    5. Risk mitigation strategies
    6. Success metrics
    `
    
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      project_id: projectData.id
    }
  } catch (error) {
    console.error('Error generating team assignments:', error)
    return { success: false, error: error.message }
  }
}

// 2. Team Performance Analysis
export async function analyzeTeamPerformance(performanceData) {
  try {
    const prompt = `
    Analyze team performance for Meauxbility and provide insights and recommendations.
    
    Performance Data:
    - Period: ${performanceData.period_start} to ${performanceData.period_end}
    - Projects Completed: ${performanceData.projects_completed}
    - Tasks Completed: ${performanceData.tasks_completed}
    - Team Satisfaction: ${performanceData.team_satisfaction}/10
    - Productivity Score: ${performanceData.productivity_score}/10
    
    Individual Performance:
    - Sam (CEO): ${performanceData.sam_performance || 'Not specified'}
    - Connor (CTO): ${performanceData.connor_performance || 'Not specified'}
    - Fred (CMO): ${performanceData.fred_performance || 'Not specified'}
    
    Generate:
    1. Overall team performance summary
    2. Individual strengths and areas for improvement
    3. Team dynamics analysis
    4. Recommendations for improvement
    5. Goal setting for next period
    6. Recognition and rewards suggestions
    `
    
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.6
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      analysis_id: performanceData.id
    }
  } catch (error) {
    console.error('Error analyzing team performance:', error)
    return { success: false, error: error.message }
  }
}

// 3. Team Communication Optimization
export async function optimizeTeamCommunication(communicationData) {
  try {
    const prompt = `
    Analyze team communication patterns and suggest optimizations for Meauxbility.
    
    Communication Data:
    - Meeting Frequency: ${communicationData.meeting_frequency}
    - Communication Tools: ${communicationData.communication_tools?.join(', ') || 'Email, Slack, Zoom'}
    - Response Times: ${communicationData.avg_response_time} hours
    - Collaboration Score: ${communicationData.collaboration_score}/10
    - Issues Identified: ${communicationData.issues || 'None specified'}
    
    Generate:
    1. Communication workflow recommendations
    2. Tool optimization suggestions
    3. Meeting structure improvements
    4. Documentation standards
    5. Conflict resolution strategies
    6. Team bonding activities
    `
    
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      communication_id: communicationData.id
    }
  } catch (error) {
    console.error('Error optimizing team communication:', error)
    return { success: false, error: error.message }
  }
}

// 4. Strategic Planning Assistant
export async function generateStrategicPlan(strategicData) {
  try {
    const prompt = `
    Create a comprehensive strategic plan for Meauxbility based on current data and goals.
    
    Strategic Data:
    - Mission: ${strategicData.mission}
    - Vision: ${strategicData.vision}
    - Current Goals: ${strategicData.current_goals}
    - Challenges: ${strategicData.challenges}
    - Opportunities: ${strategicData.opportunities}
    - Timeline: ${strategicData.timeline}
    
    Generate:
    1. Strategic objectives
    2. Key performance indicators
    3. Action plans by quarter
    4. Resource requirements
    5. Risk assessment
    6. Success metrics
    7. Team responsibilities
    `
    
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.6
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      strategic_plan_id: strategicData.id
    }
  } catch (error) {
    console.error('Error generating strategic plan:', error)
    return { success: false, error: error.message }
  }
}

// 5. Team Learning and Development
export async function generateLearningPlan(learningData) {
  try {
    const prompt = `
    Create a personalized learning and development plan for the Meauxbility team.
    
    Learning Data:
    - Team Skills: ${learningData.current_skills?.join(', ') || 'General nonprofit management'}
    - Learning Goals: ${learningData.learning_goals}
    - Budget: $${(learningData.learning_budget_cents / 100).toLocaleString()}
    - Timeline: ${learningData.timeline}
    - Learning Style: ${learningData.learning_style || 'Mixed'}
    
    Individual Learning Needs:
    - Sam (CEO): Leadership, fundraising, strategic planning
    - Connor (CTO): Technical skills, security, system architecture
    - Fred (CMO): Marketing, content creation, social media
    
    Generate:
    1. Individual learning paths
    2. Team learning activities
    3. Resource recommendations
    4. Skill assessment plan
    5. Progress tracking methods
    6. Certification opportunities
    `
    
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      learning_plan_id: learningData.id
    }
  } catch (error) {
    console.error('Error generating learning plan:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// SUPABASE TRIGGER FUNCTIONS
// =====================================================================

// Trigger: New Project
export async function handleNewProject(projectId) {
  try {
    // Get project data
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    
    if (error) throw error
    
    // Generate team assignments
    const assignments = await generateTeamTaskAssignments(project)
    
    if (assignments.success) {
      // Create project tasks
      await supabase
        .from('tasks')
        .insert({
          title: `Project: ${project.name}`,
          description: assignments.content,
          project_id: projectId,
          assigned_to: null, // Will be assigned based on AI recommendations
          priority: project.priority,
          status: 'todo'
        })
      
      // Log AI activity
      await supabase
        .from('ai_content')
        .insert({
          content_type: 'project_planning',
          prompt: 'Team task assignment',
          response: assignments.content,
          model: 'gpt-4o-team',
          related_resource_type: 'project',
          related_resource_id: projectId
        })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error handling new project:', error)
    return { success: false, error: error.message }
  }
}

// Trigger: Team Performance Review
export async function handleTeamPerformanceReview(reviewId) {
  try {
    // Get performance data
    const { data: performance, error } = await supabase
      .from('team_performance_reviews')
      .select('*')
      .eq('id', reviewId)
      .single()
    
    if (error) throw error
    
    // Generate performance analysis
    const analysis = await analyzeTeamPerformance(performance)
    
    if (analysis.success) {
      // Store analysis results
      await supabase
        .from('ai_content')
        .insert({
          content_type: 'performance_analysis',
          prompt: 'Team performance analysis',
          response: analysis.content,
          model: 'gpt-4o-team',
          related_resource_type: 'team_performance_review',
          related_resource_id: reviewId
        })
      
      // Create improvement tasks
      await supabase
        .from('tasks')
        .insert({
          title: 'Implement team performance improvements',
          description: analysis.content,
          project_id: null, // Will be assigned to team development project
          assigned_to: null, // Will be assigned to Sam (CEO)
          priority: 'high',
          status: 'todo'
        })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error handling team performance review:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// TEAM WORKFLOW FUNCTIONS
// =====================================================================

// Daily Team Standup Assistant
export async function generateDailyStandup(standupData) {
  try {
    const prompt = `
    Generate a daily standup agenda for the Meauxbility team.
    
    Standup Data:
    - Date: ${standupData.date}
    - Team Members: Sam (CEO), Connor (CTO), Fred (CMO)
    - Previous Day Accomplishments: ${standupData.previous_accomplishments}
    - Today's Priorities: ${standupData.todays_priorities}
    - Blockers: ${standupData.blockers || 'None'}
    - Team Mood: ${standupData.team_mood || 'Good'}
    
    Generate:
    1. Meeting agenda
    2. Discussion topics
    3. Action items
    4. Follow-up requirements
    5. Team motivation
    `
    
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      standup_id: standupData.id
    }
  } catch (error) {
    console.error('Error generating daily standup:', error)
    return { success: false, error: error.message }
  }
}

// Team Retrospective Assistant
export async function generateTeamRetrospective(retrospectiveData) {
  try {
    const prompt = `
    Generate a team retrospective agenda for Meauxbility.
    
    Retrospective Data:
    - Period: ${retrospectiveData.period}
    - Team Members: Sam (CEO), Connor (CTO), Fred (CMO)
    - Achievements: ${retrospectiveData.achievements}
    - Challenges: ${retrospectiveData.challenges}
    - Team Feedback: ${retrospectiveData.team_feedback}
    
    Generate:
    1. Retrospective format
    2. Discussion questions
    3. Action items
    4. Improvement suggestions
    5. Team celebration ideas
    6. Next period goals
    `
    
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.7
    })
    
    return {
      success: true,
      content: response.choices[0].message.content,
      retrospective_id: retrospectiveData.id
    }
  } catch (error) {
    console.error('Error generating team retrospective:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

// Get Team ChatGPT usage statistics
export async function getTeamChatGPTUsageStats() {
  try {
    const { data, error } = await supabase
      .from('ai_content')
      .select('model, created_at, tokens_used')
      .eq('model', 'gpt-4o-team')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    
    if (error) throw error
    
    const stats = data.reduce((acc, item) => {
      const model = item.model || 'gpt-4o-team'
      if (!acc[model]) {
        acc[model] = { count: 0, tokens: 0 }
      }
      acc[model].count++
      acc[model].tokens += item.tokens_used || 0
      return acc
    }, {})
    
    return { success: true, stats }
  } catch (error) {
    console.error('Error getting team ChatGPT usage stats:', error)
    return { success: false, error: error.message }
  }
}

// Test Team ChatGPT connection
export async function testTeamChatGPTConnection() {
  try {
    const response = await teamOpenai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello! Please respond with "Team ChatGPT is connected to Meauxbility successfully."' }],
      max_tokens: 50
    })
    
    return {
      success: true,
      message: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error testing team ChatGPT connection:', error)
    return { success: false, error: error.message }
  }
}

// =====================================================================
// EXPORT ALL FUNCTIONS
// =====================================================================

export default {
  generateTeamTaskAssignments,
  analyzeTeamPerformance,
  optimizeTeamCommunication,
  generateStrategicPlan,
  generateLearningPlan,
  handleNewProject,
  handleTeamPerformanceReview,
  generateDailyStandup,
  generateTeamRetrospective,
  getTeamChatGPTUsageStats,
  testTeamChatGPTConnection
}
