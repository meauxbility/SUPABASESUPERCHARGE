# 🚀 Claude.ai Quick Setup for Meauxbility

## **Step 1: Get Your Anthropic API Key**

1. **Go to Anthropic Console**
   - Visit: https://console.anthropic.com/
   - Sign up or log in with your account
   - Navigate to "API Keys" section
   - Create a new API key
   - Copy the key (starts with `sk-ant-`)

2. **Add to Environment Variables**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env and add your API key
   nano .env
   ```
   
   Add this line to your `.env` file:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
   ```

## **Step 2: Test Claude.ai Integration**

```bash
# Test the connection
npm run claude:test

# Expected output:
# 🤖 Testing Claude.ai integration...
# ✅ Claude.ai integration successful!
# 📊 Model: claude-3-5-sonnet-20241022
# 🔐 Repository: meauxbility
# 🛡️ Security Level: private
```

## **Step 3: Configure Claude.ai for Your Workflow**

### **Option A: Cursor IDE (Recommended)**
1. **Install Cursor IDE**
   - Download from: https://cursor.sh/
   - Install and open Cursor
   - Open your Meauxbility repository

2. **Configure Claude.ai in Cursor**
   - Go to Settings > AI
   - Select "Claude 3.5 Sonnet"
   - Enter your Anthropic API key
   - Set repository context to "Meauxbility"

### **Option B: Direct Integration**
```bash
# Review code changes
npm run claude:review

# Sync with Notion
npm run claude:notion

# Run security analysis
npm run claude:security
```

## **Step 4: Verify Integration**

```bash
# Check all Claude.ai commands
npm run claude:test    # Test connection
npm run claude:review  # Review code
npm run claude:notion  # Sync with Notion
npm run claude:security # Security analysis
```

## **Step 5: Team Collaboration**

### **For Your Teammate:**
1. Share the API key securely
2. Add to their `.env` file
3. Test integration: `npm run claude:test`

### **For AI Agents:**
- Claude.ai will work alongside your existing AI agents
- Primary AI Agent + Claude.ai for enhanced code review
- Security AI Agent + Claude.ai for comprehensive security analysis

## **🔧 Available Commands**

| Command | Description |
|---------|-------------|
| `npm run claude:test` | Test Claude.ai connection |
| `npm run claude:review` | Review code changes |
| `npm run claude:notion` | Sync with Notion |
| `npm run claude:security` | Security analysis |

## **📋 What Claude.ai Will Do**

### **Code Review**
- Analyze your code changes
- Suggest improvements
- Identify potential issues
- Recommend best practices

### **Security Analysis**
- Scan for vulnerabilities
- Check for secrets
- Review access controls
- Monitor AI agent permissions

### **Documentation**
- Auto-generate documentation
- Update README files
- Sync with Notion workspace
- Create team reports

### **Team Coordination**
- Work with your teammate
- Coordinate with other AI agents
- Provide insights and recommendations
- Monitor project progress

## **🚨 Troubleshooting**

### **Common Issues:**

**1. API Key Not Working**
```bash
# Check if API key is set
echo $ANTHROPIC_API_KEY

# Test connection
npm run claude:test
```

**2. Permission Denied**
```bash
# Check file permissions
chmod +x scripts/claude-integration.js

# Verify environment variables
cat .env | grep ANTHROPIC
```

**3. Integration Fails**
```bash
# Check logs
npm run claude:test 2>&1 | tee claude-debug.log

# Restart integration
npm run claude:test
```

## **📞 Support**

- **API Issues**: Check Anthropic documentation
- **Integration Problems**: Review the logs
- **Team Questions**: Ask in team chat
- **Security Concerns**: Use security scanning

---

**🎉 You're Ready!** Claude.ai is now integrated with your Meauxbility repository. Start coding and let Claude.ai help you build something amazing! 🚀✨
