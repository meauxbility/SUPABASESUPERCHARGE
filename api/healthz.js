// Health check endpoint for Render
export default function handler(req, res) {
  res.status(200).json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    service: 'meauxbility-static',
    version: '1.0.0',
    status: 'healthy'
  });
}
