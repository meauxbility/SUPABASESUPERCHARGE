# 🚀 Meauxbility Repository Setup Guide

Welcome to the Meauxbility private development repository! This guide will help you set up your development environment and connect with your team.

## 📋 Prerequisites

Before starting, ensure you have:
- **Git** installed and configured
- **Node.js** (v18 or higher)
- **GitHub account** with access to the repository
- **Notion account** for team collaboration
- **Code editor** (VS Code recommended)

## 🔧 Initial Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/meauxbility.git
cd meauxbility
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your actual values
nano .env
```

**Required Environment Variables:**
- `NOTION_API_KEY`: Your Notion integration API key
- `NOTION_DATABASE_ID`: Your Notion database ID
- `NOTION_PAGE_ID`: Your Notion page ID
- `GITHUB_TOKEN`: Your GitHub personal access token
- `AI_AGENT_ACCESS_TOKEN`: Token for AI agent access

### 4. Set Up Git Hooks
```bash
# Git hooks are already configured
# Test them by making a commit
git add .
git commit -m "feat: initial setup"
```

## 🔐 Security Configuration

### 1. Run Security Scan
```bash
npm run security:scan
```

### 2. Check for Secrets
```bash
# The pre-commit hook will automatically check for secrets
# Manual check:
grep -r "password\|secret\|key\|token" --exclude-dir=.git --exclude-dir=node_modules .
```

### 3. Verify Access Control
```bash
# Check your access level
git config user.name
git config user.email
```

## 🤝 Team Collaboration

### 1. Notion Integration
```bash
# Test Notion sync
npm run notion:sync
```

### 2. Team Communication
- Use Notion for project documentation
- GitHub Issues for bug tracking
- Pull requests for code review
- Team chat for real-time communication

### 3. AI Agent Coordination
- AI agents have limited access to specific directories
- All AI actions are logged and monitored
- Regular permission reviews are conducted

## 🔄 Development Workflow

### 1. Branch Strategy
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create pull request
git push origin feature/your-feature-name
```

### 2. Code Quality
- Pre-commit hooks ensure code quality
- Automated testing on all changes
- Security scanning integrated
- Code review required for main branches

### 3. Deployment
```bash
# Build project
npm run build

# Run tests
npm test

# Security scan
npm run security:scan
```

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run test suite |
| `npm run lint` | Run code linter |
| `npm run lint:fix` | Fix linting issues |
| `npm run security:scan` | Run security scan |
| `npm run notion:sync` | Sync with Notion |
| `npm run pre-commit` | Run pre-commit checks |
| `npm run pre-push` | Run pre-push checks |

## 🛠️ Troubleshooting

### Common Issues

**1. Git Hooks Not Working**
```bash
# Check if hooks are executable
ls -la hooks/
chmod +x hooks/*

# Verify git configuration
git config core.hooksPath
```

**2. Environment Variables Not Loading**
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
echo $NOTION_API_KEY
```

**3. Security Scan Fails**
```bash
# Run security scan manually
node scripts/security-scan.js

# Check for secrets
grep -r "password\|secret" --exclude-dir=.git .
```

**4. Notion Sync Issues**
```bash
# Test Notion connection
node scripts/notion-sync.js

# Check API key
echo $NOTION_API_KEY
```

### Getting Help

1. **Check Documentation**: Review all `.md` files in the repository
2. **Team Support**: Contact team members through Notion
3. **AI Agent Help**: AI agents can assist with code issues
4. **GitHub Issues**: Create issues for bugs or feature requests

## 🎯 Next Steps

1. **Complete Setup**: Follow all steps in this guide
2. **Team Onboarding**: Review collaboration guidelines with your team
3. **First Contribution**: Make your first commit and pull request
4. **Notion Integration**: Set up your Notion workspace
5. **Security Review**: Complete security configuration

## 📞 Support

For technical support or questions:
- **Repository Issues**: Create GitHub issues
- **Team Communication**: Use Notion workspace
- **Emergency Contact**: Direct message team members
- **AI Agent Support**: AI agents are available for assistance

---

**Remember**: This project emphasizes the power of hard work, willpower, inspiration, community, and faith in development. Together, we build something meaningful! 🚀
