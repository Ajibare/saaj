import { createHash } from "node:crypto";

const UPLOAD_FOLDER = "saaj";

export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export function cloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function requireCloudinary(): CloudinaryConfig {
  const config = cloudinaryConfig();
  if (!config) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
  }
  return config;
}

/**
 * Signs a browser upload so the media libraries can post files straight to
 * Cloudinary without the file ever passing through the Next.js server.
 */
export function signUploadParams(): {
  cloudName: string;
  apiKey: string;
  timestamp: string;
  folder: string;
  signature: string;
} {
  const { cloudName, apiKey, apiSecret } = requireCloudinary();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const params: Record<string, string> = {
    folder: UPLOAD_FOLDER,
    timestamp,
  };
  const signature = sign(params, apiSecret);
  return { cloudName, apiKey, timestamp, folder: UPLOAD_FOLDER, signature };
}

/**
 * Signs a resource destruction request so the deletion flow can remove the
 * Cloudinary asset along with the Media record.
 */
export function signDestroyParams(publicId: string, resourceType: string): {
  timestamp: string;
  signature: string;
} {
  const { apiSecret } = requireCloudinary();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = sign(
    { public_id: publicId, resource_type: resourceType, timestamp },
    apiSecret
  );
  return { timestamp, signature };
}

export async function destroyCloudinaryAsset(publicId: string, resourceType: string): Promise<boolean> {
  const { cloudName, apiKey } = requireCloudinary();
  const { timestamp, signature } = signDestroyParams(publicId, resourceType);
  const form = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey,
    resource_type: resourceType,
    timestamp,
    signature,
  });
  const endpoint = resourceType === "video" ? "video" : "image";
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}/destroy`,
      { method: "POST", body: form }
    );
    if (!res.ok) {
      console.error("Cloudinary destroy failed with status", res.status);
      return false;
    }
    const data = await res.json();
    return data.result === "ok" || data.result === "not found";
  } catch (error) {
    console.error("Cloudinary destroy error:", error);
    return false;
  }
}

export function resourceTypeFromMime(mimeType: string): string {
  return mimeType.startsWith("video/") ? "video" : "image";
}

function sign(params: Record<string, string>, apiSecret: string): string {
  const toSign =
    Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&") + apiSecret;
  return createHash("sha1").update(toSign).digest("hex");
}