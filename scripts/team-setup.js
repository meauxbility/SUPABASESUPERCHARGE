#!/usr/bin/env node

/**
 * Team Setup Script for Meauxbility
 * Configures team access and permissions
 */

const fs = require('fs');
const path = require('path');

// Team configuration
const TEAM_CONFIG = {
  owner: {
    name: 'Brandon Primeaux',
    email: 'brandon@meauxbility.org',
    role: 'owner',
    permissions: ['admin', 'write', 'read', 'review']
  },
  teammate: {
    name: 'Teammate',
    email: 'teammate@meauxbility.org',
    role: 'maintainer',
    permissions: ['write', 'read', 'review']
  },
  aiAgents: [
    {
      name: 'Primary AI Agent',
      role: 'contributor',
      permissions: ['read', 'write', 'review'],
      accessToken: process.env.AI_AGENT_ACCESS_TOKEN
    },
    {
      name: 'Security AI Agent',
      role: 'contributor',
      permissions: ['read', 'scan'],
      accessToken: process.env.AI_SECURITY_TOKEN
    }
  ]
};

/**
 * Generate team access configuration
 */
function generateTeamConfig() {
  const config = {
    repository: {
      name: 'meauxbility',
      private: true,
      description: 'Private Meauxbility development repository',
      topics: ['private', 'team-collaboration', 'ai-agents', 'notion-integration']
    },
    team: {
      members: [TEAM_CONFIG.owner, TEAM_CONFIG.teammate],
      aiAgents: TEAM_CONFIG.aiAgents,
      accessControl: {
        branchProtection: {
          main: {
            requiredStatusChecks: true,
            enforceAdmins: true,
            requiredPullRequestReviews: 1,
            dismissStaleReviews: true
          },
          develop: {
            requiredStatusChecks: true,
            enforceAdmins: false,
            requiredPullRequestReviews: 1
          }
        },
        permissions: {
          admin: ['Brandon Primeaux'],
          maintain: ['Teammate'],
          write: ['Primary AI Agent'],
          read: ['Security AI Agent']
        }
      }
    },
    security: {
      secretScanning: true,
      vulnerabilityAlerts: true,
      dependencyReview: true,
      codeScanning: true
    }
  };

  return config;
}

/**
 * Generate GitHub team setup instructions
 */
function generateGitHubSetupInstructions() {
  return `
# GitHub Repository Setup Instructions

## 1. Create Private Repository
1. Go to GitHub and create a new private repository named 'meauxbility'
2. Set description: "Private Meauxbility development repository"
3. Add topics: private, team-collaboration, ai-agents, notion-integration
4. Initialize with README (we'll replace it)

## 2. Configure Team Access
1. Go to Settings > Manage access
2. Click "Invite a collaborator"
3. Add teammate email: ${TEAM_CONFIG.teammate.email}
4. Set role: Maintainer
5. Send invitation

## 3. Set Up Branch Protection
1. Go to Settings > Branches
2. Add rule for 'main' branch:
   - Require pull request reviews (1 reviewer)
   - Dismiss stale reviews
   - Require status checks
   - Require branches to be up to date
   - Restrict pushes to matching branches
3. Add rule for 'develop' branch:
   - Require pull request reviews (1 reviewer)
   - Require status checks

## 4. Configure Security Settings
1. Go to Settings > Security
2. Enable "Dependency graph"
3. Enable "Dependabot alerts"
4. Enable "Dependabot security updates"
5. Enable "Secret scanning"
6. Enable "Code scanning"

## 5. Set Up GitHub Actions
1. Go to Settings > Actions > General
2. Allow all actions and reusable workflows
3. Set workflow permissions to "Read and write permissions"

## 6. Configure Secrets
Add the following secrets in Settings > Secrets and variables > Actions:
- NOTION_API_KEY: Your Notion integration API key
- NOTION_DATABASE_ID: Your Notion database ID
- NOTION_PAGE_ID: Your Notion page ID
- AI_AGENT_ACCESS_TOKEN: Token for AI agent access
- AI_SECURITY_TOKEN: Token for security AI agent

## 7. Set Up Notion Integration
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Get your API key
3. Create a database for project tracking
4. Share the database with your integration
5. Get the database ID from the URL
6. Create a page for sync information
7. Get the page ID from the URL

## 8. Final Steps
1. Push this repository to GitHub
2. Test the GitHub Actions workflows
3. Verify team member access
4. Test Notion integration
5. Configure AI agent access tokens
`;
}

/**
 * Generate team collaboration guidelines
 */
function generateCollaborationGuidelines() {
  return `
# Team Collaboration Guidelines

## 🤝 Team Roles

### Owner (Brandon Primeaux)
- Full repository access
- Can manage team members
- Can configure security settings
- Can merge to main branch

### Maintainer (Teammate)
- Can create and merge pull requests
- Can manage issues and projects
- Cannot change repository settings
- Cannot delete branches

### AI Agents
- **Primary AI Agent**: Code review, suggestions, automated testing
- **Security AI Agent**: Security scanning, vulnerability detection

## 🔄 Workflow

### Development Process
1. Create feature branch from develop
2. Make changes and commit with conventional format
3. Push branch and create pull request
4. Request review from team member
5. Address feedback and update PR
6. Merge to develop after approval
7. Merge develop to main for releases

### Commit Message Format
\`\`\`
type(scope): description

feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add or update tests
chore: maintenance tasks
\`\`\`

### Code Review Process
1. All PRs require at least one review
2. AI agents provide automated feedback
3. Security scan must pass
4. All tests must pass
5. No merge conflicts

## 🔐 Security Guidelines

### Access Control
- Private repository access only
- No public forks allowed
- All external access through approved integrations
- Regular access review and cleanup

### Secret Management
- Never commit secrets to repository
- Use environment variables for sensitive data
- Rotate access tokens regularly
- Monitor for exposed secrets

### AI Agent Permissions
- Limited to specific directories
- No access to sensitive configuration
- All actions logged and monitored
- Regular permission review

## 📋 Notion Integration

### Documentation Sync
- Automatic sync on main branch updates
- Manual sync available via npm script
- Team collaboration through shared workspace
- AI agent coordination through Notion

### Task Management
- Use Notion for project planning
- Track progress and milestones
- Coordinate team activities
- Document decisions and processes
`;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Setting up team configuration for Meauxbility...');

  // Generate configuration files
  const teamConfig = generateTeamConfig();
  const setupInstructions = generateGitHubSetupInstructions();
  const collaborationGuidelines = generateCollaborationGuidelines();

  // Write configuration files
  fs.writeFileSync(
    path.join(__dirname, '..', 'team-config.json'),
    JSON.stringify(teamConfig, null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, '..', 'GITHUB_SETUP.md'),
    setupInstructions
  );

  fs.writeFileSync(
    path.join(__dirname, '..', 'COLLABORATION_GUIDELINES.md'),
    collaborationGuidelines
  );

  console.log('✅ Team configuration generated successfully!');
  console.log('📁 Files created:');
  console.log('   - team-config.json');
  console.log('   - GITHUB_SETUP.md');
  console.log('   - COLLABORATION_GUIDELINES.md');
  console.log('');
  console.log('📋 Next steps:');
  console.log('   1. Follow instructions in GITHUB_SETUP.md');
  console.log('   2. Review COLLABORATION_GUIDELINES.md with your team');
  console.log('   3. Configure environment variables');
  console.log('   4. Test the setup');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateTeamConfig, generateGitHubSetupInstructions, generateCollaborationGuidelines };
