#!/bin/bash

# 🚀 MEAUXBILITY AI AGENTS SETUP
# The most powerful AI development environment

echo "🚀 Setting up Claude Supabase Supercharge AI Agents..."

# Create ai-agents directory if it doesn't exist
mkdir -p ai-agents

# Navigate to ai-agents directory
cd ai-agents

# Install dependencies
echo "📦 Installing AI agent dependencies..."
npm install

# Make the main script executable
chmod +x claude-supercharge.js

# Create symlinks for easy access
echo "🔗 Creating command shortcuts..."
sudo ln -sf "$(pwd)/claude-supercharge.js" /usr/local/bin/claude
sudo ln -sf "$(pwd)/claude-supercharge.js" /usr/local/bin/ai

# Set up environment
echo "⚙️ Setting up environment variables..."
if [ ! -f .env ]; then
    cp ../SUPABASESUPERCHARGE.env .env
    echo "✅ Environment file created"
else
    echo "⚠️ Environment file already exists"
fi

# Test the installation
echo "🧪 Testing AI agent installation..."
node claude-supercharge.js help

echo ""
echo "🎉 CLAUDE SUPABASE SUPERCHARGE SETUP COMPLETE!"
echo ""
echo "🚀 POWERFUL AI COMMANDS AVAILABLE:"
echo ""
echo "📋 ANALYSIS & OPTIMIZATION:"
echo "  claude analyze <file>           - Deep code analysis"
echo "  claude optimize <file>          - Performance optimization"
echo "  claude refactor <file> <goals>   - Intelligent refactoring"
echo ""
echo "🛠️ DEVELOPMENT:"
echo "  claude generate <description>   - AI code generation"
echo "  claude debug <issue>           - Advanced debugging"
echo "  claude test <file>             - Generate tests"
echo "  claude migrate <html>           - Shopify to Next.js migration"
echo ""
echo "🚀 DEPLOYMENT:"
echo "  claude deploy <platform>       - Deployment assistance"
echo "  claude supabase <task>         - Supabase integration"
echo "  claude status                  - Project status"
echo ""
echo "💡 EXAMPLES:"
echo "  claude analyze apps/dashboard-render/pages/index.tsx"
echo "  claude generate \"contact form with Supabase integration\""
echo "  claude migrate \"<html>...</html>\" \"contact page\""
echo "  claude supabase \"add user authentication\""
echo "  claude deploy render"
echo ""
echo "🔧 NEXT STEPS:"
echo "1. Add your ANTHROPIC_API_KEY to ai-agents/.env"
echo "2. Add your GitHub token for AI_AGENT_ACCESS_TOKEN"
echo "3. Start using the AI commands!"
echo ""
echo "🎯 Ready to supercharge your development! 🚀"
