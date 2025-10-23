#!/bin/bash

# 🔑 API Keys Collection Script - Meauxbility
# This script helps you collect and verify all your API keys

echo "🔑 Meauxbility API Keys Collection Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if key exists
check_key() {
    local key_name="$1"
    local key_value="$2"
    
    if [ -n "$key_value" ] && [ "$key_value" != "your_key_here" ] && [ "$key_value" != "" ]; then
        echo -e "${GREEN}✅ $key_name: CONFIGURED${NC}"
        return 0
    else
        echo -e "${RED}❌ $key_name: MISSING${NC}"
        return 1
    fi
}

# Function to prompt for key
prompt_for_key() {
    local key_name="$1"
    local key_description="$2"
    local key_variable="$3"
    
    echo -e "${YELLOW}🔍 $key_name${NC}"
    echo "   Description: $key_description"
    echo "   Current value: ${!key_variable:-'NOT SET'}"
    echo ""
    read -p "   Enter new value (or press Enter to skip): " new_value
    
    if [ -n "$new_value" ]; then
        echo "   ✅ Updated $key_name"
        return 0
    else
        echo "   ⏭️  Skipped $key_name"
        return 1
    fi
}

echo -e "${BLUE}📋 Checking Current API Keys Status...${NC}"
echo ""

# Check Supabase keys
echo -e "${BLUE}🔵 SUPABASE KEYS:${NC}"
check_key "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL"
check_key "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
check_key "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
echo ""

# Check Render keys
echo -e "${BLUE}🔵 RENDER KEYS:${NC}"
check_key "RENDER_API_KEY" "$RENDER_API_KEY"
echo ""

# Check Anthropic keys
echo -e "${BLUE}🔵 ANTHROPIC CLAUDE KEYS:${NC}"
check_key "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
check_key "CLAUDE_MODEL" "$CLAUDE_MODEL"
echo ""

# Check GitHub keys
echo -e "${BLUE}🔵 GITHUB KEYS:${NC}"
check_key "GITHUB_TOKEN" "$GITHUB_TOKEN"
echo ""

# Check Stripe keys
echo -e "${BLUE}🔵 STRIPE KEYS:${NC}"
check_key "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
check_key "STRIPE_PUBLISHABLE_KEY" "$STRIPE_PUBLISHABLE_KEY"
echo ""

echo -e "${YELLOW}🎯 SUMMARY:${NC}"
echo ""

# Count configured keys
configured_count=0
total_count=0

# Supabase
if check_key "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL"; then ((configured_count++)); fi
if check_key "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"; then ((configured_count++)); fi
if check_key "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"; then ((configured_count++)); fi

# Render
if check_key "RENDER_API_KEY" "$RENDER_API_KEY"; then ((configured_count++)); fi

# Anthropic
if check_key "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"; then ((configured_count++)); fi

# GitHub
if check_key "GITHUB_TOKEN" "$GITHUB_TOKEN"; then ((configured_count++)); fi

# Stripe
if check_key "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"; then ((configured_count++)); fi
if check_key "STRIPE_PUBLISHABLE_KEY" "$STRIPE_PUBLISHABLE_KEY"; then ((configured_count++)); fi

total_count=8

echo -e "${BLUE}📊 CONFIGURATION STATUS:${NC}"
echo "   Configured: $configured_count/$total_count"
echo "   Progress: $((configured_count * 100 / total_count))%"
echo ""

if [ $configured_count -eq $total_count ]; then
    echo -e "${GREEN}🎉 ALL KEYS CONFIGURED! You're ready to go!${NC}"
elif [ $configured_count -ge 6 ]; then
    echo -e "${YELLOW}⚠️  Almost there! Just a few more keys needed.${NC}"
else
    echo -e "${RED}❌ Several keys are missing. Let's get them set up!${NC}"
fi

echo ""
echo -e "${BLUE}🔗 QUICK LINKS:${NC}"
echo "   • Anthropic: https://console.anthropic.com/"
echo "   • GitHub: https://github.com/settings/tokens"
echo "   • Stripe: https://dashboard.stripe.com/apikeys"
echo "   • Google Domains: https://domains.google.com/"
echo ""

echo -e "${YELLOW}💡 TIP: Run this script again after adding keys to check status!${NC}"
