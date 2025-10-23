#!/bin/bash

# =====================================================================
# MEAUXBILITY RENDER DEPLOYMENT SCRIPT
# =====================================================================
# This script deploys the Next.js dashboard to Render

echo "🚀 Deploying Meauxbility Dashboard to Render..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    curl -fsSL https://cli.render.com/install | sh
    echo "✅ Render CLI installed. Please restart your terminal and run this script again."
    exit 1
fi

# Check if user is logged in to Render
if ! render auth whoami &> /dev/null; then
    echo "🔐 Please log in to Render first:"
    echo "   render auth login"
    exit 1
fi

echo "📋 Deployment Configuration:"
echo "   Repository: meauxbility/SUPABASESUPERCHARGE"
echo "   Branch: main"
echo "   Root Directory: apps/dashboard-render"
echo "   Framework: Next.js 14.2.6"
echo ""

# Deploy using render.yaml
echo "🚀 Starting deployment..."
render services create --file render.yaml

echo "✅ Deployment initiated!"
echo ""
echo "📝 Next Steps:"
echo "1. Go to your Render dashboard"
echo "2. Find your new service: meauxbility-app"
echo "3. Configure environment variables:"
echo "   - NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
echo "   - Add other required secrets"
echo "4. Your app will be available at: https://meauxbility-app.onrender.com"
echo ""
echo "🔧 Environment Variables to Configure:"
echo "   Required:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "   Optional (for full functionality):"
echo "   - STRIPE_PUBLISHABLE_KEY"
echo "   - STRIPE_SECRET_KEY"
echo "   - ANTHROPIC_API_KEY"
echo "   - OPENAI_API_KEY"
echo "   - GITHUB_TOKEN"
echo "   - NOTION_API_KEY"
