# Meauxbility - Spartans Team

> **Private Repository** - Access restricted to assigned team members and AI agents

## 🚀 Project Overview

Meauxbility is a private development project focused on building innovative solutions with a strong emphasis on community, hard work, and faith-driven development.

## 👥 Spartans Team
- **Sam Primeaux** - CEO
- **Connor Mcneely** - CTO  
- **Fred Williams** - CMO

## 🔐 Access Control

This repository is private and accessible only to:
- **Core Team Members**: Spartans team members
- **AI Agents**: Approved AI assistants with specific access permissions
- **Notion Integration**: Automated documentation and task management

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18+)
- Git
- GitHub CLI (optional but recommended)
- Notion account for team collaboration

### Quick Start
```bash
# Clone the repository
git clone https://github.com/InnerAnimal/spartans.git

# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Run development server
npm run dev
```

## 📋 Team Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature development
- `hotfix/*` - Critical production fixes

### Code Quality
- Pre-commit hooks ensure code quality
- Automated testing on all pull requests
- Security scanning integrated
- Code review required for main branches

## 🔗 Notion Integration

Our Notion workspace provides:
- Project documentation
- Task management
- Team collaboration
- AI agent coordination

## 🤖 AI Agent Access

AI agents have limited access to:
- Code review and suggestions
- Automated testing
- Documentation updates
- Security scanning

## 📞 Support

For access issues or questions, contact the repository administrators.

---

**Note**: This project emphasizes the power of hard work, willpower, inspiration, community, and faith in development.

---

### macOS Keychain Helper (Safe Secrets)

Use scripts/keychain.sh to store and read secrets without writing files:

```
# Save a secret
scripts/keychain.sh set ANTHROPIC_API_KEY "sk-ant-..."

# Load into env (current shell)
export ANTHROPIC_API_KEY="$(scripts/keychain.sh get ANTHROPIC_API_KEY)"
```

Keep runtime values in .env.local (git-ignored). Never commit secrets.
