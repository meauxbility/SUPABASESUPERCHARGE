# 🔐 SECURE SUPABASE KEY STORAGE GUIDE

**Complete guide for securely storing and managing your Supabase API keys across all environments.**

---

## 🎯 QUICK START

### **1. Run the Setup Script**
```bash
./scripts/secure-key-storage.sh
```

### **2. Store Your Keys**
```bash
# Store Supabase keys in macOS Keychain
./scripts/keychain-helper.sh set SUPABASE_URL "https://your-project.supabase.co"
./scripts/keychain-helper.sh set SUPABASE_ANON_KEY "eyJhbGc..."
./scripts/keychain-helper.sh set SUPABASE_SERVICE_ROLE_KEY "eyJhbGc..."
```

### **3. Create .env File**
```bash
# Copy the template
cp env.template .env

# Edit with your actual keys
nano .env
```

---

## 🔐 SECURE STORAGE METHODS

### **Method 1: macOS Keychain (Recommended for Local)**
```bash
# Store a key
./scripts/keychain-helper.sh set SUPABASE_URL "https://your-project.supabase.co"

# Retrieve a key
./scripts/keychain-helper.sh get SUPABASE_URL

# List all keys
./scripts/keychain-helper.sh list

# Delete a key
./scripts/keychain-helper.sh delete SUPABASE_URL
```

**Benefits:**
- ✅ Encrypted by macOS
- ✅ Protected by Touch ID/Face ID
- ✅ Never stored in plain text
- ✅ Easy to manage

### **Method 2: Environment Variables (.env)**
```bash
# Create .env file
cp env.template .env

# Edit with your keys
nano .env
```

**Benefits:**
- ✅ Simple for development
- ✅ Easy to manage
- ✅ Works with all tools
- ⚠️ Keep .env out of git!

### **Method 3: GitHub Secrets (for CI/CD)**
1. Go to: https://github.com/meauxbility/SUPABASESUPERCHARGE/settings/secrets/actions
2. Add these secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
   - `TEAM_OPENAI_API_KEY`

**Benefits:**
- ✅ Encrypted by GitHub
- ✅ Automatic in CI/CD
- ✅ Team access control
- ✅ Audit trail

### **Method 4: Render Environment Variables (for Production)**
1. Go to: https://dashboard.render.com
2. Select your service
3. Go to "Environment" tab
4. Add your environment variables

**Benefits:**
- ✅ Encrypted in production
- ✅ Easy to manage
- ✅ Automatic deployment
- ✅ Team access control

---

## 🚀 IMPLEMENTATION BY ENVIRONMENT

### **🏠 Local Development**
```bash
# 1. Store keys in Keychain
./scripts/keychain-helper.sh set SUPABASE_URL "https://your-project.supabase.co"
./scripts/keychain-helper.sh set SUPABASE_ANON_KEY "eyJhbGc..."

# 2. Create .env file
cp env.template .env
# Edit .env with your keys

# 3. Test your setup
npm run test
```

### **🔄 CI/CD (GitHub Actions)**
```yaml
# .github/workflows/ci.yml
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### **🚀 Production (Render)**
```bash
# Set in Render dashboard
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## 🔑 KEYCHAIN HELPER USAGE

### **Basic Commands**
```bash
# Get help
./scripts/keychain-helper.sh help

# Store a key
./scripts/keychain-helper.sh set SUPABASE_URL "https://your-project.supabase.co"

# Retrieve a key
./scripts/keychain-helper.sh get SUPABASE_URL

# List all keys
./scripts/keychain-helper.sh list

# Delete a key
./scripts/keychain-helper.sh delete SUPABASE_URL
```

### **Common Keys to Store**
```bash
# Supabase keys
./scripts/keychain-helper.sh set SUPABASE_URL "https://your-project.supabase.co"
./scripts/keychain-helper.sh set SUPABASE_ANON_KEY "eyJhbGc..."
./scripts/keychain-helper.sh set SUPABASE_SERVICE_ROLE_KEY "eyJhbGc..."

# AI API keys
./scripts/keychain-helper.sh set ANTHROPIC_API_KEY "sk-ant-api03..."
./scripts/keychain-helper.sh set OPENAI_API_KEY "sk-..."
./scripts/keychain-helper.sh set TEAM_OPENAI_API_KEY "sk-..."

# Payment keys
./scripts/keychain-helper.sh set STRIPE_SECRET_KEY "sk_test_..."
./scripts/keychain-helper.sh set SENDGRID_API_KEY "SG..."

# Google keys
./scripts/keychain-helper.sh set GOOGLE_OAUTH_CLIENT_ID "your-client-id"
./scripts/keychain-helper.sh set GOOGLE_OAUTH_CLIENT_SECRET "your-client-secret"
```

---

## 🛡️ SECURITY BEST PRACTICES

### **1. Key Rotation**
```bash
# Rotate keys regularly (every 90 days)
# 1. Generate new keys in Supabase dashboard
# 2. Update all environments
# 3. Test thoroughly
# 4. Delete old keys
```

### **2. Access Control**
- ✅ **Local:** Use macOS Keychain (Touch ID/Face ID)
- ✅ **CI/CD:** Use GitHub Secrets (team access)
- ✅ **Production:** Use Render Environment Variables
- ✅ **Team:** Share keys securely (not in chat/email)

### **3. Monitoring**
```bash
# Check key usage
./scripts/keychain-helper.sh list

# Monitor API usage in Supabase dashboard
# Set up alerts for unusual activity
```

### **4. Backup Strategy**
- ✅ **Keychain:** Automatically backed up with iCloud
- ✅ **GitHub Secrets:** Version controlled
- ✅ **Render:** Encrypted storage
- ✅ **Documentation:** Keep secure notes of key purposes

---

## 🚨 TROUBLESHOOTING

### **Common Issues**

#### **1. Keychain Access Denied**
```bash
# Grant Terminal access to Keychain
# System Preferences → Security & Privacy → Privacy → Full Disk Access
# Add Terminal to the list
```

#### **2. Key Not Found**
```bash
# Check if key exists
./scripts/keychain-helper.sh list

# Verify key name spelling
./scripts/keychain-helper.sh get SUPABASE_URL
```

#### **3. Permission Issues**
```bash
# Make sure scripts are executable
chmod +x scripts/keychain-helper.sh
chmod +x scripts/secure-key-storage.sh
```

#### **4. Environment Variables Not Loading**
```bash
# Check .env file exists
ls -la .env

# Verify .env is in .gitignore
cat .gitignore | grep .env
```

---

## 📋 CHECKLIST

### **✅ Setup Complete When:**
- [ ] Keychain helper script is executable
- [ ] Supabase keys stored in Keychain
- [ ] .env file created (not committed to git)
- [ ] GitHub Secrets configured
- [ ] Render Environment Variables set
- [ ] All keys tested and working

### **✅ Security Verified When:**
- [ ] No keys in git history
- [ ] .env in .gitignore
- [ ] Keys rotated regularly
- [ ] Access properly controlled
- [ ] Monitoring set up

---

## 🎯 RECOMMENDED WORKFLOW

### **For New Keys:**
1. **Generate** in service dashboard
2. **Store** in macOS Keychain
3. **Test** locally with .env
4. **Add** to GitHub Secrets
5. **Deploy** to Render
6. **Verify** in production

### **For Key Rotation:**
1. **Generate** new keys
2. **Update** all environments
3. **Test** thoroughly
4. **Deploy** to production
5. **Delete** old keys
6. **Monitor** for issues

---

## 🆘 SUPPORT

### **Need Help?**
- **Keychain Issues:** Check macOS Security & Privacy settings
- **GitHub Secrets:** Verify repository permissions
- **Render Variables:** Check service configuration
- **Script Issues:** Ensure scripts are executable

### **Emergency Key Recovery:**
1. **Check Keychain:** `./scripts/keychain-helper.sh list`
2. **Check .env:** `cat .env`
3. **Check GitHub:** Repository settings → Secrets
4. **Check Render:** Service → Environment
5. **Regenerate:** If all else fails, create new keys

---

**🔐 Your Supabase keys are now securely stored and ready for production!** 🚀
