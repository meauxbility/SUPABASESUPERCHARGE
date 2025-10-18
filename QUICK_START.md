# 🚀 QUICK START - Get Everything Connected in 15 Minutes

## **Step 1: Claude.ai Connection (5 minutes)**

### Get Your API Key
1. Go to: https://console.anthropic.com/
2. Sign up/login → API Keys → Create new key
3. Copy the key (starts with `sk-ant-`)

### Test Connection
```bash
# Add your API key to environment
cp env.example .env
nano .env

# Add this line:
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here

# Test Claude.ai
npm run claude:test
```

**Expected Output:**
```
✅ Claude.ai integration successful!
📊 Model: claude-3-5-sonnet-20241022
🔐 Repository: meauxbility
```

---

## **Step 2: Team Access Setup (5 minutes)**

### Add Team Members to GitHub
1. Go to: https://github.com/InnerAnimal/spartans/settings/access
2. Click "Invite a collaborator"
3. Add Connor Mcneely (CTO) - Role: Maintainer
4. Add Fred Williams (CMO) - Role: Maintainer
5. Send invitations

### Team Onboarding
Each team member runs:
```bash
git clone https://github.com/InnerAnimal/spartans.git
cd spartans
npm install
cp env.example .env
# Add their API keys to .env
```

---

## **Step 3: Shopify Project Setup (5 minutes)**

### Install Shopify CLI
```bash
# Install globally
npm install -g @shopify/cli

# Login to Shopify
shopify auth login

# Navigate to project
cd shopify-custom-build
npm install
```

### Test Shopify Connection
```bash
# Test Shopify CLI
shopify version

# Create development theme
shopify theme dev
```

---

## **Step 4: Test Everything Works**

### Test All Integrations
```bash
# Test Claude.ai
npm run claude:test

# Test security scanning
npm run security:scan

# Test Notion sync (when API keys added)
npm run notion:sync

# Test Shopify project
cd shopify-custom-build
npm run dev
```

---

## **Step 5: Start Building**

### Create Your First Modal
```javascript
// In your Shopify theme or custom build
const modalManager = new ModalManager();

// Create a contact form modal
const contactModal = modalManager.createModal({
  id: 'contact-form',
  title: 'Contact Us',
  content: `
    <form>
      <input type="text" name="name" placeholder="Your Name" required>
      <input type="email" name="email" placeholder="Your Email" required>
      <textarea name="message" placeholder="Your Message" required></textarea>
    </form>
  `,
  apiEndpoint: '/api/contact',
  onSubmit: async (data) => {
    console.log('Form submitted:', data);
    // Handle form submission
  }
});

// Show the modal
modalManager.showModal('contact-form');
```

### Test API Integration
```javascript
// Initialize API manager
const apiManager = new ApiManager({
  baseUrl: 'https://your-api-domain.com',
  apiKey: 'your-api-key'
});

// Test API connection
apiManager.healthCheck().then(result => {
  console.log('API Status:', result);
});
```

---

## **🎯 What You Now Have**

### **Complete Development Environment**
- ✅ Claude.ai integration for AI-assisted development
- ✅ Team collaboration with GitHub access control
- ✅ Shopify custom build project structure
- ✅ Modal system for popup functionality
- ✅ API integration layer (Shopify → Independent)
- ✅ Security scanning and quality assurance
- ✅ Automated testing and deployment

### **Ready to Build**
- ✅ Custom HTML modals with API integration
- ✅ Shopify theme development environment
- ✅ Independent platform migration path
- ✅ Team development workflow
- ✅ AI-assisted code review and suggestions

### **Cost-Effective Strategy**
- ✅ Minimal third-party dependencies
- ✅ Team learning and skill development
- ✅ Future-proof architecture
- ✅ Efficient development workflow

---

## **📞 Next Steps**

1. **Test Everything**: Run all test commands above
2. **Team Onboarding**: Get Connor and Fred set up
3. **First Modal**: Create your first custom modal
4. **API Integration**: Set up your independent API
5. **Start Building**: Begin your Shopify custom build

**You're ready to build something amazing!** 🚀✨

---

**Need Help?** Check the detailed guides:
- `PROJECT_SETUP_GUIDE.md` - Complete setup instructions
- `CLAUDE_AI_INTEGRATION.md` - AI integration details
- `SETUP_GUIDE.md` - Development environment setup
