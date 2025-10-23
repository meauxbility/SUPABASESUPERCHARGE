import Layout from '../components/Layout';

export default function FAQ() {
  const faqs = [
    {
      question: "What is Meauxbility?",
      answer: "Meauxbility is a nonprofit organization founded by spinal cord injury survivor Sam Primeaux. We connect people with spinal cord injuries to treatments, technology, and community that change outcomes."
    },
    {
      question: "How can I get help?",
      answer: "You can apply for our recovery grant program, access our resource library, or connect with our peer support network. Visit our 'Get Support' page to start your journey."
    },
    {
      question: "What types of funding do you provide?",
      answer: "We provide grants for adaptive equipment, therapy sessions, home modifications, and other recovery-related expenses. Each application is reviewed based on individual need and available funding."
    },
    {
      question: "How can I donate?",
      answer: "You can donate through our secure online platform. We accept one-time donations or monthly recurring donations. All donations are tax-deductible as we are a 501(c)(3) organization."
    },
    {
      question: "Are you a legitimate nonprofit?",
      answer: "Yes, Meauxbility is a registered 501(c)(3) nonprofit organization with EIN 33-4214907. All donations are tax-deductible to the full extent allowed by law."
    },
    {
      question: "How can I volunteer?",
      answer: "We welcome volunteers in various capacities including peer support, administrative assistance, and community outreach. Contact us to learn about current volunteer opportunities."
    }
  ];

  return (
    <Layout title="FAQ - Meauxbility" description="Frequently asked questions about Meauxbility and our services.">
      <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', color: '#0C2D31' }}>
              Frequently Asked Questions
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#173E45' }}>
              Find answers to common questions about Meauxbility
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ 
                background: 'white', 
                borderRadius: '16px', 
                padding: '2rem', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid rgba(12,45,49,0.08)'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem', 
                  color: '#0C2D31' 
                }}>
                  {faq.question}
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.6', 
                  color: '#173E45' 
                }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #FF6B35, #E85D00)', 
            borderRadius: '20px', 
            padding: '3rem', 
            color: 'white', 
            textAlign: 'center', 
            marginTop: '4rem' 
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
              Still Have Questions?
            </h2>
            <p style={{ fontSize: '1.125rem', opacity: '0.9', marginBottom: '2rem' }}>
              We're here to help. Contact us directly and we'll get back to you within 24 hours.
            </p>
            <button style={{ 
              background: 'white', 
              color: '#FF6B35', 
              border: 'none', 
              padding: '1rem 2rem', 
              borderRadius: '12px', 
              fontSize: '1.125rem', 
              fontWeight: '700', 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
