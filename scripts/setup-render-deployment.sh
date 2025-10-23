#!/bin/bash

# Render Deployment Setup Script
# This script helps configure environment variables and webhooks for Render deployment

set -e

echo "🚀 Setting up Render deployment for Meauxbility..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. JSON parsing will be limited."
    fi
    
    print_success "Dependencies check completed"
}

# Function to get user input with default values
get_input() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        eval "$var_name=\${input:-$default}"
    else
        read -p "$prompt: " input
        eval "$var_name=\"$input\""
    fi
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    echo ""
    echo "Please provide the following information:"
    echo ""
    
    get_input "Render Webhook Secret (from step 2)" "" "RENDER_WEBHOOK_SECRET"
    get_input "Render API Key (from step 3)" "" "RENDER_API_KEY"
    get_input "GitHub API Token (from step 4)" "" "GITHUB_API_TOKEN"
    get_input "GitHub Owner Name" "$(git config user.name)" "GITHUB_OWNER_NAME"
    get_input "GitHub Repository Name" "meauxbility" "GITHUB_REPO_NAME"
    get_input "GitHub Workflow ID" "render-deploy.yml" "GITHUB_WORKFLOW_ID"
    get_input "Supabase URL" "" "SUPABASE_URL"
    get_input "Supabase Anon Key" "" "SUPABASE_ANON_KEY"
    
    # Create environment file
    cat > render-env-production.txt << EOF
# Render Deployment Environment Variables
# Generated on $(date)

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Render Webhook Configuration
RENDER_WEBHOOK_SECRET=$RENDER_WEBHOOK_SECRET
RENDER_API_KEY=$RENDER_API_KEY

# GitHub Integration
GITHUB_API_TOKEN=$GITHUB_API_TOKEN
GITHUB_OWNER_NAME=$GITHUB_OWNER_NAME
GITHUB_REPO_NAME=$GITHUB_REPO_NAME
GITHUB_WORKFLOW_ID=$GITHUB_WORKFLOW_ID

# Node Environment
NODE_ENV=production
PORT=3000
EOF
    
    print_success "Environment file created: render-env-production.txt"
}

# Function to test GitHub API connection
test_github_connection() {
    print_status "Testing GitHub API connection..."
    
    if [ -z "$GITHUB_API_TOKEN" ]; then
        print_warning "GitHub API token not provided, skipping test"
        return
    fi
    
    response=$(curl -s -H "Authorization: token $GITHUB_API_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/user")
    
    if echo "$response" | grep -q '"login"'; then
        username=$(echo "$response" | jq -r '.login' 2>/dev/null || echo "unknown")
        print_success "GitHub API connection successful (user: $username)"
    else
        print_error "GitHub API connection failed"
        print_error "Response: $response"
    fi
}

# Function to test Render API connection
test_render_connection() {
    print_status "Testing Render API connection..."
    
    if [ -z "$RENDER_API_KEY" ]; then
        print_warning "Render API key not provided, skipping test"
        return
    fi
    
    response=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services")
    
    if echo "$response" | grep -q '"id"'; then
        print_success "Render API connection successful"
    else
        print_error "Render API connection failed"
        print_error "Response: $response"
    fi
}

# Function to create webhook
create_webhook() {
    print_status "Creating GitHub webhook for Render integration..."
    
    if [ -z "$GITHUB_API_TOKEN" ] || [ -z "$RENDER_WEBHOOK_SECRET" ]; then
        print_warning "Missing required credentials for webhook creation"
        return
    fi
    
    # This would typically be done through GitHub's web interface
    # or via the GitHub API, but requires repository admin access
    print_warning "Webhook creation requires manual setup:"
    echo "1. Go to your GitHub repository settings"
    echo "2. Navigate to Webhooks → Add webhook"
    echo "3. Set Payload URL to your Render webhook URL"
    echo "4. Set Content type to 'application/json'"
    echo "5. Set Secret to: $RENDER_WEBHOOK_SECRET"
    echo "6. Select events: 'Repository dispatch' and 'Workflow runs'"
}

# Main execution
main() {
    echo "🎯 Meauxbility Render Deployment Setup"
    echo "======================================"
    echo ""
    
    check_dependencies
    setup_environment
    
    echo ""
    print_status "Testing API connections..."
    test_github_connection
    test_render_connection
    
    echo ""
    print_status "Next steps:"
    echo "1. Copy environment variables from render-env-production.txt to your Render service"
    echo "2. Set up GitHub webhook as described above"
    echo "3. Test the deployment workflow"
    
    echo ""
    print_success "Setup completed! 🎉"
}

# Run main function
main "$@"
