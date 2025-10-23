// Sam Primeaux Marketing Page - Ported from meauxbility.org
export default function MarketingPage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;900&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #f0f7f8;
          background: #0a1416;
          scroll-behavior: smooth;
        }

        :root {
          --teal: #1F97A9;
          --teal-light: #3AAFBF;
          --teal-dark: #176B78;
          --teal-steel: #0a1416;
          --orange: #FF7619;
          --orange-bright: #FF8C3A;
          --text-dark: #2c3e45;
          --text-muted: #5a6c78;
          --text-light: #f0f7f8;
          --white: #ffffff;
          --light-gray: #f8fafb;
          --border-light: rgba(0, 0, 0, 0.08);
          --border-teal: rgba(31, 151, 169, 0.25);
          --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.08);
          --shadow-teal: 0 6px 25px rgba(31, 151, 169, 0.2);
          --shadow-glow: 0 0 40px rgba(255, 118, 25, 0.3);
          --glass: rgba(15, 31, 34, 0.88);
          --radius: 16px;
          --radius-large: 40px;
        }

        .sam-hero-section {
          background: linear-gradient(135deg, var(--teal-steel) 0%, var(--teal-dark) 50%, var(--teal) 100%);
          padding: 3rem 0 4rem;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          position: relative;
          overflow: hidden;
        }

        .sam-hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(31, 151, 169, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(58, 175, 191, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 118, 25, 0.03) 0%, transparent 60%);
          pointer-events: none;
          z-index: 1;
        }

        .hero-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
        }

        .hero-primary {
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .hero-secondary {
          padding-bottom: 2rem;
        }

        .hero-title-section {
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
          animation: titleEntrance 1s ease-out forwards;
        }

        @keyframes titleEntrance {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-main-title {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(2.5rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .hero-title-line-1 {
          display: block;
          color: var(--white);
          text-shadow: 
            0 2px 20px rgba(31, 151, 169, 0.6),
            0 4px 40px rgba(31, 151, 169, 0.4);
        }

        .hero-title-line-2 {
          display: block;
          background: linear-gradient(135deg, var(--orange) 0%, var(--orange-bright) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 20px rgba(255, 118, 25, 0.4));
        }

        .hero-tagline {
          font-size: clamp(1.05rem, 2.2vw, 1.5rem);
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          font-weight: 400;
        }

        .hero-tagline strong {
          color: var(--orange-bright);
          font-weight: 700;
        }

        .about-man-img-card {
          position: relative;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          border-radius: var(--radius-large);
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0,0,0,0.5), 
            0 6px 25px rgba(31, 151, 169, 0.3),
            0 0 0 4px #fff;
          background: #1a1a1a;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          animation: imageEntrance 1.2s ease-out 0.3s forwards;
          opacity: 0;
        }

        @keyframes imageEntrance {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .about-man-img-card:hover {
          transform: translateY(-6px);
          box-shadow: 
            0 16px 48px rgba(0,0,0,0.6), 
            0 8px 30px rgba(31, 151, 169, 0.4),
            0 0 60px rgba(255, 118, 25, 0.15),
            0 0 0 4px #fff;
        }

        .about-man-img-card img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          object-position: center;
          filter: brightness(0.92) contrast(1.08) saturate(1.05);
          transition: filter .4s;
          background: #1a1a1a;
        }

        .about-man-img-card:hover img {
          filter: brightness(1.0) contrast(1.12) saturate(1.1);
        }

        .hero-badge-reveal {
          text-align: center;
          margin-top: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .hero-badge-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .impact-badge {
          display: inline-block;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(0.85rem, 1.8vw, 1.1rem);
          font-weight: 800;
          letter-spacing: 0.15em;
          color: var(--orange);
          background: rgba(255, 118, 25, 0.1);
          backdrop-filter: blur(10px);
          padding: 12px 28px;
          border-radius: 12px;
          border: 2px solid rgba(255, 118, 25, 0.3);
          text-shadow: 0 2px 10px rgba(255, 118, 25, 0.3);
          box-shadow: 
            0 4px 20px rgba(255, 118, 25, 0.2),
            0 0 40px rgba(255, 118, 25, 0.1);
          position: relative;
          overflow: hidden;
        }

        .section-spacer {
          height: 4rem;
          width: 100%;
        }

        .hero-content {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow-teal);
          border: 1px solid var(--border-teal);
          padding: clamp(2.5rem, 5vw, 4rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(2rem, 5vw, 4rem);
          width: 100%;
          backdrop-filter: blur(20px);
          transition: all 0.5s ease;
          animation: cardSlideIn 1s ease-out 0.6s forwards;
          opacity: 0;
        }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-text {
          flex: 1;
          max-width: 60%;
        }

        .work-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(0.75rem, 1.2vw, 0.85rem);
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--teal);
          background: rgba(31, 151, 169, 0.08);
          padding: 8px 16px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(31, 151, 169, 0.15);
        }

        .kicker-icon {
          font-size: 1.2em;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .title-line-1 {
          display: block;
          color: var(--teal);
          font-style: italic;
          text-shadow: 0 4px 20px rgba(31, 151, 169, 0.15);
        }

        .title-line-2 {
          display: block;
          color: var(--orange);
          font-style: italic;
          text-shadow: 0 4px 20px rgba(255, 118, 25, 0.15);
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 2vw, 1.3rem);
          color: var(--text-muted);
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .hero-subtitle strong {
          color: var(--text-dark);
          font-weight: 600;
        }

        .stats-micro {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .stat-micro {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-number {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 900;
          background: linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .stat-label {
          font-size: clamp(0.7rem, 1vw, 0.8rem);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .hero-image {
          flex: 0 0 auto;
          max-width: 320px;
          width: 100%;
          position: relative;
        }

        .image-card {
          background: var(--white);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow-teal);
          border: 1px solid var(--border-teal);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          position: relative;
          z-index: 2;
        }

        .image-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 40px rgba(31, 151, 169, 0.35);
        }

        .image-card img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          filter: brightness(0.95) contrast(1.05);
          transition: filter 0.3s ease;
        }

        .image-card:hover img {
          filter: brightness(1.05) contrast(1.1);
        }

        .image-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          padding: 10px 16px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .image-badge span {
          font-size: clamp(0.75rem, 1.2vw, 0.9rem);
          font-weight: 700;
          color: white;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .cta-section {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #0B1426 0%, #1F2A3A 100%);
        }

        .cta-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #f0f7f8;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          font-size: 1.2rem;
          color: #c4d8db;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: 1rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cta-primary {
          background: linear-gradient(135deg, #1F97A9, #3AAFBF);
          color: white;
          box-shadow: 0 4px 20px rgba(31, 151, 169, 0.3);
        }

        .cta-secondary {
          background: rgba(31, 151, 169, 0.1);
          color: #f0f7f8;
          border: 1px solid rgba(31, 151, 169, 0.3);
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(31, 151, 169, 0.4);
        }

        .cta-secondary:hover {
          background: rgba(31, 151, 169, 0.2);
          transform: translateY(-2px);
        }

        @media (max-width: 968px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 2.5rem;
          }
          
          .hero-text {
            max-width: 100%;
          }

          .stats-micro {
            justify-content: center;
          }

          .work-kicker {
            margin: 0 auto 1.5rem;
          }
          
          .hero-image {
            max-width: 300px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .hero-container {
            padding: 0 1rem;
          }
          
          .hero-image {
            max-width: 260px;
          }

          .stats-micro {
            gap: 1.5rem;
          }

          .section-spacer {
            height: 2rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="sam-hero-section">
        <div className="hero-container hero-primary">
          <div className="hero-title-section">
            <h1 className="hero-main-title">
              <span className="hero-title-line-1">Sam Primeaux</span>
              <span className="hero-title-line-2">Redefining Impossible</span>
            </h1>
            <p className="hero-tagline">
              From complete paralysis to standing at 14,115 feet. 
              <strong>This isn't a comeback story—it's a revolution.</strong>
            </p>
          </div>

          <div className="about-man-img-card">
            <img
              src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/sam-smile-pikes-peak.jpg?v=1754025762"
              alt="Sam Primeaux standing in front of his wheelchair at Pikes Peak summit - defying paralysis since 2017"
            />
          </div>

          <div className="hero-badge-reveal" id="badgeReveal">
            <span className="impact-badge">PARALYZED 2017 • STANDING 2024</span>
          </div>
        </div>

        <div className="section-spacer"></div>

        <div className="hero-container hero-secondary">
          <div className="hero-content" id="heroContent">
            <div className="hero-text">
              <div className="work-kicker">
                <span className="kicker-icon">⚡</span>
                <span>DIGITAL INNOVATOR</span>
              </div>
              <h2 className="hero-title">
                <span className="title-line-1">Turning Ideas</span>
                <span className="title-line-2">Into Digital Impact</span>
              </h2>
              <p className="hero-subtitle">
                When you've learned to rewire paralyzed nerves, building digital systems is second nature. 
                I bring the same relentless innovation to <strong>viral content</strong>, <strong>web development</strong>, and <strong>motivational speaking</strong> that got me standing again.
              </p>
              <div className="stats-micro">
                <div className="stat-micro">
                  <span className="stat-number">8+</span>
                  <span className="stat-label">Years Defying Odds</span>
                </div>
                <div className="stat-micro">
                  <span className="stat-number">33K+</span>
                  <span className="stat-label">Community Strong</span>
                </div>
                <div className="stat-micro">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">Possible</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-card">
                <img src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/sam_smile_stand_train_unique.jpg?v=1754338529" 
                     alt="Sam Primeaux - Digital Success Expert" 
                     loading="lazy" />
                <div className="image-badge">
                  <span>CEO • Developer • Speaker</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Build Something Extraordinary?</h2>
        <p className="cta-subtitle">
          Let's create a digital experience that tells your story with authenticity, 
          performs flawlessly, and creates lasting impact for your audience.
        </p>
        <div className="cta-buttons">
          <a href="/app" className="cta-button cta-primary">Access Dashboard</a>
          <a href="mailto:meauxbility@gmail.com" className="cta-button cta-secondary">Get In Touch</a>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Scroll-triggered badge reveal
          window.addEventListener('scroll', function() {
            const badge = document.getElementById('badgeReveal');
            const imageCard = document.querySelector('.about-man-img-card');
            
            if (badge && imageCard) {
              const imageBottom = imageCard.getBoundingClientRect().bottom;
              const windowHeight = window.innerHeight;
              
              // Reveal badge when image is 60% scrolled past
              if (imageBottom < windowHeight * 0.6) {
                badge.classList.add('visible');
              }
            }
          });
        `
      }} />
    </>
  );
}
