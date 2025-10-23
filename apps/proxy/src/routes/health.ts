import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        database: 'unknown',
        openai: 'unknown'
      }
    };

    // Test Supabase connection Now I'll update the Supabase configuration with your new project credentials. Based on the information you provided:
Project ID: ghiulqoqujsiofsjcrqk
Anon Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA
API Key Publishable: sb_publishable_6Wx6omNR-X-J4ifSdVAo_w_fuRi1XDB 
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        if (error) throw error;
        checks.services.database = 'connected';
      } catch (err) {
        checks.services.database = 'error';
        console.error('Supabase health check failed:', err);
      }
    }

    // Test OpenAI (if key exists)
    if (process.env.OPENAI_API_KEY) {
      checks.services.openai = 'configured';
    }

    res.status(200).json(checks);
  } catch (error) {
    res.status(500).json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
