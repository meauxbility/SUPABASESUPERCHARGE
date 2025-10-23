import Layout from '../components/Layout';

export default function AboutSam() {
  return (
    <Layout title="About Sam Primeaux - Meauxbility" description="Learn about Sam Primeaux, founder of Meauxbility and spinal cord injury survivor.">
      <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', color: '#0C2D31' }}>
              About Sam Primeaux
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#173E45', maxWidth: '800px', margin: '0 auto' }}>
              Founder, survivor, and advocate for spinal cord injury recovery
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <img 
                src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/sam-smile-pikes-peak.jpg?v=1754025762" 
                alt="Sam Primeaux at Pikes Peak"
                style={{ width: '100%', borderRadius: '20px', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0C2D31' }}>
                From Paralysis to Purpose
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: '#173E45', marginBottom: '1.5rem' }}>
                In 2017, Sam's life changed forever when he experienced a spinal cord injury. 
                Instead of letting this define his limitations, Sam turned his experience into 
                a mission to help others navigate their own recovery journeys.
              </p>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: '#173E45' }}>
                Today, Sam leads Meauxbility with the belief that <strong style={{ color: '#FF6B00' }}>more options, 
                more access, and more life</strong> are possible for every survivor.
              </p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E85D00 100%)', borderRadius: '20px', padding: '3rem', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
              "Built by a survivor for survivors."
            </h2>
            <p style={{ fontSize: '1.25rem', opacity: '0.9' }}>
              Sam's lived experience drives every decision at Meauxbility, ensuring our solutions 
              are practical, accessible, and truly transformative.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
