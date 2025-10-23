import Layout from '../components/Layout';

export default function ApplyForFunding() {
  return (
    <Layout title="Apply for Funding - Meauxbility" description="Apply for Meauxbility's recovery grant program to get the support you need.">
      <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', color: '#0C2D31' }}>
              Apply for Funding
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#173E45' }}>
              Get the financial support you need for your recovery journey
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0C2D31' }}>
              Recovery Grant Program
            </h2>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: '#173E45', marginBottom: '2rem' }}>
              Our recovery grant program provides financial assistance for adaptive equipment, 
              therapy sessions, home modifications, and other recovery-related expenses. 
              We believe that financial barriers shouldn't stand in the way of your progress.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #FF6B35, #E85D00)', borderRadius: '12px', padding: '1.5rem', color: 'white', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Up to $5,000</h3>
                <p style={{ opacity: '0.9' }}>Per grant award</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #339999, #2C8B8B)', borderRadius: '12px', padding: '1.5rem', color: 'white', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>No Interest</h3>
                <p style={{ opacity: '0.9' }}>Grants, not loans</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7928CA)', borderRadius: '12px', padding: '1.5rem', color: 'white', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Quick Review</h3>
                <p style={{ opacity: '0.9' }}>2-4 weeks</p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#0C2D31' }}>
              What We Fund
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              {[
                'Adaptive equipment and assistive technology',
                'Physical and occupational therapy sessions',
                'Home modifications for accessibility',
                'Transportation assistance',
                'Medical supplies and devices',
                'Educational and vocational training'
              ].map((item, index) => (
                <li key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  marginBottom: '0.75rem',
                  fontSize: '1.125rem',
                  color: '#173E45'
                }}>
                  <span style={{ color: '#FF6B35', fontSize: '1.25rem' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <button style={{ 
              background: 'linear-gradient(135deg, #FF6B35, #E85D00)', 
              color: 'white', 
              border: 'none', 
              padding: '1.25rem 2.5rem', 
              borderRadius: '12px', 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%'
            }}>
              Start Your Application
            </button>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #339999, #2C8B8B)', 
            borderRadius: '20px', 
            padding: '3rem', 
            color: 'white', 
            textAlign: 'center' 
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
              Need Help with Your Application?
            </h2>
            <p style={{ fontSize: '1.125rem', opacity: '0.9', marginBottom: '2rem' }}>
              Our team is here to help you through the application process. 
              Contact us if you have any questions or need assistance.
            </p>
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
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
