#!/bin/bash

# =====================================================================
# MEAUXBILITY SUPABASE ENVIRONMENT SETUP
# =====================================================================
# This script sets up the Supabase environment variables for the project
# Run this script to configure your local development environment

echo "🚀 Setting up Meauxbility Supabase Environment..."

# Project Configuration
PROJECT_ID="ghiulqoqujsiofsjcrqk"
SUPABASE_URL="https://${PROJECT_ID}.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA"

echo "📋 Project Details:"
echo "   Project Name: meauxbility-production"
echo "   Project ID: ${PROJECT_ID}"
echo "   Supabase URL: ${SUPABASE_URL}"

# Create .env file in project root
echo "📝 Creating .env file..."
cat > .env << EOF
# =====================================================================
# MEAUXBILITY ENVIRONMENT VARIABLES
# =====================================================================
# Production Supabase Configuration
# Project: meauxbility-production
# Project ID: ${PROJECT_ID}

# =====================================================================
# SUPABASE CONFIGURATION
# =====================================================================
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here

# Next.js Public Variables (for client-side access)
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}

# =====================================================================
# AI API KEYS
# =====================================================================
# Claude AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key-here

# ChatGPT (OpenAI)
OPENAI_API_KEY=sk-your-openai-key-here

# Team ChatGPT (OpenAI Organization)
TEAM_OPENAI_API_KEY=sk-your-team-openai-key-here

# =====================================================================
# PAYMENT PROCESSING
# =====================================================================
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret-here

# =====================================================================
# EMAIL SERVICES
# =====================================================================
# SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@meauxbility.org
SENDGRID_FROM_NAME=Meauxbility

# =====================================================================
# GOOGLE SERVICES
# =====================================================================
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your-google-oauth-client-id-here
GOOGLE_OAUTH_CLIENT_SECRET=your-google-oauth-client-secret-here

# Google Analytics
GOOGLE_ANALYTICS_ID=G-your-google-analytics-id-here

# =====================================================================
# SHOPIFY (if using)
# =====================================================================
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-shopify-access-token-here
SHOPIFY_WEBHOOK_SECRET=your-shopify-webhook-secret-here

# =====================================================================
# SECURITY
# =====================================================================
# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Encryption Key (generate a random string)
ENCRYPTION_KEY=your-encryption-key-here

# =====================================================================
# DEVELOPMENT
# =====================================================================
# Environment
NODE_ENV=development

# Debug mode
DEBUG=true

# Log level
LOG_LEVEL=info
EOF

# Create .env.local for dashboard-render app
echo "📝 Creating dashboard-render .env.local file..."
cat > apps/dashboard-render/.env.local << EOF
# Dashboard Render App Environment Variables
# Supabase Production Configuration

NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}

# Development settings
NODE_ENV=development
PORT=3000
EOF

echo "✅ Environment setup complete!"
echo ""
echo "📁 Files created:"
echo "   - .env (project root)"
echo "   - apps/dashboard-render/.env.local"
echo ""
echo "🔧 Next steps:"
echo "   1. Update the service role key in .env (get from Supabase dashboard)"
echo "   2. Add your API keys for AI services, Stripe, etc."
echo "   3. Run 'npm install' in apps/dashboard-render/"
echo "   4. Run 'npm run dev' to start the development server"
echo ""
echo "🔒 Security Note:"
echo "   - Never commit .env files to git"
echo "   - Keep your API keys secure"
echo "   - Use different keys for development and production"
