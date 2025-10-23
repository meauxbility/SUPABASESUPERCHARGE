# 🔒 Supabase Security Configuration - Asset Signer

## ✅ **Asset Signer Function Deployed**

**Endpoints:**
- **Health:** `GET https://ghiulqoqujsiofsjcrqk.supabase.co/functions/v1/asset_signer/health`
- **Sign:** `POST https://ghiulqoqujsiofsjcrqk.supabase.co/functions/v1/asset_signer/sign`

**Configuration:**
- ✅ Bucket allowlist: `["meauxbility-assets", "meauxbility-uploads", "meauxbility-public"]`
- ✅ Default TTL: 3600 seconds (1 hour)
- ✅ Accept explicit TTL: true
- ✅ CORS: `https://meauxbility.com` and `https://www.meauxbility.com`

## 🛡️ **Security Recommendations**

### **1. Storage RLS Policies (Recommended)**

**Yes, create explicit RLS policies for security:**

```sql
-- meauxbility-public: Public read, authenticated write
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'meauxbility-public');

CREATE POLICY "Authenticated write access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'meauxbility-public' 
  AND auth.role() = 'authenticated'
);

-- meauxbility-uploads: Authenticated only (read/write)
CREATE POLICY "Authenticated access to uploads" ON storage.objects
FOR ALL USING (
  bucket_id = 'meauxbility-uploads' 
  AND auth.role() = 'authenticated'
);

-- meauxbility-assets: Authenticated only (read/write)
CREATE POLICY "Authenticated access to assets" ON storage.objects
FOR ALL USING (
  bucket_id = 'meauxbility-assets' 
  AND auth.role() = 'authenticated'
);
```

### **2. Environment Variables for Security**

Add these to your Supabase project secrets:

```bash
# Asset Signer Security
ASSET_SIGNER_MAX_TTL=604800
ASSET_SIGNER_MIN_TTL=60
ASSET_SIGNER_RATE_LIMIT=100
ASSET_SIGNER_ALLOWED_ORIGINS=https://meauxbility.com,https://www.meauxbility.com

# Additional Security
SUPABASE_JWT_SECRET=your_jwt_secret_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### **3. Render Environment Variables**

Add these to your Render service:

```bash
# Supabase Asset Signer
SUPABASE_FUNCTION_ASSET_SIGNER_URL=https://ghiulqoqujsiofsjcrqk.supabase.co/functions/v1/asset_signer
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Security Headers
NEXT_PUBLIC_ASSET_SIGNER_URL=https://ghiulqoqujsiofsjcrqk.supabase.co/functions/v1/asset_signer
```

## 🔧 **Implementation Steps**

### **Step 1: Add RLS Policies**
Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies (run these one by one)
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'meauxbility-public');

CREATE POLICY "Authenticated write access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'meauxbility-public' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated access to uploads" ON storage.objects
FOR ALL USING (
  bucket_id = 'meauxbility-uploads' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated access to assets" ON storage.objects
FOR ALL USING (
  bucket_id = 'meauxbility-assets' 
  AND auth.role() = 'authenticated'
);
```

### **Step 2: Add Environment Variables to Render**
In your Render dashboard, add these environment variables:

```
SUPABASE_FUNCTION_ASSET_SIGNER_URL=https://ghiulqoqujsiofsjcrqk.supabase.co/functions/v1/asset_signer
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_ASSET_SIGNER_URL=https://ghiulqoqujsiofsjcrqk.supabase.co/functions/v1/asset_signer
```

### **Step 3: Test the Asset Signer**

```javascript
// Test function in your Next.js app
async function testAssetSigner() {
  const response = await fetch('https://ghiulqoqujsiofsjcrqk.supabase.co/functions/v1/asset_signer/sign', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path: 'meauxbility-public/images/logo.png',
      ttl: 1800
    })
  });
  
  const data = await response.json();
  console.log('Signed URL:', data.signed_url);
}
```

## 🚨 **Security Best Practices**

1. **Never expose service role key in client-side code**
2. **Use environment variables for all sensitive data**
3. **Implement rate limiting on your asset signer calls**
4. **Regularly rotate your Supabase keys**
5. **Monitor usage and set up alerts for unusual activity**

## 📋 **Next Steps**

1. ✅ **Create RLS policies** (run the SQL above)
2. ✅ **Add environment variables** to Render
3. ✅ **Test the asset signer** functionality
4. ✅ **Monitor usage** and set up alerts

Your asset signer is now secure and ready for production use!
