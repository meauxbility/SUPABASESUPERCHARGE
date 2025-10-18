# 🚀 Spartans Team - Complete Project Setup Guide

## **Phase 1: Claude.ai Integration & Team Connection**

### **Step 1: Claude.ai API Setup (5 minutes)**
```bash
# 1. Get your Anthropic API key
# Go to: https://console.anthropic.com/
# Sign up/login → API Keys → Create new key
# Copy the key (starts with sk-ant-)

# 2. Add to your environment
cp env.example .env
nano .env

# Add this line:
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

### **Step 2: Test Claude.ai Connection**
```bash
# Test the integration
npm run claude:test

# Expected output:
# ✅ Claude.ai integration successful!
# 📊 Model: claude-3-5-sonnet-20241022
# 🔐 Repository: meauxbility
```

### **Step 3: Team Access Setup**
1. **Go to GitHub**: https://github.com/InnerAnimal/spartans/settings/access
2. **Add Team Members**:
   - Click "Invite a collaborator"
   - Add Connor Mcneely (CTO) - Role: Maintainer
   - Add Fred Williams (CMO) - Role: Maintainer
3. **Send Invitations**

---

## **Phase 2: Shopify HTML Custom Build Project Setup**

### **Step 4: Create Project Structure**
```bash
# Create Shopify project directory
mkdir shopify-custom-build
cd shopify-custom-build

# Initialize project
npm init -y
npm install --save-dev @shopify/cli @shopify/theme
```

### **Step 5: Shopify Development Environment**
```bash
# Install Shopify CLI globally
npm install -g @shopify/cli

# Login to Shopify
shopify auth login

# Create new theme
shopify theme init meauxbility-custom
```

### **Step 6: Custom HTML Modal System**
```bash
# Create modal system structure
mkdir -p src/modals
mkdir -p src/components
mkdir -p src/styles
mkdir -p src/scripts
mkdir -p src/api
```

---

## **Phase 3: Development Workflow Setup**

### **Step 7: Claude.ai GitHub Integration**
```bash
# Create Claude.ai workflow
mkdir -p .github/workflows
```

**Create `.github/workflows/claude-review.yml`:**
```yaml
name: Claude AI Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude AI Review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Review this Shopify HTML custom build for quality, security, and best practices."
```

### **Step 8: Project Standards File**
**Create `CLAUDE.md` in repository root:**
```markdown
# Claude AI Project Standards

## Shopify HTML Custom Build Guidelines

### Code Standards
- Use semantic HTML5
- Follow BEM CSS methodology
- Implement responsive design
- Ensure accessibility (WCAG 2.1)

### Security Requirements
- Sanitize all user inputs
- Use HTTPS for all API calls
- Implement CSRF protection
- Validate all form data

### Performance Standards
- Optimize images (WebP format)
- Minimize CSS/JS bundles
- Implement lazy loading
- Use CDN for static assets

### API Integration
- Separate API layer from Shopify
- Implement proper error handling
- Use environment variables for endpoints
- Implement rate limiting
```

---

## **Phase 4: Team Development Environment**

### **Step 9: Team Onboarding**
```bash
# Each team member runs:
git clone https://github.com/InnerAnimal/spartans.git
cd spartans
npm install
cp env.example .env
# Add their API keys to .env
```

### **Step 10: Development Commands**
```bash
# Development workflow
npm run dev              # Start development server
npm run build            # Build for production
npm run claude:review    # AI code review
npm run security:scan    # Security analysis
npm run notion:sync      # Sync with team workspace
```

---

## **Phase 5: Shopify Custom Build Architecture**

### **Step 11: Project Structure**
```
shopify-custom-build/
├── src/
│   ├── modals/           # Custom popup modals
│   ├── components/       # Reusable components
│   ├── styles/          # Custom CSS
│   ├── scripts/         # JavaScript modules
│   └── api/             # API integration layer
├── templates/           # Shopify templates
├── sections/            # Shopify sections
├── assets/              # Static assets
└── config/              # Configuration files
```

### **Step 12: Modal System Architecture**
```javascript
// src/modals/ModalManager.js
class ModalManager {
  constructor() {
    this.modals = new Map();
    this.activeModal = null;
  }
  
  createModal(config) {
    // Create custom modal with API integration
  }
  
  showModal(id) {
    // Display modal with animations
  }
  
  hideModal(id) {
    // Hide modal with cleanup
  }
}
```

---

## **Phase 6: API Integration Strategy**

### **Step 13: Separate API Layer**
```javascript
// src/api/ApiManager.js
class ApiManager {
  constructor() {
    this.baseUrl = process.env.API_BASE_URL;
    this.apiKey = process.env.API_KEY;
  }
  
  async makeRequest(endpoint, data) {
    // Handle API calls independently of Shopify
  }
  
  async syncWithShopify(data) {
    // Sync data with Shopify when needed
  }
}
```

### **Step 14: Environment Configuration**
```bash
# .env file for team
API_BASE_URL=https://your-api-domain.com
API_KEY=your-api-key
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-shopify-token
```

---

## **Phase 7: Quality Assurance & Security**

### **Step 15: Automated Testing**
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/jest-dom
npm install --save-dev cypress

# Create test files
mkdir tests
touch tests/modal.test.js
touch tests/api.test.js
```

### **Step 16: Security Implementation**
```javascript
// src/security/SecurityManager.js
class SecurityManager {
  sanitizeInput(input) {
    // Sanitize user inputs
  }
  
  validateForm(data) {
    // Validate form data
  }
  
  checkCSRF(token) {
    // CSRF protection
  }
}
```

---

## **Phase 8: Deployment & Production**

### **Step 17: Build Process**
```bash
# Production build
npm run build:production

# Deploy to Shopify
shopify theme deploy

# Deploy to custom hosting
npm run deploy:custom
```

### **Step 18: Monitoring & Analytics**
```javascript
// src/analytics/AnalyticsManager.js
class AnalyticsManager {
  trackModalUsage(modalId) {
    // Track modal interactions
  }
  
  trackAPICalls(endpoint) {
    // Monitor API performance
  }
}
```

---

## **🎯 Success Metrics**

### **Development Efficiency**
- **Code Quality**: 100% automated testing
- **Security**: Zero vulnerabilities
- **Performance**: <2s load times
- **Team Productivity**: AI-assisted development

### **Business Goals**
- **Shopify Version**: Complete custom build
- **Independent Version**: Separate from Shopify
- **Team Learning**: Enhanced development skills
- **Cost Efficiency**: Minimal third-party dependencies

---

## **📋 Immediate Action Items**

### **Today (30 minutes)**
1. ✅ Set up Claude.ai API key
2. ✅ Test Claude.ai integration
3. ✅ Create GitHub team access
4. ✅ Set up project structure

### **This Week**
1. 🔄 Team onboarding and environment setup
2. 🔄 Shopify development environment
3. 🔄 Custom modal system architecture
4. 🔄 API integration planning

### **Next Week**
1. 📅 Begin Shopify custom build
2. 📅 Implement modal system
3. 📅 Set up API layer
4. 📅 Quality assurance testing

---

## **💰 Cost-Effective Strategy**

### **Minimal Dependencies**
- **Shopify CLI**: Free
- **Claude.ai**: Pay-per-use (efficient)
- **GitHub**: Free for private repos
- **Custom API**: Self-hosted (no ongoing costs)

### **Team Development**
- **Learning Focus**: Build skills instead of buying solutions
- **Custom Solutions**: Tailored to your needs
- **Future-Proof**: Independent of third-party changes

---

**Ready to begin? Start with Step 1 and let me know when you're ready for the next phase!** 🚀
