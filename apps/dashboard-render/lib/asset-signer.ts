// Asset Signer Client for Meauxbility
// Secure client for generating signed URLs for Supabase Storage

interface AssetSignerRequest {
  path?: string;
  bucket?: string;
  object?: string;
  ttl?: number;
}

interface AssetSignerResponse {
  signed_url: string;
  expires_in: number;
}

export class AssetSignerClient {
  private baseUrl: string;
  private serviceRoleKey: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_ASSET_SIGNER_URL || 
                   'https://ghiulqoqujsiofsjcrqk.supabase.co/functions/v1/asset_signer';
    this.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  }

  /**
   * Generate a signed URL for a file in Supabase Storage
   * @param request - The asset signer request
   * @returns Promise with signed URL and expiration info
   */
  async signAsset(request: AssetSignerRequest): Promise<AssetSignerResponse> {
    if (!this.serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for asset signing');
    }

    // Validate TTL if provided
    if (request.ttl && (request.ttl < 60 || request.ttl > 604800)) {
      throw new Error('TTL must be between 60 and 604800 seconds');
    }

    try {
      const response = await fetch(`${this.baseUrl}/sign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Asset signer failed: ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Asset signer error:', error);
      throw error;
    }
  }

  /**
   * Generate signed URL using path format
   * @param path - Full path including bucket (e.g., "meauxbility-public/images/logo.png")
   * @param ttl - Optional TTL in seconds (default: 3600)
   */
  async signByPath(path: string, ttl?: number): Promise<AssetSignerResponse> {
    return this.signAsset({ path, ttl });
  }

  /**
   * Generate signed URL using bucket/object format
   * @param bucket - Bucket name
   * @param object - Object path within bucket
   * @param ttl - Optional TTL in seconds (default: 3600)
   */
  async signByBucketObject(bucket: string, object: string, ttl?: number): Promise<AssetSignerResponse> {
    return this.signAsset({ bucket, object, ttl });
  }

  /**
   * Check if asset signer is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const assetSigner = new AssetSignerClient();

// Helper functions for common use cases
export const signPublicAsset = (path: string, ttl?: number) => 
  assetSigner.signByPath(`meauxbility-public/${path}`, ttl);

export const signUploadAsset = (path: string, ttl?: number) => 
  assetSigner.signByPath(`meauxbility-uploads/${path}`, ttl);

export const signAssetFile = (path: string, ttl?: number) => 
  assetSigner.signByPath(`meauxbility-assets/${path}`, ttl);
