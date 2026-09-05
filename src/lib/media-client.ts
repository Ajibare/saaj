export const MEDIA_MAX_SIZE = 50 * 1024 * 1024;

const MEDIA_ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

export type UploadedMedia = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string | null;
  createdAt: string;
};

export type MediaUploadResult =
  | { ok: true; items: UploadedMedia[]; failed: number }
  | { ok: false; message: string };

/**
 * Uploads files directly to Cloudinary from the browser (signed by the server),
 * then registers each upload in the media library. Keeping files out of the
 * Next.js request body means large images and videos (up to 50 MB) work even on
 * hosted serverless functions with small body limits.
 */
export async function uploadMediaFiles(
  files: File[],
  alt?: string
): Promise<MediaUploadResult> {
  for (const file of files) {
    if (file.size > MEDIA_MAX_SIZE) {
      return {
        ok: false,
        message: `"${file.name}" is larger than 50 MB. Maximum size is 50 MB per file.`,
      };
    }
    if (file.type && !MEDIA_ALLOWED_TYPES.has(file.type)) {
      return {
        ok: false,
        message: `"${file.name}" has an unsupported file type. Use PNG, JPG, JPEG, WebP, GIF, AVIF, SVG, MP4, WEBM or MOV.`,
      };
    }
  }

  const signResponse = await fetch("/api/media/sign", { cache: "no-store" });
  const signData = await signResponse.json();
  if (!signData.ok || !signData.signature) {
    const reason =
      signData.status === 401 || signResponse.status === 401
        ? "You must be signed in to upload files."
        : signData.message ?? "File upload is not available right now.";
    return { ok: false, message: reason };
  }

  const items: UploadedMedia[] = [];
  let failed = 0;

  for (const file of files) {
    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("api_key", signData.apiKey);
      uploadForm.append("timestamp", signData.timestamp);
      uploadForm.append("folder", signData.folder);
      uploadForm.append("signature", signData.signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
        { method: "POST", body: uploadForm }
      );
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || uploadData.error || !uploadData.secure_url) {
        failed += 1;
        if (items.length === 0 && uploadData.error?.message) {
          return { ok: false, message: uploadData.error.message };
        }
        continue;
      }

      const registerResponse = await fetch("/api/media/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          filename: file.name,
          alt,
        }),
      });
      const registerData = await registerResponse.json();
      if (!registerData.ok || !registerData.item) {
        failed += 1;
        continue;
      }
      items.push(registerData.item);
    } catch {
      failed += 1;
      if (items.length === 0) {
        return { ok: false, message: "Upload failed. Please check your connection and try again." };
      }
    }
  }

  if (items.length === 0) {
    return { ok: false, message: "Could not upload the selected files." };
  }
  return { ok: true, items, failed };
}