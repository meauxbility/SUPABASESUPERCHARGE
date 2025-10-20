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

    // Test Supabase connection
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
