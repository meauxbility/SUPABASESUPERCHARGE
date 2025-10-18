# Claude AI Project Standards - Meauxbility

## Shopify HTML Custom Build Guidelines

### Code Standards
- Use semantic HTML5 with proper accessibility attributes
- Follow BEM CSS methodology for maintainable styles
- Implement responsive design (mobile-first approach)
- Ensure WCAG 2.1 AA accessibility compliance
- Use TypeScript for JavaScript modules when possible

### Security Requirements
- Sanitize all user inputs with proper validation
- Use HTTPS for all API calls and external resources
- Implement CSRF protection for all forms
- Validate all form data on both client and server side
- Never expose API keys or sensitive data in client-side code

### Performance Standards
- Optimize images (WebP format with fallbacks)
- Minimize CSS/JS bundles with tree shaking
- Implement lazy loading for images and components
- Use CDN for static assets
- Achieve <2 second load times on mobile

### API Integration
- Separate API layer from Shopify dependencies
- Implement proper error handling and retry logic
- Use environment variables for all endpoints
- Implement rate limiting and request throttling
- Create fallback mechanisms for API failures

### Modal System Requirements
- Create reusable modal components
- Implement smooth animations and transitions
- Ensure keyboard navigation and screen reader support
- Use CSS custom properties for theming
- Implement proper focus management

### Team Collaboration
- Use conventional commit messages
- Create comprehensive documentation
- Implement automated testing
- Follow code review best practices
- Maintain consistent coding style

### Shopify Integration
- Create custom sections for flexibility
- Use Shopify's theme settings for configuration
- Implement proper schema markup
- Ensure compatibility with Shopify's checkout process
- Plan for easy migration to independent platform

### Future-Proofing
- Design for easy extraction from Shopify
- Use modular architecture
- Implement proper abstraction layers
- Plan for independent hosting
- Maintain clean separation of concerns
