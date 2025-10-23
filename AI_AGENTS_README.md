# 🤖 Claude Supabase Supercharge - AI Development Agents

The most powerful AI development system for Meauxbility, integrating Claude AI with your entire development workflow.

## 🚀 Quick Setup

```bash
# Run the setup script
chmod +x scripts/setup-ai-agents.sh
./scripts/setup-ai-agents.sh

# Or manually install
cd ai-agents
npm install
chmod +x claude-supercharge.js
```

## 🔧 Environment Setup

Add these to your `.env` file:

```bash
# Claude AI Configuration
ANTHROPIC_API_KEY=sk-ant-your-key-here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4096

# AI Agent Configuration  
AI_AGENT_ACCESS_TOKEN=your_github_token_here
AI_AGENT_PERMISSIONS=repo,workflow,admin
AI_AGENT_REPO=meauxbility/SUPABASESUPERCHARGE
AI_AGENT_BRANCH=main
```

## 🎯 POWER COMMANDS

### 📋 Analysis & Optimization

```bash
# Deep code analysis with optimization suggestions
claude analyze apps/dashboard-render/pages/index.tsx

# Performance optimization for Core Web Vitals
claude optimize apps/dashboard-render/pages/admin.tsx

# Intelligent refactoring with specific goals
claude refactor apps/dashboard-render/components/Layout.tsx "improve performance,add types,optimize bundle"
```

### 🛠️ Development

```bash
# AI-powered code generation
claude generate "contact form with Supabase integration and validation"

# Advanced debugging assistance
claude debug "Supabase connection failing in production" "error logs here"

# Generate comprehensive tests
claude test apps/dashboard-render/pages/index.tsx unit
claude test apps/dashboard-render/pages/admin.tsx integration
```

### 🔄 Migration & Integration

```bash
# Migrate Shopify content to Next.js
claude migrate "<html>...</html>" "contact page"

# Supabase integration assistance
claude supabase "add user authentication with RLS policies"
claude supabase "create donation tracking system"
claude supabase "implement file upload with asset-signer"
```

### 🚀 Deployment

```bash
# Smart deployment assistance
claude deploy render
claude deploy vercel
claude deploy netlify

# Project status and health check
claude status
```

## 💡 Real-World Examples

### 1. Analyze Your Landing Page
```bash
claude analyze apps/dashboard-render/pages/index.tsx
```
**Output:** Performance optimizations, SEO improvements, accessibility fixes, and Supabase integration suggestions.

### 2. Generate a Contact Form
```bash
claude generate "contact form with Supabase integration, email validation, and success/error handling"
```
**Output:** Complete React component with TypeScript, Supabase integration, and proper error handling.

### 3. Migrate Shopify Content
```bash
claude migrate "<div class='contact-form'>...</div>" "contact page"
```
**Output:** Converted React component with Supabase backend, responsive design, and accessibility compliance.

### 4. Debug Supabase Issues
```bash
claude debug "RLS policies blocking user access" "Error: new row violates row-level security policy"
```
**Output:** Root cause analysis, RLS policy fixes, and prevention strategies.

### 5. Optimize Performance
```bash
claude optimize apps/dashboard-render/pages/index.tsx
```
**Output:** Bundle size reduction, lazy loading implementation, and Core Web Vitals improvements.

## 🤖 GitHub Actions Integration

The AI system automatically runs on:
- **Push to main/develop** - Analyzes changed files
- **Pull requests** - Generates optimization suggestions
- **Manual triggers** - Run specific AI commands

### Manual AI Commands via GitHub
1. Go to **Actions** → **AI-Powered Development**
2. Click **Run workflow**
3. Choose your AI command and target file
4. Get AI analysis results as artifacts

## 🎯 Advanced Usage

### Custom AI Prompts
```bash
# Analyze specific aspects
claude analyze apps/dashboard-render/pages/index.tsx --focus="performance,accessibility"

# Generate with specific requirements
claude generate "user dashboard" --requirements="TypeScript,Supabase,responsive,accessible"

# Debug with context
claude debug "deployment failing" --context="Render,Node.js,Next.js"
```

### Batch Operations
```bash
# Analyze all pages
find apps/dashboard-render/pages -name "*.tsx" -exec claude analyze {} \;

# Generate tests for all components
find apps/dashboard-render/components -name "*.tsx" -exec claude test {} unit \;

# Optimize all pages
find apps/dashboard-render/pages -name "*.tsx" -exec claude optimize {} \;
```

## 🔧 Configuration

### Claude Model Settings
```bash
# Use different Claude models
export CLAUDE_MODEL=claude-3-5-sonnet-20241022  # Most capable
export CLAUDE_MODEL=claude-3-haiku-20240307    # Fastest
export CLAUDE_MODEL=claude-3-opus-20240229     # Most creative
```

### Custom Prompts
Edit `ai-agents/claude-supercharge.js` to customize prompts for your specific needs.

## 📊 AI Analysis Outputs

The AI system provides:
- **Code Quality Scores** - Performance, security, maintainability
- **Optimization Suggestions** - Specific improvements with code examples
- **Security Analysis** - Vulnerability detection and fixes
- **Accessibility Audits** - WCAG compliance recommendations
- **Performance Metrics** - Core Web Vitals optimization
- **Best Practices** - Next.js, TypeScript, Supabase recommendations

## 🚀 Integration with Your Workflow

### VS Code Integration
```bash
# Add to your VS Code tasks.json
{
  "label": "AI Analyze Current File",
  "command": "claude",
  "args": ["analyze", "${file}"],
  "group": "build"
}
```

### Pre-commit Hooks
```bash
# Add to .git/hooks/pre-commit
#!/bin/bash
claude analyze $(git diff --cached --name-only | grep -E '\.(ts|tsx)$')
```

### CI/CD Integration
The GitHub Actions workflow automatically:
- Analyzes changed files on every push
- Generates optimization suggestions
- Creates performance reports
- Provides deployment assistance

## 🎯 Best Practices

1. **Run analysis before commits** - Catch issues early
2. **Use AI for complex migrations** - Shopify to Next.js conversion
3. **Generate tests for new features** - Ensure code quality
4. **Optimize before deployment** - Performance and SEO
5. **Use AI for debugging** - Faster problem resolution

## 🔧 Troubleshooting

### Common Issues
```bash
# Check AI agent status
claude status

# Test Claude API connection
claude analyze apps/dashboard-render/pages/index.tsx

# Verify environment variables
echo $ANTHROPIC_API_KEY
```

### Performance Tips
- Use specific file paths for faster analysis
- Run analysis on changed files only
- Use batch operations for multiple files
- Cache results for repeated analysis

## 🎉 Success Metrics

Track your AI-powered development:
- **Code Quality** - Improved scores over time
- **Performance** - Core Web Vitals improvements
- **Security** - Reduced vulnerabilities
- **Accessibility** - WCAG compliance
- **Development Speed** - Faster feature delivery

## 🚀 Ready to Supercharge Your Development!

Your AI agents are now ready to:
- ✅ **Analyze** your code for improvements
- ✅ **Generate** new features with AI
- ✅ **Debug** issues faster than ever
- ✅ **Optimize** performance automatically
- ✅ **Migrate** content from Shopify
- ✅ **Deploy** with confidence

**Start with:** `claude help` to see all available commands! 🎯
