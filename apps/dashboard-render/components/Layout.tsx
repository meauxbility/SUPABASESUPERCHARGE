import Head from 'next/head';
import { ReactNode } from 'react';
import '../styles/footer.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title = 'Meauxbility', description = 'Built by a survivor for survivors' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      
      {/* Shopify Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="/" style={{ textDecoration: 'none', color: 'white' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>Meauxbility</h1>
            </a>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Home</a>
              <a href="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Admin</a>
              <a href="https://meauxbility.org/pages/donmichael-our-first-campaign" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Campaign</a>
            </nav>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              Get Support
            </button>
            <button style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              Donate
            </button>
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>

      {/* Premium Shopify Footer */}
      <footer className="mbx-footer" id="mbx-footer" role="contentinfo">
        {/* 3D GLB Accent */}
        <div className="mbx-3d-accent" aria-hidden="true">
          <model-viewer
            src="https://cdn.shopify.com/3d/models/4b0a47ca8a38b77c/Kinetic_Symmetry_0831084700_generate.glb"
            alt="Decorative 3D element"
            auto-rotate
            rotation-per-second="18deg"
            camera-controls="false"
            disable-zoom
            disable-pan
            disable-tap
            interaction-prompt="none"
            shadow-intensity="0"
            exposure="1.2"
            loading="lazy"
            reveal="auto">
          </model-viewer>
        </div>

        <div className="mbx-footer-container">
          <div className="mbx-footer-grid">
            {/* Brand Column */}
            <div className="mbx-footer-brand">
              <a href="/" className="mbx-footer-logo" aria-label="Meauxbility Home">
                <picture>
                  <source srcSet="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661" type="image/webp" />
                  <img 
                    src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.png?v=1760648662" 
                    alt="Meauxbility - Empowering mobility and independence"
                    width="220"
                    height="220"
                    loading="lazy"
                  />
                </picture>
              </a>
              
              <div className="mbx-footer-social" role="list">
                <a className="mbx-social-link" aria-label="Facebook" href="https://www.facebook.com/p/Meauxbility-61577795721851/" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a className="mbx-social-link" aria-label="Instagram" href="https://www.instagram.com/meauxbility/" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 15.838a3.838 3.838 0 110-7.676 3.838 3.838 0 010 7.676zM18.406 5.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                  </svg>
                </a>
              </div>
              
              <p>
                More Options. More Access. More Life. Join us as we transform obstacles into pathways for adaptive athletes and spinal cord injury survivors.
              </p>
              
              <div className="mbx-footer-cta">
                <a className="mbx-btn mbx-btn-primary" href="https://meauxbility.org/pages/donmichael-our-first-campaign">
                  DonMichael's Campaign
                </a>
                <button className="mbx-btn mbx-btn-outline" onClick={() => (window as any).openDonateModal?.()}>
                  Donate Now
                </button>
              </div>
              
              <div className="mbx-newsletter">
                <h4>Stay Connected</h4>
                <p style={{color:'rgba(255,255,255,0.85)',fontSize:'14px',marginBottom:'8px'}}>
                  Get updates on our impact and ways to help
                </p>
                <form className="mbx-newsletter-form" id="mbx-newsletterForm">
                  <input type="email" className="mbx-newsletter-input" placeholder="Enter your email" required aria-label="Email address" />
                  <button type="submit" className="mbx-newsletter-btn">Subscribe</button>
                </form>
              </div>
            </div>

            {/* Resources Column */}
            <div className="mbx-footer-column">
              <h4>Resources</h4>
              <ul className="mbx-footer-links" role="list">
                <li><a href="https://meauxbility.org/pages/meauxbility-branding">Brand Guide</a></li>
                <li><a href="https://meauxbility.org/pages/community">Community</a></li>
                <li><a href="https://meauxbility.org/pages/news-media-features">Latest News</a></li>
                <li><a href="https://meauxbility.org/pages/non-profit-information">501(c)(3) Info</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="mbx-footer-column">
              <h4>Company</h4>
              <ul className="mbx-footer-links" role="list">
                <li><a href="https://meauxbility.org/pages/sam-primeaux">About Sam</a></li>
                <li><a href="https://meauxbility.org/pages/team-meauxbility">Our Team</a></li>
                <li><a href="https://meauxbility.org/pages/about-us">Our Mission</a></li>
                <li><a href="https://meauxbility.org/pages/accessibility-partners">Partners</a></li>
                <li><a href="https://meauxbility.org/pages/contact">Contact</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="mbx-footer-column">
              <h4>Support</h4>
              <ul className="mbx-footer-links" role="list">
                <li><a href="https://meauxbility.org/pages/faq">FAQ</a></li>
                <li><a href="https://meauxbility.org/pages/donate">Ways to Give</a></li>
                <li><a href="https://meauxbility.org/pages/get-involved">Get Involved</a></li>
                <li><a href="https://meauxbility.org/pages/apply-for-funding">Apply for Grant</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mbx-footer-bottom">
            <div className="mbx-footer-legal">
              <a href="https://meauxbility.org/pages/data-sharing-opt-out">Privacy Policy</a>
              <span aria-hidden="true" style={{color:'rgba(255,255,255,0.3)'}}>•</span>
              <a href="https://meauxbility.org/pages/policies">Terms of Service</a>
              <span aria-hidden="true" style={{color:'rgba(255,255,255,0.3)'}}>•</span>
              <a href="https://meauxbility.org/pages/accessibility">Accessibility</a>
            </div>

            <div className="mbx-footer-copyright">
              © <span id="mbx-year">{new Date().getFullYear()}</span> Meauxbility. 501(c)(3) EIN: 33-4214907. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
