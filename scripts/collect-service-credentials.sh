#!/bin/bash

# Service Credentials Collection Script
# This script helps collect and verify all service credentials for the standalone site

set -e

echo "🔐 Collecting Service Credentials for Meauxbility Standalone Site..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to get user input with validation
get_input() {
    local prompt="$1"
    local var_name="$2"
    local validation_func="$3"
    local default="$4"
    
    while true; do
        if [ -n "$default" ]; then
            read -p "$prompt [$default]: " input
            eval "$var_name=\${input:-$default}"
        else
            read -p "$prompt: " input
            eval "$var_name=\"$input\""
        fi
        
        if [ -n "$validation_func" ] && $validation_func "${!var_name}"; then
            break
        elif [ -z "$validation_func" ]; then
            break
        else
            print_error "Invalid input. Please try again."
        fi
    done
}

# Validation functions
validate_url() {
    [[ "$1" =~ ^https?:// ]]
}

validate_key() {
    [[ ${#1} -ge 20 ]]
}

validate_email() {
    [[ "$1" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]
}

# Test API connections
test_supabase_connection() {
    local url="$1"
    local key="$2"
    
    print_status "Testing Supabase connection..."
    
    response=$(curl -s -H "apikey: $key" -H "Authorization: Bearer $key" \
        "$url/rest/v1/" 2>/dev/null || echo "error")
    
    if echo "$response" | grep -q "postgrest"; then
        print_success "Supabase connection successful"
        return 0
    else
        print_error "Supabase connection failed"
        return 1
    fi
}

test_render_connection() {
    local api_key="$1"
    
    print_status "Testing Render API connection..."
    
    response=$(curl -s -H "Authorization: Bearer $api_key" \
        "https://api.render.com/v1/services" 2>/dev/null || echo "error")
    
    if echo "$response" | grep -q '"id"'; then
        print_success "Render API connection successful"
        return 0
    else
        print_error "Render API connection failed"
        return 1
    fi
}

test_stripe_connection() {
    local secret_key="$1"
    
    print_status "Testing Stripe connection..."
    
    response=$(curl -s -u "$secret_key:" \
        "https://api.stripe.com/v1/account" 2>/dev/null || echo "error")
    
    if echo "$response" | grep -q '"id"'; then
        print_success "Stripe connection successful"
        return 0
    else
        print_error "Stripe connection failed"
        return 1
    fi
}

# Collect Supabase credentials
collect_supabase_credentials() {
    print_header "SUPABASE CONFIGURATION"
    
    echo "Please provide your Supabase project details:"
    echo ""
    
    get_input "Supabase Project URL (https://xxx.supabase.co)" "SUPABASE_URL" "validate_url"
    get_input "Supabase Anon Key" "SUPABASE_ANON_KEY" "validate_key"
    get_input "Supabase Service Role Key (optional, for admin operations)" "SUPABASE_SERVICE_KEY" ""
    
    echo ""
    print_status "Testing Supabase connection..."
    
    if test_supabase_connection "$SUPABASE_URL" "$SUPABASE_ANON_KEY"; then
        print_success "Supabase credentials verified ✅"
    else
        print_error "Supabase connection failed ❌"
        print_warning "Please check your URL and API key"
    fi
}

# Collect Render credentials
collect_render_credentials() {
    print_header "RENDER CONFIGURATION"
    
    echo "Please provide your Render service details:"
    echo ""
    
    get_input "Render API Key" "RENDER_API_KEY" "validate_key"
    get_input "Render Service ID (optional, will be created if not provided)" "RENDER_SERVICE_ID" ""
    get_input "Render Webhook Secret (for GitHub integration)" "RENDER_WEBHOOK_SECRET" ""
    
    echo ""
    print_status "Testing Render API connection..."
    
    if test_render_connection "$RENDER_API_KEY"; then
        print_success "Render API connection verified ✅"
    else
        print_error "Render API connection failed ❌"
        print_warning "Please check your API key"
    fi
}

# Collect Stripe credentials
collect_stripe_credentials() {
    print_header "STRIPE CONFIGURATION"
    
    echo "Please provide your Stripe account details:"
    echo ""
    
    get_input "Stripe Secret Key (sk_live_... or sk_test_...)" "STRIPE_SECRET_KEY" "validate_key"
    get_input "Stripe Publishable Key (pk_live_... or pk_test_...)" "STRIPE_PUBLISHABLE_KEY" "validate_key"
    get_input "Stripe Webhook Secret (whsec_...)" "STRIPE_WEBHOOK_SECRET" ""
    get_input "Stripe Account ID (optional)" "STRIPE_ACCOUNT_ID" ""
    
    echo ""
    print_status "Testing Stripe connection..."
    
    if test_stripe_connection "$STRIPE_SECRET_KEY"; then
        print_success "Stripe connection verified ✅"
    else
        print_error "Stripe connection failed ❌"
        print_warning "Please check your secret key"
    fi
}

# Collect GitHub credentials
collect_github_credentials() {
    print_header "GITHUB CONFIGURATION"
    
    echo "Please provide your GitHub integration details:"
    echo ""
    
    get_input "GitHub Personal Access Token" "GITHUB_TOKEN" "validate_key"
    get_input "GitHub Repository Owner" "GITHUB_OWNER" ""
    get_input "GitHub Repository Name" "GITHUB_REPO" "meauxbility"
    
    echo ""
    print_status "Testing GitHub connection..."
    
    response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/user" 2>/dev/null || echo "error")
    
    if echo "$response" | grep -q '"login"'; then
        username=$(echo "$response" | jq -r '.login' 2>/dev/null || echo "unknown")
        print_success "GitHub connection verified ✅ (user: $username)"
    else
        print_error "GitHub connection failed ❌"
        print_warning "Please check your personal access token"
    fi
}

# Create production environment file
create_production_env() {
    print_header "CREATING PRODUCTION ENVIRONMENT"
    
    cat > production-env.txt << EOF
# Meauxbility Production Environment Variables
# Generated on $(date)
# ⚠️  KEEP THIS FILE SECURE - DO NOT COMMIT TO GIT

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY

# Render Configuration
RENDER_API_KEY=$RENDER_API_KEY
RENDER_SERVICE_ID=$RENDER_SERVICE_ID
RENDER_WEBHOOK_SECRET=$RENDER_WEBHOOK_SECRET

# Stripe Configuration
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
STRIPE_ACCOUNT_ID=$STRIPE_ACCOUNT_ID

# GitHub Configuration
GITHUB_TOKEN=$GITHUB_TOKEN
GITHUB_OWNER=$GITHUB_OWNER
GITHUB_REPO=$GITHUB_REPO

# Application Configuration
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
EOF
    
    print_success "Production environment file created: production-env.txt"
    print_warning "⚠️  Keep this file secure and do not commit it to git!"
}

# Create GitHub secrets file
create_github_secrets() {
    print_header "GITHUB SECRETS CONFIGURATION"
    
    cat > github-secrets.txt << EOF
# GitHub Repository Secrets
# Add these to your repository: Settings → Secrets and variables → Actions

# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY

# Render
RENDER_API_KEY=$RENDER_API_KEY
RENDER_SERVICE_ID=$RENDER_SERVICE_ID
RENDER_WEBHOOK_SECRET=$RENDER_WEBHOOK_SECRET

# Stripe
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
STRIPE_ACCOUNT_ID=$STRIPE_ACCOUNT_ID

# GitHub
GITHUB_TOKEN=$GITHUB_TOKEN
GITHUB_OWNER=$GITHUB_OWNER
GITHUB_REPO=$GITHUB_REPO
EOF
    
    print_success "GitHub secrets file created: github-secrets.txt"
    print_status "Add these secrets to your GitHub repository settings"
}

# Main execution
main() {
    echo "🎯 Meauxbility Service Credentials Collection"
    echo "============================================="
    echo ""
    echo "This script will help you collect and verify all service credentials"
    echo "needed for your standalone Meauxbility site."
    echo ""
    
    # Check dependencies
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. JSON parsing will be limited."
    fi
    
    # Collect all credentials
    collect_supabase_credentials
    echo ""
    
    collect_render_credentials
    echo ""
    
    collect_stripe_credentials
    echo ""
    
    collect_github_credentials
    echo ""
    
    # Create configuration files
    create_production_env
    echo ""
    
    create_github_secrets
    echo ""
    
    print_header "NEXT STEPS"
    echo "1. Copy environment variables from production-env.txt to your Render service"
    echo "2. Add GitHub secrets from github-secrets.txt to your repository"
    echo "3. Configure Stripe webhooks in your Stripe dashboard"
    echo "4. Run the deployment script to deploy your standalone site"
    echo ""
    print_success "Credential collection completed! 🎉"
}

# Run main function
main "$@"
