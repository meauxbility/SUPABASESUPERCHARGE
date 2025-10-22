#!/bin/bash
# =====================================================================
# SECURE SUPABASE KEY STORAGE SETUP
# =====================================================================
# Purpose: Securely store and manage Supabase API keys
# Usage: ./scripts/secure-key-storage.sh
# =====================================================================

echo "🔐 Setting up secure Supabase key storage for Meauxbility..."
echo ""

# =====================================================================
# METHOD 1: macOS KEYCHAIN (RECOMMENDED FOR LOCAL)
# =====================================================================

echo "📱 METHOD 1: macOS Keychain Storage"
echo "=================================="
echo ""

# Function to store key in macOS Keychain
store_keychain_key() {
    local key_name="$1"
    local key_value="$2"
    local service="Meauxbility-Supabase"
    
    echo "Storing $key_name in macOS Keychain..."
    
    # Delete existing key if it exists
    security delete-generic-password -s "$service" -a "$key_name" 2>/dev/null
    
    # Store the new key
    security add-generic-password -s "$service" -a "$key_name" -w "$key_value"
    
    if [ $? -eq 0 ]; then
        echo "✅ $key_name stored successfully in Keychain"
    else
        echo "❌ Failed to store $key_name in Keychain"
    fi
}

# Function to retrieve key from macOS Keychain
get_keychain_key() {
    local key_name="$1"
    local service="Meauxbility-Supabase"
    
    security find-generic-password -s "$service" -a "$key_name" -w 2>/dev/null
}

# =====================================================================
# METHOD 2: ENVIRONMENT VARIABLES
# =====================================================================

echo "🌍 METHOD 2: Environment Variables"
echo "=================================="
echo ""

# Create .env file with Supabase keys
create_env_file() {
    echo "Creating .env file for local development..."
    
    cat > .env << EOF
# =====================================================================
# MEAUXBILITY SUPABASE CONFIGURATION
# =====================================================================
# DO NOT COMMIT THIS FILE TO GIT!
# Add .env to your .gitignore file

# Supabase Configuration
SUPABASE_URL=your-supabase-url-here
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# AI API Keys
ANTHROPIC_API_KEY=your-anthropic-key-here
OPENAI_API_KEY=your-openai-key-here
TEAM_OPENAI_API_KEY=your-team-openai-key-here

# Other API Keys
STRIPE_SECRET_KEY=your-stripe-secret-key-here
SENDGRID_API_KEY=your-sendgrid-key-here
GOOGLE_OAUTH_CLIENT_ID=your-google-oauth-client-id-here
GOOGLE_OAUTH_CLIENT_SECRET=your-google-oauth-client-secret-here
EOF

    echo "✅ .env file created"
    echo "⚠️  Remember to add .env to your .gitignore file!"
}

# =====================================================================
# METHOD 3: GITHUB SECRETS (FOR CI/CD)
# =====================================================================

echo "🔒 METHOD 3: GitHub Secrets (for CI/CD)"
echo "======================================"
echo ""

show_github_secrets_setup() {
    echo "To set up GitHub Secrets:"
    echo "1. Go to your repository: https://github.com/meauxbility/SUPABASESUPERCHARGE"
    echo "2. Click 'Settings' → 'Secrets and variables' → 'Actions'"
    echo "3. Add these secrets:"
    echo ""
    echo "   SUPABASE_URL"
    echo "   SUPABASE_ANON_KEY"
    echo "   SUPABASE_SERVICE_ROLE_KEY"
    echo "   ANTHROPIC_API_KEY"
    echo "   OPENAI_API_KEY"
    echo "   TEAM_OPENAI_API_KEY"
    echo "   STRIPE_SECRET_KEY"
    echo "   SENDGRID_API_KEY"
    echo "   GOOGLE_OAUTH_CLIENT_ID"
    echo "   GOOGLE_OAUTH_CLIENT_SECRET"
    echo ""
    echo "✅ GitHub Secrets will be used automatically in CI/CD workflows"
}

# =====================================================================
# METHOD 4: RENDER ENVIRONMENT VARIABLES (FOR PRODUCTION)
# =====================================================================

echo "🚀 METHOD 4: Render Environment Variables (for Production)"
echo "========================================================"
echo ""

show_render_setup() {
    echo "To set up Render Environment Variables:"
    echo "1. Go to your Render dashboard: https://dashboard.render.com"
    echo "2. Select your service"
    echo "3. Go to 'Environment' tab"
    echo "4. Add these environment variables:"
    echo ""
    echo "   SUPABASE_URL"
    echo "   SUPABASE_ANON_KEY"
    echo "   SUPABASE_SERVICE_ROLE_KEY"
    echo "   ANTHROPIC_API_KEY"
    echo "   OPENAI_API_KEY"
    echo "   TEAM_OPENAI_API_KEY"
    echo "   STRIPE_SECRET_KEY"
    echo "   SENDGRID_API_KEY"
    echo "   GOOGLE_OAUTH_CLIENT_ID"
    echo "   GOOGLE_OAUTH_CLIENT_SECRET"
    echo ""
    echo "✅ Render will use these for production deployment"
}

# =====================================================================
# KEYCHAIN HELPER FUNCTIONS
# =====================================================================

echo "🛠️  KEYCHAIN HELPER FUNCTIONS"
echo "============================"
echo ""

# Create keychain helper script
create_keychain_helper() {
    cat > scripts/keychain-helper.sh << 'EOF'
#!/bin/bash
# =====================================================================
# KEYCHAIN HELPER FOR MEAUXBILITY
# =====================================================================

SERVICE="Meauxbility-Supabase"

# Function to get a key from keychain
get_key() {
    local key_name="$1"
    security find-generic-password -s "$SERVICE" -a "$key_name" -w 2>/dev/null
}

# Function to set a key in keychain
set_key() {
    local key_name="$1"
    local key_value="$2"
    security add-generic-password -s "$SERVICE" -a "$key_name" -w "$key_value"
}

# Function to list all keys
list_keys() {
    security find-generic-password -s "$SERVICE" -a "*" 2>/dev/null | grep "acct" | cut -d'"' -f4
}

# Function to delete a key
delete_key() {
    local key_name="$1"
    security delete-generic-password -s "$SERVICE" -a "$key_name"
}

# Main function
case "$1" in
    "get")
        get_key "$2"
        ;;
    "set")
        set_key "$2" "$3"
        ;;
    "list")
        list_keys
        ;;
    "delete")
        delete_key "$2"
        ;;
    *)
        echo "Usage: $0 {get|set|list|delete} [key_name] [key_value]"
        echo ""
        echo "Examples:"
        echo "  $0 get SUPABASE_URL"
        echo "  $0 set SUPABASE_URL 'https://your-project.supabase.co'"
        echo "  $0 list"
        echo "  $0 delete SUPABASE_URL"
        ;;
esac
EOF

    chmod +x scripts/keychain-helper.sh
    echo "✅ Keychain helper script created: scripts/keychain-helper.sh"
}

# =====================================================================
# MAIN SETUP FUNCTION
# =====================================================================

main() {
    echo "🔐 SUPABASE KEY STORAGE SETUP"
    echo "============================="
    echo ""
    
    # Create .env file
    create_env_file
    echo ""
    
    # Create keychain helper
    create_keychain_helper
    echo ""
    
    # Show GitHub secrets setup
    show_github_secrets_setup
    echo ""
    
    # Show Render setup
    show_render_setup
    echo ""
    
    echo "🎯 RECOMMENDED APPROACH:"
    echo "========================"
    echo ""
    echo "1. 🏠 LOCAL DEVELOPMENT:"
    echo "   - Use .env file for development"
    echo "   - Use macOS Keychain for secure storage"
    echo ""
    echo "2. 🔄 CI/CD (GitHub Actions):"
    echo "   - Use GitHub Secrets"
    echo "   - Automatically available in workflows"
    echo ""
    echo "3. 🚀 PRODUCTION (Render):"
    echo "   - Use Render Environment Variables"
    echo "   - Secure and encrypted"
    echo ""
    echo "4. 🔐 SECURITY BEST PRACTICES:"
    echo "   - Never commit .env files to git"
    echo "   - Rotate keys regularly"
    echo "   - Monitor key usage"
    echo "   - Use different keys for different environments"
    echo ""
    echo "✅ Setup complete! Your Supabase keys are now securely configured."
}

# Run main function
main
