import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout title="Contact Us - Meauxbility" description="Get in touch with Meauxbility for support, questions, or partnership opportunities.">
      <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', color: '#0C2D31' }}>
              Contact Us
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#173E45', maxWidth: '800px', margin: '0 auto' }}>
              We're here to help. Reach out to us for support, questions, or to learn more about our mission.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0C2D31' }}>
                Get in Touch
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #FF6B35, #E85D00)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📧
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: '#0C2D31' }}>Email</h3>
                    <p style={{ color: '#173E45' }}>info@meauxbility.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #339999, #2C8B8B)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📞
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: '#0C2D31' }}>Phone</h3>
                    <p style={{ color: '#173E45' }}>(555) 123-4567</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #8b5cf6, #7928CA)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📍
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: '#0C2D31' }}>Address</h3>
                    <p style={{ color: '#173E45' }}>123 Recovery Street<br />Hope City, HC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0C2D31' }}>
                Send us a Message
              </h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  style={{ 
                    padding: '1rem', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '8px', 
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  style={{ 
                    padding: '1rem', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '8px', 
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  style={{ 
                    padding: '1rem', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '8px', 
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    resize: 'vertical'
                  }}
                />
                <button 
                  type="submit"
                  style={{ 
                    background: 'linear-gradient(135deg, #FF6B35, #E85D00)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '1rem 2rem', 
                    borderRadius: '8px', 
                    fontSize: '1.125rem', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #339999, #2C8B8B)', 
            borderRadius: '20px', 
            padding: '3rem', 
            color: 'white', 
            textAlign: 'center' 
          }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
              Ready to Make a Difference?
            </h2>
            <p style={{ fontSize: '1.25rem', opacity: '0.9', marginBottom: '2rem' }}>
              Whether you need support, want to volunteer, or are interested in partnership opportunities, 
              we'd love to hear from you.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ 
                background: 'white', 
                color: '#339999', 
                border: 'none', 
                padding: '1rem 2rem', 
                borderRadius: '12px', 
                fontSize: '1.125rem', 
                fontWeight: '700', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Get Support
              </button>
              <button style={{ 
                background: 'transparent', 
                color: 'white', 
                border: '2px solid white', 
                padding: '1rem 2rem', 
                borderRadius: '12px', 
                fontSize: '1.125rem', 
                fontWeight: '700', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Volunteer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
