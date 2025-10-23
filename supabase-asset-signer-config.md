# Supabase Asset Signer Configuration

## Recommended Settings

### Bucket Configuration
```
bucket_allowlist: ["meauxbility-assets", "meauxbility-uploads", "meauxbility-public"]
```

### TTL Settings
```
default_ttl_seconds: 3600
accept_explicit_ttl: true
```

## Implementation Details

### Function Endpoint
```
POST ${SUPABASE_FUNCTION_ASSET_SIGNER_URL}/sign
```

### Headers
```
Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}
Content-Type: application/json
```

### Request Body
```json
{
  "path": "meauxbility-assets/path/to/object.png",
  "ttl": 1800
}
```

### Response
```json
{
  "signed_url": "https://ghiulqoqujsiofsjcrqk.supabase.co/storage/v1/object/sign/meauxbility-assets/path/to/object.png?token=..."
}
```

## Bucket Names to Confirm
Please verify these bucket names exist in your Supabase Storage:
- `meauxbility-assets`
- `meauxbility-uploads` 
- `meauxbility-public`

## TTL Recommendations
- **Default:** 3600 seconds (1 hour)
- **Short-lived:** 1800 seconds (30 minutes)
- **Long-lived:** 7200 seconds (2 hours)
