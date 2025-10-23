import Layout from '../components/Layout';

export default function TestPage() {
  return (
    <Layout title="Deployment Test - Meauxbility" description="Testing deployment">
      <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#FF6B35' }}>
          🚀 Deployment Test Successful!
        </h1>
        <div style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#0C2D31' }}>
          Your Meauxbility app is live and working!
        </div>
        <div style={{ 
          background: '#f0f9ff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #0ea5e9',
          margin: '2rem 0'
        }}>
          <h2 style={{ color: '#0C2D31', marginBottom: '1rem' }}>Next Steps:</h2>
          <ul style={{ textAlign: 'left', color: '#173E45', lineHeight: '1.8' }}>
            <li>✅ Next.js app is running</li>
            <li>✅ TypeScript is configured</li>
            <li>✅ Supabase client is ready</li>
            <li>✅ Layout component is working</li>
            <li>🔄 Ready for content integration</li>
          </ul>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              background: '#FF6B35',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              marginRight: '1rem'
            }}
          >
            Go to Homepage
          </a>
          <a 
            href="/admin" 
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              background: '#339999',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            Go to Admin
          </a>
        </div>
      </div>
    </Layout>
  );
}
