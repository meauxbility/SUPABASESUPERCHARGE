# 🔐 GITHUB SECRETS SETUP GUIDE

**Complete guide for setting up GitHub Secrets for your Meauxbility platform.**

---

## 🎯 QUICK SETUP (5 minutes)

### **Step 1: Go to GitHub Secrets**
1. Navigate to: https://github.com/meauxbility/SUPABASESUPERCHARGE/settings/secrets/actions
2. Click **"New repository secret"** for each secret below

### **Step 2: Add Your Secrets**

#### **🔗 Supabase Secrets (Required)**
```
Name: SUPABASE_URL
Value: https://ghiulqoqujsiofsjcrqk.supabase.co

Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA

Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Get from Supabase Dashboard → Settings → API]

Name: SUPABASE_JWT_SECRET
Value: [Get from Supabase Dashboard → Settings → API]

Name: DATABASE_URL
Value: postgresql://postgres:[YOUR_PASSWORD]@db.ghiulqoqujsiofsjcrqk.supabase.co:5432/postgres
```

#### **🤖 AI API Secrets (Optional for CI)**
```
Name: ANTHROPIC_API_KEY
Value: [Your Claude API key]

Name: OPENAI_API_KEY
Value: [Your ChatGPT API key]

Name: TEAM_OPENAI_API_KEY
Value: [Your Team ChatGPT API key]
```

#### **💳 Payment Secrets (When Ready)**
```
Name: STRIPE_SECRET_KEY
Value: [Your Stripe secret key]

Name: STRIPE_PUBLISHABLE_KEY
Value: [Your Stripe publishable key]

Name: STRIPE_WEBHOOK_SECRET
Value: [Your Stripe webhook secret]
```

#### **📧 Email Secrets (When Ready)**
```
Name: SENDGRID_API_KEY
Value: [Your SendGrid API key]

Name: SENDGRID_FROM_EMAIL
Value: noreply@meauxbility.org

Name: SENDGRID_FROM_NAME
Value: Meauxbility
```

#### **🔍 Google Secrets (When Ready)**
```
Name: GOOGLE_OAUTH_CLIENT_ID
Value: [Your Google OAuth client ID]

Name: GOOGLE_OAUTH_CLIENT_SECRET
Value: [Your Google OAuth client secret]

Name: GOOGLE_ANALYTICS_ID
Value: [Your Google Analytics ID]
```

#### **🔐 Security Secrets (When Ready)**
```
Name: JWT_SECRET
Value: [Generate a random string]

Name: ENCRYPTION_KEY
Value: [Generate a random string]
```

---

## 🚀 HOW GITHUB SECRETS WORK

### **In Your Workflows:**
```yaml
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### **In Your Code:**
```javascript
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
```

### **Automatic Access:**
- ✅ **CI/CD** - Available in all GitHub Actions
- ✅ **Production** - Use in Render environment variables
- ✅ **Team Access** - Only repository collaborators can see
- ✅ **Encrypted** - GitHub encrypts all secrets

---

## 📋 SECRETS CHECKLIST

### **✅ Required for Basic Setup:**
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### **✅ Optional for AI Features:**
- [ ] `ANTHROPIC_API_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `TEAM_OPENAI_API_KEY`

### **✅ When Ready for Production:**
- [ ] `STRIPE_SECRET_KEY`
- [ ] `SENDGRID_API_KEY`
- [ ] `GOOGLE_OAUTH_CLIENT_ID`
- [ ] `JWT_SECRET`

---

## 🔧 TESTING YOUR SECRETS

### **1. Test in GitHub Actions:**
```bash
# Push to main branch to trigger CI/CD
git add .
git commit -m "test: Add GitHub secrets"
git push origin main
```

### **2. Check Workflow Results:**
1. Go to: https://github.com/meauxbility/SUPABASESUPERCHARGE/actions
2. Click on the latest workflow run
3. Look for "✅ Supabase secrets are available"

### **3. Test Locally:**
```bash
# Test your keychain helper
./scripts/keychain-helper.sh get SUPABASE_URL

# Test your .env file
cat .env | grep SUPABASE_URL
```

---

## 🛡️ SECURITY BEST PRACTICES

### **✅ Do:**
- ✅ **Use GitHub Secrets** for CI/CD
- ✅ **Use Render Environment Variables** for production
- ✅ **Use macOS Keychain** for local development
- ✅ **Rotate keys regularly** (every 90 days)
- ✅ **Monitor key usage** in service dashboards

### **❌ Don't:**
- ❌ **Never commit secrets** to git
- ❌ **Never share secrets** in chat/email
- ❌ **Never use the same key** for different environments
- ❌ **Never ignore security warnings**

---

## 🆘 TROUBLESHOOTING

### **Common Issues:**

#### **1. "Secret not found" in workflow**
```yaml
# Check your workflow file has:
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
```

#### **2. "Permission denied" for secrets**
- Make sure you're a repository collaborator
- Check repository settings → Secrets and variables → Actions

#### **3. "Invalid key format"**
- Verify the key is copied correctly
- Check for extra spaces or characters
- Test the key in the service dashboard first

#### **4. "Workflow not running"**
- Check if the workflow file is in `.github/workflows/`
- Verify the trigger conditions (push to main, etc.)
- Check the Actions tab for any errors

---

## 🎯 NEXT STEPS

### **After Setting Up Secrets:**

#### **1. Test Your Setup (5 minutes):**
```bash
# Push to trigger CI/CD
git add .
git commit -m "test: GitHub secrets setup"
git push origin main
```

#### **2. Check Workflow Results:**
- Go to Actions tab
- Verify all tests pass
- Check for "✅ Supabase secrets are available"

#### **3. Set Up Production (10 minutes):**
- Configure Render environment variables
- Deploy your application
- Test in production

---

## 📞 SUPPORT

### **Need Help?**
- **GitHub Secrets:** Check repository permissions
- **Workflow Issues:** Check Actions tab for errors
- **Key Issues:** Verify keys in service dashboards
- **Permission Issues:** Check team access settings

### **Emergency:**
- **Rotate Keys:** Generate new keys in service dashboards
- **Update Secrets:** Replace old secrets with new ones
- **Test Everything:** Run full test suite after changes

---

**🔐 Your GitHub Secrets are now ready for production deployment!** 🚀

**Next:** Set up Render environment variables for production deployment.
