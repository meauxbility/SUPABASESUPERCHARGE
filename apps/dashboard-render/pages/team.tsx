import Layout from '../components/Layout';

export default function Team() {
  return (
    <Layout title="Our Team - Meauxbility" description="Meet the dedicated team behind Meauxbility's mission.">
      <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', color: '#0C2D31' }}>
              Our Team
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#173E45', maxWidth: '800px', margin: '0 auto' }}>
              Passionate individuals united by a shared mission to transform lives
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #E85D00)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                👨‍💼
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0C2D31' }}>Sam Primeaux</h3>
              <p style={{ color: '#FF6B00', fontWeight: '600', marginBottom: '1rem' }}>Founder & President</p>
              <p style={{ color: '#173E45', lineHeight: '1.6' }}>
                Spinal cord injury survivor and advocate. Leads Meauxbility's vision and strategy.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #339999, #2C8B8B)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                👩‍⚕️
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0C2D31' }}>Medical Advisory Board</h3>
              <p style={{ color: '#339999', fontWeight: '600', marginBottom: '1rem' }}>Healthcare Professionals</p>
              <p style={{ color: '#173E45', lineHeight: '1.6' }}>
                Expert medical professionals providing guidance on treatment options and recovery protocols.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #7928CA)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                🤝
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0C2D31' }}>Community Advocates</h3>
              <p style={{ color: '#8b5cf6', fontWeight: '600', marginBottom: '1rem' }}>Peer Support Network</p>
              <p style={{ color: '#173E45', lineHeight: '1.6' }}>
                Survivors and family members who provide peer support and share their recovery experiences.
              </p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #339999, #2C8B8B)', borderRadius: '20px', padding: '3rem', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
              Join Our Mission
            </h2>
            <p style={{ fontSize: '1.25rem', opacity: '0.9', marginBottom: '2rem' }}>
              We're always looking for passionate individuals who want to make a difference in the spinal cord injury community.
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
              Get Involved
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
