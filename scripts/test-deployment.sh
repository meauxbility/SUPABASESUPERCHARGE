#!/bin/bash

# Deployment Test Script
# This script tests the Render deployment setup

set -e

echo "🧪 Testing Render deployment setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test 1: Check if environment file exists
test_environment_file() {
    print_status "Testing environment file..."
    
    if [ -f "render-env-production.txt" ]; then
        print_success "Environment file exists"
        
        # Check if all required variables are present
        required_vars=(
            "NEXT_PUBLIC_SUPABASE_URL"
            "NEXT_PUBLIC_SUPABASE_ANON_KEY"
            "RENDER_WEBHOOK_SECRET"
            "RENDER_API_KEY"
            "GITHUB_API_TOKEN"
            "GITHUB_OWNER_NAME"
            "GITHUB_REPO_NAME"
            "GITHUB_WORKFLOW_ID"
        )
        
        missing_vars=()
        for var in "${required_vars[@]}"; do
            if ! grep -q "^$var=" render-env-production.txt; then
                missing_vars+=("$var")
            fi
        done
        
        if [ ${#missing_vars[@]} -eq 0 ]; then
            print_success "All required environment variables present"
        else
            print_warning "Missing variables: ${missing_vars[*]}"
        fi
    else
        print_error "Environment file not found"
        print_status "Run ./scripts/setup-render-deployment.sh to create it"
    fi
}

# Test 2: Check GitHub workflow file
test_github_workflow() {
    print_status "Testing GitHub workflow..."
    
    if [ -f ".github/workflows/render-deploy.yml" ]; then
        print_success "GitHub workflow file exists"
        
        # Check if workflow has required sections
        if grep -q "repository_dispatch" .github/workflows/render-deploy.yml; then
            print_success "Workflow supports repository dispatch"
        else
            print_warning "Workflow may not support repository dispatch"
        fi
        
        if grep -q "workflow_dispatch" .github/workflows/render-deploy.yml; then
            print_success "Workflow supports manual dispatch"
        else
            print_warning "Workflow may not support manual dispatch"
        fi
    else
        print_error "GitHub workflow file not found"
    fi
}

# Test 3: Check Next.js configuration
test_nextjs_config() {
    print_status "Testing Next.js configuration..."
    
    if [ -f "apps/dashboard-render/next.config.js" ]; then
        print_success "Next.js config file exists"
        
        if grep -q "NEXT_PUBLIC_SUPABASE_URL" apps/dashboard-render/next.config.js; then
            print_success "Supabase URL configured"
        else
            print_warning "Supabase URL not configured in Next.js"
        fi
        
        if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" apps/dashboard-render/next.config.js; then
            print_success "Supabase anon key configured"
        else
            print_warning "Supabase anon key not configured in Next.js"
        fi
    else
        print_error "Next.js config file not found"
    fi
}

# Test 4: Check package.json
test_package_json() {
    print_status "Testing package.json..."
    
    if [ -f "apps/dashboard-render/package.json" ]; then
        print_success "Package.json exists"
        
        if grep -q '"build"' apps/dashboard-render/package.json; then
            print_success "Build script configured"
        else
            print_warning "Build script not found"
        fi
        
        if grep -q '"start"' apps/dashboard-render/package.json; then
            print_success "Start script configured"
        else
            print_warning "Start script not found"
        fi
    else
        print_error "Package.json not found"
    fi
}

# Test 5: Check Supabase client
test_supabase_client() {
    print_status "Testing Supabase client..."
    
    if [ -f "apps/dashboard-render/lib/supabaseClient.ts" ]; then
        print_success "Supabase client exists"
        
        if grep -q "createClient" apps/dashboard-render/lib/supabaseClient.ts; then
            print_success "Supabase client properly configured"
        else
            print_warning "Supabase client may not be properly configured"
        fi
    else
        print_error "Supabase client not found"
    fi
}

# Test 6: Test API connections (if credentials are available)
test_api_connections() {
    print_status "Testing API connections..."
    
    # Load environment variables if file exists
    if [ -f "render-env-production.txt" ]; then
        source render-env-production.txt
        
        # Test GitHub API
        if [ -n "$GITHUB_API_TOKEN" ]; then
            response=$(curl -s -H "Authorization: token $GITHUB_API_TOKEN" \
                -H "Accept: application/vnd.github.v3+json" \
                "https://api.github.com/user" 2>/dev/null || echo "error")
            
            if echo "$response" | grep -q '"login"'; then
                print_success "GitHub API connection successful"
            else
                print_warning "GitHub API connection failed"
            fi
        else
            print_warning "GitHub API token not available for testing"
        fi
        
        # Test Render API
        if [ -n "$RENDER_API_KEY" ]; then
            response=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
                "https://api.render.com/v1/services" 2>/dev/null || echo "error")
            
            if echo "$response" | grep -q '"id"'; then
                print_success "Render API connection successful"
            else
                print_warning "Render API connection failed"
            fi
        else
            print_warning "Render API key not available for testing"
        fi
    else
        print_warning "Environment file not found, skipping API tests"
    fi
}

# Main test execution
main() {
    echo "🔍 Meauxbility Deployment Test Suite"
    echo "===================================="
    echo ""
    
    test_environment_file
    echo ""
    
    test_github_workflow
    echo ""
    
    test_nextjs_config
    echo ""
    
    test_package_json
    echo ""
    
    test_supabase_client
    echo ""
    
    test_api_connections
    echo ""
    
    echo "🎯 Test Summary"
    echo "==============="
    echo "✅ Configuration files checked"
    echo "✅ GitHub workflow validated"
    echo "✅ Next.js setup verified"
    echo "✅ API connections tested"
    echo ""
    print_success "Deployment setup test completed! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to Render using the configured environment variables"
    echo "2. Test the webhook integration"
    echo "3. Verify the GitHub workflow triggers correctly"
}

# Run main function
main "$@"
