#!/bin/bash

# Deploy to meauxbility.com - Live Domain Setup
# This script configures your live domain with Render and Supabase

set -e

echo "🌐 Deploying to meauxbility.com..."

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
    echo -e "${BLUE}[DEPLOY]${NC} $1"
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

# Check if production environment exists
check_environment() {
    print_status "Checking environment configuration..."
    
    if [ ! -f "production-env.txt" ]; then
        print_error "Production environment file not found"
        print_status "Please run ./scripts/collect-service-credentials.sh first"
        exit 1
    fi
    
    print_success "Environment file found"
    source production-env.txt
}

# Create Render service for meauxbility.com
create_render_service() {
    print_header "RENDER SERVICE SETUP"
    
    if [ -z "$RENDER_API_KEY" ]; then
        print_error "Render API key not found in environment"
        return 1
    fi
    
    print_status "Creating Render service for meauxbility.com..."
    
    # Service configuration for meauxbility.com
    service_config=$(cat << EOF
{
  "name": "meauxbility-com",
  "type": "web_service",
  "repo": "https://github.com/$GITHUB_OWNER/$GITHUB_REPO",
  "branch": "main",
  "rootDir": "apps/dashboard-render",
  "buildCommand": "npm install && npm run build",
  "startCommand": "npm start",
  "plan": "starter",
  "region": "oregon",
  "envVars": [
    {
      "key": "NODE_ENV",
      "value": "production"
    },
    {
      "key": "NEXT_PUBLIC_SUPABASE_URL",
      "value": "$NEXT_PUBLIC_SUPABASE_URL"
    },
    {
      "key": "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "value": "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
    },
    {
      "key": "STRIPE_SECRET_KEY",
      "value": "$STRIPE_SECRET_KEY"
    },
    {
      "key": "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "value": "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    },
    {
      "key": "STRIPE_WEBHOOK_SECRET",
      "value": "$STRIPE_WEBHOOK_SECRET"
    },
    {
      "key": "NEXT_PUBLIC_APP_URL",
      "value": "https://meauxbility.com"
    }
  ]
}
EOF
        )
    
    response=$(curl -s -X POST \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$service_config" \
        "https://api.render.com/v1/services")
    
    if echo "$response" | grep -q '"id"'; then
        service_id=$(echo "$response" | jq -r '.id' 2>/dev/null || echo "")
        service_url=$(echo "$response" | jq -r '.service.serviceDetails.url' 2>/dev/null || echo "")
        
        print_success "Render service created:"
        echo "  Service ID: $service_id"
        echo "  Service URL: $service_url"
        
        # Update environment file with service ID
        echo "RENDER_SERVICE_ID=$service_id" >> production-env.txt
        echo "RENDER_SERVICE_URL=$service_url" >> production-env.txt
        
        return 0
    else
        print_error "Failed to create Render service"
        print_error "Response: $response"
        return 1
    fi
}

# Configure custom domain
configure_custom_domain() {
    print_header "CUSTOM DOMAIN CONFIGURATION"
    
    if [ -z "$RENDER_SERVICE_ID" ]; then
        print_warning "Render service ID not available for domain configuration"
        return 0
    fi
    
    print_status "Configuring custom domain: meauxbility.com"
    
    # Add custom domain to Render service
    domain_config=$(cat << EOF
{
  "name": "meauxbility.com"
}
EOF
        )
    
    response=$(curl -s -X POST \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$domain_config" \
        "https://api.render.com/v1/services/$RENDER_SERVICE_ID/custom-domains")
    
    if echo "$response" | grep -q '"id"'; then
        print_success "Custom domain added to Render service"
        print_status "DNS configuration needed:"
        echo "1. Go to your domain registrar (where you bought meauxbility.com)"
        echo "2. Add a CNAME record:"
        echo "   Name: @"
        echo "   Value: $RENDER_SERVICE_URL"
        echo "3. Add a CNAME record for www:"
        echo "   Name: www"
        echo "   Value: $RENDER_SERVICE_URL"
    else
        print_warning "Custom domain configuration may need manual setup"
        print_status "In Render dashboard:"
        echo "1. Go to your service settings"
        echo "2. Add custom domain: meauxbility.com"
        echo "3. Follow DNS configuration instructions"
    fi
}

# Update Supabase configuration for live domain
configure_supabase_live() {
    print_header "SUPABASE LIVE CONFIGURATION"
    
    print_status "Configuring Supabase for meauxbility.com..."
    
    print_warning "Manual Supabase configuration needed:"
    echo "1. Go to your Supabase dashboard"
    echo "2. Navigate to Authentication → URL Configuration"
    echo "3. Add these URLs:"
    echo "   Site URL: https://meauxbility.com"
    echo "   Redirect URLs:"
    echo "     - https://meauxbility.com/app"
    echo "     - https://meauxbility.com/auth/callback"
    echo "4. Save the configuration"
    
    print_status "Supabase RLS policies should already be configured from your schema"
}

# Deploy the application
deploy_application() {
    print_header "APPLICATION DEPLOYMENT"
    
    if [ -z "$RENDER_SERVICE_ID" ]; then
        print_error "Render service ID not available for deployment"
        return 1
    fi
    
    print_status "Triggering deployment..."
    
    deploy_response=$(curl -s -X POST \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys")
    
    if echo "$deploy_response" | grep -q '"id"'; then
        deploy_id=$(echo "$deploy_response" | jq -r '.id' 2>/dev/null || echo "")
        print_success "Deployment triggered with ID: $deploy_id"
        
        print_status "Monitor deployment at:"
        echo "https://dashboard.render.com/services/$RENDER_SERVICE_ID"
    else
        print_error "Failed to trigger deployment"
        print_error "Response: $deploy_response"
        return 1
    fi
}

# Create deployment summary
create_deployment_summary() {
    print_header "DEPLOYMENT SUMMARY"
    
    cat > meauxbility-com-deployment.txt << EOF
# Meauxbility.com Deployment Summary
# Generated on $(date)

## Domain Configuration
- Primary Domain: https://meauxbility.com
- Service URL: $RENDER_SERVICE_URL
- Service ID: $RENDER_SERVICE_ID

## Environment Variables
- NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: [CONFIGURED]
- STRIPE_SECRET_KEY: [CONFIGURED]
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: [CONFIGURED]

## Next Steps
1. Configure DNS records for meauxbility.com
2. Update Supabase authentication URLs
3. Test the live application
4. Configure Stripe webhooks with live URL

## URLs
- Live Site: https://meauxbility.com
- Render Service: $RENDER_SERVICE_URL
- Supabase Dashboard: $NEXT_PUBLIC_SUPABASE_URL
- Stripe Dashboard: https://dashboard.stripe.com

## DNS Configuration Required
Add these CNAME records to your domain registrar:
- @ → $RENDER_SERVICE_URL
- www → $RENDER_SERVICE_URL

## Supabase Configuration Required
Add these URLs to Supabase Authentication:
- Site URL: https://meauxbility.com
- Redirect URLs:
  - https://meauxbility.com/app
  - https://meauxbility.com/auth/callback
EOF

    print_success "Deployment summary created: meauxbility-com-deployment.txt"
}

# Main execution
main() {
    echo "🌐 Meauxbility.com Live Deployment"
    echo "=================================="
    echo ""
    
    # Check dependencies
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. JSON parsing will be limited."
    fi
    
    # Check environment
    check_environment
    
    # Deploy to Render
    create_render_service
    echo ""
    
    configure_custom_domain
    echo ""
    
    configure_supabase_live
    echo ""
    
    deploy_application
    echo ""
    
    create_deployment_summary
    echo ""
    
    print_success "Meauxbility.com deployment initiated! 🎉"
    echo ""
    print_status "Next steps:"
    echo "1. Configure DNS records for meauxbility.com"
    echo "2. Update Supabase authentication URLs"
    echo "3. Test your live application"
    echo "4. Configure Stripe webhooks"
    echo ""
    print_warning "Your site will be live at https://meauxbility.com once DNS propagates!"
}

# Run main function
main "$@"
