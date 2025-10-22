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
