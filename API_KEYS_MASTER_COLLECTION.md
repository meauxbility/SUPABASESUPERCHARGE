# 🔑 API Keys Master Collection - Meauxbility

## 🎯 **Complete API Keys & Credentials Collection**

### **📋 Current Status:**
- ✅ **Supabase** - Configured
- ✅ **Render** - Configured  
- ⚠️ **Anthropic Claude** - Needs setup
- ⚠️ **GitHub** - Needs verification
- ❓ **Stripe** - Needs verification
- ❓ **Google Domains** - Needs verification

---

## 🔥 **SUPABASE (✅ CONFIGURED)**

### **Project Details:**
- **Project ID:** `ghiulqoqujsiofsjcrqk`
- **Project URL:** `https://ghiulqoqujsiofsjcrqk.supabase.co`
- **Region:** `us-west-1` (Oregon)

### **API Keys:**
```bash
# Public (Safe to use in frontend)
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA

# Service Role (KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk2MDA5MCwiZXhwIjoyMDc2NTM2MDkwfQ.YourServiceRoleKeyHere
```

### **Database Connection:**
- **Host:** `db.ghiulqoqujsiofsjcrqk.supabase.co`
- **Port:** `5432`
- **Database:** `postgres`
- **Username:** `postgres`
- **Password:** `YourDatabasePasswordHere`

---

## 🚀 **RENDER (✅ CONFIGURED)**

### **Service Details:**
- **Service ID:** `supabasesupercharge`
- **Service URL:** `https://supabasesupercharge.onrender.com`
- **Region:** `Oregon`
- **Plan:** `Starter`

### **API Keys:**
```bash
# Render API Key (KEEP SECRET!)
RENDER_API_KEY=your_render_api_key_here

# Environment Variables (Already set in Render)
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA
NODE_ENV=production
PORT=3000
```

---

## 🤖 **ANTHROPIC CLAUDE (⚠️ NEEDS SETUP)**

### **Required Keys:**
```bash
# Anthropic API Key (KEEP SECRET!)
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Optional Configuration
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096
AI_AGENT_ACCESS_TOKEN=your_agent_token_here
AI_AGENT_PERMISSIONS=read,write,deploy
```

### **How to Get:**
1. **Visit:** https://console.anthropic.com/
2. **Sign up/Login** with your email
3. **Go to API Keys** section
4. **Create new key** with name "Meauxbility AI"
5. **Copy the key** (starts with `sk-ant-`)

---

## 🐙 **GITHUB (⚠️ NEEDS VERIFICATION)**

### **Required Keys:**
```bash
# GitHub Personal Access Token (KEEP SECRET!)
GITHUB_TOKEN=ghp_your_token_here

# GitHub App (if using)
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY=your_private_key
```

### **How to Get:**
1. **Visit:** https://github.com/settings/tokens
2. **Generate new token** (classic)
3. **Scopes needed:** `repo`, `workflow`, `admin:org`
4. **Copy the token** (starts with `ghp_`)

---

## 💳 **STRIPE (❓ NEEDS VERIFICATION)**

### **Required Keys:**
```bash
# Stripe API Keys (KEEP SECRET!)
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# Webhook Endpoint
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### **How to Get:**
1. **Visit:** https://dashboard.stripe.com/apikeys
2. **Copy Secret Key** (starts with `sk_live_`)
3. **Copy Publishable Key** (starts with `pk_live_`)
4. **Set up webhook** for payment events

---

## 🌐 **GOOGLE DOMAINS (❓ NEEDS VERIFICATION)**

### **Domain Details:**
- **Domain:** `meauxbility.org`
- **Registrar:** Google Domains
- **DNS Provider:** Google Domains

### **Current DNS Records:**
```
Type: A
Name: @
Data: 23.227.38.71 (Shopify)

Type: A
Name: www
Data: 23.227.38.71 (Shopify)
```

### **Target DNS Records:**
```
Type: A
Name: @
Data: 44.229.227.142 (Render)

Type: A
Name: www
Data: 44.229.227.142 (Render)
```

---

## 🔐 **SECURITY CHECKLIST**

### **✅ Keep These SECRET:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `RENDER_API_KEY`
- `ANTHROPIC_API_KEY`
- `GITHUB_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### **✅ These are PUBLIC (Safe to share):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_PUBLISHABLE_KEY`

---

## 🎯 **NEXT STEPS**

### **Priority 1: Get Missing Keys**
1. **Anthropic Claude** - Get API key
2. **GitHub** - Verify/refresh token
3. **Stripe** - Get API keys

### **Priority 2: Update Environment Files**
1. **Update** `SUPABASESUPERCHARGE.env`
2. **Update** Render environment variables
3. **Update** GitHub secrets

### **Priority 3: Test Everything**
1. **Test Supabase** connection
2. **Test Render** deployment
3. **Test AI agents** functionality

---

## 📞 **NEED HELP?**

### **If you need help getting any of these keys:**
1. **Anthropic:** https://console.anthropic.com/
2. **GitHub:** https://github.com/settings/tokens
3. **Stripe:** https://dashboard.stripe.com/apikeys
4. **Google Domains:** https://domains.google.com/

**Let me know which keys you need help with!** 🚀
