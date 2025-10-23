# 🔑 Complete API Keys Collection Guide

## 🎯 **Your Current Status: 0/8 Keys Configured**

**Don't worry! Let's get you set up step by step.** 🚀

---

## 🔥 **PRIORITY 1: SUPABASE (You have these!)**

### **✅ You Already Have These:**
```bash
# These are already working in your app
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA
```

### **❌ You Need This:**
```bash
# Service Role Key (KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**How to Get:**
1. **Go to:** https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
2. **Click:** Settings → API
3. **Copy:** Service Role Key (starts with `eyJ...`)

---

## 🤖 **PRIORITY 2: ANTHROPIC CLAUDE (For AI Agents)**

### **Required Keys:**
```bash
ANTHROPIC_API_KEY=sk-ant-your_key_here
CLAUDE_MODEL=claude-sonnet-4-20250514
```

**How to Get:**
1. **Visit:** https://console.anthropic.com/
2. **Sign up/Login** with your email
3. **Go to:** API Keys section
4. **Create new key** named "Meauxbility AI"
5. **Copy the key** (starts with `sk-ant-`)

---

## 🐙 **PRIORITY 3: GITHUB (For Deployments)**

### **Required Keys:**
```bash
GITHUB_TOKEN=ghp_your_token_here
```

**How to Get:**
1. **Visit:** https://github.com/settings/tokens
2. **Click:** "Generate new token" (classic)
3. **Name:** "Meauxbility Deployments"
4. **Scopes:** Check `repo`, `workflow`, `admin:org`
5. **Copy the token** (starts with `ghp_`)

---

## 🚀 **PRIORITY 4: RENDER (For Deployments)**

### **Required Keys:**
```bash
RENDER_API_KEY=your_render_api_key_here
```

**How to Get:**
1. **Visit:** https://dashboard.render.com/
2. **Go to:** Account Settings
3. **Click:** "API Keys"
4. **Create new key** named "Meauxbility"
5. **Copy the key**

---

## 💳 **PRIORITY 5: STRIPE (For Payments)**

### **Required Keys:**
```bash
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

**How to Get:**
1. **Visit:** https://dashboard.stripe.com/apikeys
2. **Copy Secret Key** (starts with `sk_live_`)
3. **Copy Publishable Key** (starts with `pk_live_`)

---

## 🎯 **STEP-BY-STEP COLLECTION PLAN**

### **Step 1: Get Supabase Service Role Key (5 minutes)**
- **Go to:** https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
- **Click:** Settings → API
- **Copy:** Service Role Key

### **Step 2: Get Anthropic API Key (10 minutes)**
- **Go to:** https://console.anthropic.com/
- **Sign up/Login**
- **Create API key**
- **Copy the key**

### **Step 3: Get GitHub Token (5 minutes)**
- **Go to:** https://github.com/settings/tokens
- **Generate new token**
- **Copy the token**

### **Step 4: Get Render API Key (5 minutes)**
- **Go to:** https://dashboard.render.com/
- **Account Settings → API Keys**
- **Create new key**
- **Copy the key**

### **Step 5: Get Stripe Keys (10 minutes)**
- **Go to:** https://dashboard.stripe.com/apikeys
- **Copy both keys**

---

## 🔐 **SECURITY NOTES**

### **✅ Keep These SECRET:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `GITHUB_TOKEN`
- `RENDER_API_KEY`
- `STRIPE_SECRET_KEY`

### **✅ These are PUBLIC (Safe to share):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_PUBLISHABLE_KEY`

---

## 🧪 **TEST YOUR KEYS**

After collecting each key, test it:

```bash
# Test Supabase
curl -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
     https://ghiulqoqujsiofsjcrqk.supabase.co/rest/v1/

# Test Anthropic
curl -H "Authorization: Bearer YOUR_ANTHROPIC_KEY" \
     https://api.anthropic.com/v1/messages

# Test GitHub
curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
     https://api.github.com/user
```

---

## 🎯 **QUICK START**

**Start with these 3 keys (most important):**
1. **Supabase Service Role Key** (5 min)
2. **Anthropic API Key** (10 min)  
3. **GitHub Token** (5 min)

**Total time: ~20 minutes to get the core keys working!** 🚀

---

## 📞 **NEED HELP?**

**If you get stuck on any step:**
1. **Take a screenshot** of what you see
2. **Tell me which step** you're on
3. **I'll walk you through it** step by step

**Let's get you set up!** 🎯
