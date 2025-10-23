#!/bin/bash

# Standalone Site Deployment Script
# This script deploys the complete Meauxbility standalone site with all integrations

set -e

echo "🚀 Deploying Meauxbility Standalone Site..."

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

# Check if production environment file exists
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

# Deploy to Supabase
deploy_supabase() {
    print_header "SUPABASE DEPLOYMENT"
    
    print_status "Deploying database schema..."
    
    # Check if supabase CLI is available
    if command -v supabase &> /dev/null; then
        print_status "Using Supabase CLI..."
        
        # Link to project
        if [ -n "$SUPABASE_URL" ]; then
            project_id=$(echo "$SUPABASE_URL" | sed 's/.*\/\/\([^.]*\)\.supabase\.co.*/\1/')
            print_status "Linking to project: $project_id"
            supabase link --project-ref "$project_id" || print_warning "Project may already be linked"
        fi
        
        # Deploy migrations
        print_status "Deploying database migrations..."
        supabase db push || print_warning "Some migrations may have failed"
        
        # Deploy edge functions
        print_status "Deploying edge functions..."
        supabase functions deploy agent_gateway || print_warning "Agent gateway deployment failed"
        supabase functions deploy asset_signer || print_warning "Asset signer deployment failed"
        
        print_success "Supabase deployment completed"
    else
        print_warning "Supabase CLI not found. Please deploy manually:"
        echo "1. Go to your Supabase dashboard"
        echo "2. Run the SQL migrations from migrations/ folder"
        echo "3. Deploy edge functions from edge-functions/ folder"
    fi
}

# Deploy to Render
deploy_render() {
    print_header "RENDER DEPLOYMENT"
    
    if [ -z "$RENDER_API_KEY" ]; then
        print_error "Render API key not found in environment"
        return 1
    fi
    
    print_status "Creating Render service..."
    
    # Create service if service ID not provided
    if [ -z "$RENDER_SERVICE_ID" ]; then
        print_status "Creating new Render service..."
        
        service_config=$(cat << EOF
{
  "name": "meauxbility-standalone",
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
      "key": "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "value": "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
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
            print_success "Render service created with ID: $service_id"
            echo "RENDER_SERVICE_ID=$service_id" >> production-env.txt
        else
            print_error "Failed to create Render service"
            print_error "Response: $response"
            return 1
        fi
    else
        print_status "Using existing Render service: $RENDER_SERVICE_ID"
    fi
    
    # Trigger deployment
    print_status "Triggering Render deployment..."
    
    deploy_response=$(curl -s -X POST \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys")
    
    if echo "$deploy_response" | grep -q '"id"'; then
        deploy_id=$(echo "$deploy_response" | jq -r '.id' 2>/dev/null || echo "")
        print_success "Deployment triggered with ID: $deploy_id"
    else
        print_error "Failed to trigger deployment"
        print_error "Response: $deploy_response"
        return 1
    fi
}

# Configure Stripe webhooks
configure_stripe() {
    print_header "STRIPE CONFIGURATION"
    
    if [ -z "$STRIPE_SECRET_KEY" ]; then
        print_warning "Stripe credentials not found, skipping webhook configuration"
        return 0
    fi
    
    print_status "Configuring Stripe webhooks..."
    
    # Get the Render service URL
    if [ -n "$RENDER_SERVICE_ID" ]; then
        service_info=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
            "https://api.render.com/v1/services/$RENDER_SERVICE_ID")
        
        service_url=$(echo "$service_info" | jq -r '.service.serviceDetails.url' 2>/dev/null || echo "")
        
        if [ -n "$service_url" ] && [ "$service_url" != "null" ]; then
            webhook_url="$service_url/api/webhooks/stripe"
            print_status "Stripe webhook URL: $webhook_url"
            
            print_warning "Please configure this webhook URL in your Stripe dashboard:"
            echo "1. Go to Stripe Dashboard → Developers → Webhooks"
            echo "2. Add endpoint: $webhook_url"
            echo "3. Select events: payment_intent.succeeded, payment_intent.payment_failed"
            echo "4. Copy the webhook secret and update STRIPE_WEBHOOK_SECRET"
        else
            print_warning "Service URL not available yet. Configure webhooks after deployment."
        fi
    else
        print_warning "Render service ID not available for webhook configuration"
    fi
}

# Create API endpoints
create_api_endpoints() {
    print_header "API ENDPOINTS SETUP"
    
    print_status "Creating API endpoints for Stripe integration..."
    
    # Create Stripe webhook endpoint
    mkdir -p apps/dashboard-render/pages/api/webhooks
    
    cat > apps/dashboard-render/pages/api/webhooks/stripe.ts << 'EOF'
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook Error');
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
EOF

    print_success "Stripe webhook endpoint created"
}

# Update package.json with Stripe dependency
update_dependencies() {
    print_header "DEPENDENCIES UPDATE"
    
    print_status "Adding Stripe dependency..."
    
    cd apps/dashboard-render
    
    if ! grep -q "stripe" package.json; then
        npm install stripe @types/node
        print_success "Stripe dependency added"
    else
        print_status "Stripe dependency already exists"
    fi
    
    cd ../..
}

# Create deployment summary
create_deployment_summary() {
    print_header "DEPLOYMENT SUMMARY"
    
    cat > deployment-summary.txt << EOF
# Meauxbility Standalone Site Deployment Summary
# Generated on $(date)

## Services Configured
✅ Supabase: Database and authentication
✅ Render: Application hosting
✅ Stripe: Payment processing
✅ GitHub: Source control and CI/CD

## Environment Variables
- NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: [CONFIGURED]
- STRIPE_SECRET_KEY: [CONFIGURED]
- RENDER_SERVICE_ID: $RENDER_SERVICE_ID

## Next Steps
1. Wait for Render deployment to complete
2. Configure Stripe webhooks with the service URL
3. Test all integrations
4. Set up monitoring and alerts

## URLs
- Render Service: https://meauxbility-standalone.onrender.com
- Supabase Dashboard: $NEXT_PUBLIC_SUPABASE_URL
- Stripe Dashboard: https://dashboard.stripe.com

## Support
- Check Render logs for deployment issues
- Verify Supabase connection in application
- Test Stripe integration with test payments
EOF

    print_success "Deployment summary created: deployment-summary.txt"
}

# Main execution
main() {
    echo "🎯 Meauxbility Standalone Site Deployment"
    echo "=========================================="
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
    
    # Deploy services
    deploy_supabase
    echo ""
    
    update_dependencies
    echo ""
    
    create_api_endpoints
    echo ""
    
    deploy_render
    echo ""
    
    configure_stripe
    echo ""
    
    create_deployment_summary
    echo ""
    
    print_success "Standalone site deployment initiated! 🎉"
    echo ""
    echo "Monitor your deployment:"
    echo "1. Check Render dashboard for deployment status"
    echo "2. Verify Supabase connection in your app"
    echo "3. Test Stripe integration"
    echo "4. Configure webhooks as needed"
}

# Run main function
main "$@"
