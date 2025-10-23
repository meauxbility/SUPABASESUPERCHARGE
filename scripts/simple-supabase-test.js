#!/usr/bin/env node

// Simple Supabase connection test
const https = require('https');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  const url = 'https://ghiulqoqujsiofsjcrqk.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXVscW9xdWpzaW9mc2pjcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjAwOTAsImV4cCI6MjA3NjUzNjA5MH0.gJc7lCi9JMVhNAdon44Zuq5hT15EVM3Oyi-iszfJWSA';
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'ghiulqoqujsiofsjcrqk.supabase.co',
      port: 443,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`📡 Supabase API Status: ${res.statusCode}`);
      
      if (res.statusCode === 200 || res.statusCode === 401) {
        console.log('✅ Supabase connection successful');
        console.log('📦 Project: meauxbility-production');
        console.log('🔗 URL: https://ghiulqoqujsiofsjcrqk.supabase.co');
        resolve(true);
      } else {
        console.log('❌ Supabase connection failed');
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log('❌ Connection error:', error.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Connection timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

testSupabaseConnection().then(success => {
  if (success) {
    console.log('✅ Supabase verification completed');
    process.exit(0);
  } else {
    console.log('❌ Supabase verification failed');
    process.exit(1);
  }
});
