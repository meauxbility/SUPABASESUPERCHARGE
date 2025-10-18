
# GitHub Repository Setup Instructions

## 1. Create Private Repository
1. Go to GitHub and create a new private repository named 'meauxbility'
2. Set description: "Private Meauxbility development repository"
3. Add topics: private, team-collaboration, ai-agents, notion-integration
4. Initialize with README (we'll replace it)

## 2. Configure Team Access
1. Go to Settings > Manage access
2. Click "Invite a collaborator"
3. Add teammate email: teammate@meauxbility.org
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
