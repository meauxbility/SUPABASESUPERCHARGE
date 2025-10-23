#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

async function verifySupabase() {
  console.log('🔍 Verifying Supabase connection...');
  
  const supabaseUrl = 'https://ghiulqoqujsiofsjcrqk.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    console.log('❌ No Supabase key found in environment');
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);
    
    if (error && error.message.includes('relation "_supabase_migrations" does not exist')) {
      console.log('✅ Supabase connection successful (migrations table not accessible, which is normal)');
    } else if (error) {
      console.log('⚠️  Supabase connection issue:', error.message);
    } else {
      console.log('✅ Supabase connection successful');
    }

    // Check RLS status
    console.log('🔒 Checking Row Level Security...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_rls_status');
    
    if (tablesError) {
      console.log('⚠️  Could not check RLS status:', tablesError.message);
    } else {
      console.log('✅ RLS status check completed');
    }

    // Test storage buckets
    console.log('🗄️  Checking storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('⚠️  Could not list buckets:', bucketsError.message);
    } else {
      console.log('📦 Available buckets:', buckets.map(b => b.name).join(', '));
      
      const requiredBuckets = ['meauxbility-assets', 'meauxbility-uploads', 'meauxbility-public'];
      const existingBuckets = buckets.map(b => b.name);
      
      for (const bucket of requiredBuckets) {
        if (!existingBuckets.includes(bucket)) {
          console.log(`📦 Creating bucket: ${bucket}`);
          const { error: createError } = await supabase.storage.createBucket(bucket, {
            public: bucket === 'meauxbility-public'
          });
          
          if (createError) {
            console.log(`❌ Failed to create bucket ${bucket}:`, createError.message);
          } else {
            console.log(`✅ Created bucket: ${bucket}`);
          }
        } else {
          console.log(`✅ Bucket exists: ${bucket}`);
        }
      }
    }

    console.log('✅ Supabase verification completed');
    return true;
    
  } catch (error) {
    console.log('❌ Supabase verification failed:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  verifySupabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { verifySupabase };
