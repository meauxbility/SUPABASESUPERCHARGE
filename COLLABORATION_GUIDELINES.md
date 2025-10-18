
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
```
type(scope): description

feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add or update tests
chore: maintenance tasks
```

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
