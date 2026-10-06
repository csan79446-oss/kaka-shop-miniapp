/**
 * Cloudflare R2 Media Upload Utility ($0 Egress Bandwidth Fees)
 * Uploads product images and demo videos to Cloudflare R2 Object Storage
 */

export interface R2UploadResult {
  url: string;
  key: string;
  size: number;
  mode: 'r2_live' | 'fallback_ready' | 'local_fallback';
  message?: string;
}

export interface R2StatusResult {
  configured: boolean;
  provider: string;
  bucket: string;
  publicDomain: string;
  accountIdMasked?: string | null;
  message: string;
}

/**
 * Check whether Cloudflare R2 credentials are live
 */
export async function checkR2Status(): Promise<R2StatusResult> {
  try {
    const res = await fetch('/api/r2/status');
    if (!res.ok) {
      throw new Error('Failed to get R2 status');
    }
    return await res.json();
  } catch (err: any) {
    return {
      configured: false,
      provider: 'cloudflare_r2',
      bucket: 'phsar24-media',
      publicDomain: 'https://pub-demo.r2.dev',
      message: 'Cloudflare R2 service is offline or in local simulation mode.',
    };
  }
}

/**
 * Upload a File (Image, Video, Audio) to Cloudflare R2 via Backend API
 */
export async function uploadToR2(
  file: File,
  folder: 'products' | 'videos' | 'stores' | 'receipts' = 'products'
): Promise<R2UploadResult> {
  // Convert File to Base64 dataURL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  try {
    const res = await fetch('/api/r2/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || (file.name.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'),
        data: dataUrl,
        folder,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Upload failed with status ${res.status}`);
    }

    const json = await res.json();
    return {
      url: json.url,
      key: json.key,
      size: json.size || file.size,
      mode: json.mode || 'r2_live',
      message: json.message,
    };
  } catch (err: any) {
    console.warn('R2 upload failed, falling back to local data URL:', err);
    // Graceful fallback to local dataURL so user never loses their uploaded media
    return {
      url: dataUrl,
      key: `local/${file.name}`,
      size: file.size,
      mode: 'local_fallback',
      message: err.message,
    };
  }
}
